import { Response } from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middlewares/userMiddleware";

const prisma = new PrismaClient();

export async function getBuyerOrders(_req: AuthRequest, res: Response) {
  try {
    return res.json({ orders: [] });
  } catch (e) {
    return res.status(500).json({ orders: [] });
  }
}

export async function getFreelancerPortfolio(req: AuthRequest, res: Response) {
  try {
    return res.json({ designs: [] });
  } catch (e) {
    return res.status(500).json({ designs: [] });
  }
}

export async function getAdminOverview(_req: AuthRequest, res: Response) {
  try {
    const users = await prisma.user.count();
    const freelancers = await prisma.freelancerApplication.count({
      where: { status: "APPROVED" as any },
    });
    const pendingApprovals = await prisma.freelancerApplication.count({
      where: { status: "PENDING" as any },
    });
    return res.json({
      users,
      freelancers,
      designs: 0,
      orders: 0,
      pendingApprovals,
    });
  } catch (e) {
    return res.status(500).json({
      users: 0,
      freelancers: 0,
      designs: 0,
      orders: 0,
      pendingApprovals: 0,
    });
  }
}

type MarketplaceSort = "newest" | "priceAsc" | "priceDesc" | "rating";

const MARKETPLACE_DEFAULT_PAGE_SIZE = 12;
const MARKETPLACE_MAX_PAGE_SIZE = 48;

export async function getMarketplaceDesigns(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized." });
    }

    const {
      q,
      category,
      page = "1",
      pageSize = String(MARKETPLACE_DEFAULT_PAGE_SIZE),
      sort = "newest",
    } = req.query;

    const pageNumber = Math.max(parseInt(page as string, 10) || 1, 1);
    const pageSizeNumber = Math.min(
      MARKETPLACE_MAX_PAGE_SIZE,
      Math.max(
        parseInt(pageSize as string, 10) || MARKETPLACE_DEFAULT_PAGE_SIZE,
        1
      )
    );

    const categorySlug =
      typeof category === "string" && category.trim().length > 0
        ? category.trim()
        : undefined;
    const searchTerm =
      typeof q === "string" && q.trim().length > 0 ? q.trim() : undefined;
    const sortOption =
      typeof sort === "string" &&
      ["newest", "priceAsc", "priceDesc", "rating"].includes(sort)
        ? (sort as MarketplaceSort)
        : ("newest" as MarketplaceSort);

    const where: Prisma.DesignWhereInput = {
      isPublished: true,
    };

    if (searchTerm) {
      where.OR = [
        { title: { contains: searchTerm, mode: "insensitive" } },
        { description: { contains: searchTerm, mode: "insensitive" } },
      ];
    }

    if (categorySlug && categorySlug !== "all") {
      where.categories = {
        some: {
          category: {
            slug: categorySlug,
          },
        },
      };
    }

    let orderBy:
      | Prisma.DesignOrderByWithRelationInput
      | Prisma.DesignOrderByWithRelationInput[];
    switch (sortOption) {
      case "priceAsc":
        orderBy = { price: "asc" };
        break;
      case "priceDesc":
        orderBy = { price: "desc" };
        break;
      case "rating":
        orderBy = [
          { averageRating: "desc" },
          { reviewCount: "desc" },
          { createdAt: "desc" },
        ];
        break;
      case "newest":
      default:
        orderBy = { createdAt: "desc" };
        break;
    }

    const [total, designs, categories] = await Promise.all([
      prisma.design.count({ where }),
      prisma.design.findMany({
        where,
        orderBy,
        take: pageSizeNumber,
        skip: (pageNumber - 1) * pageSizeNumber,
        include: {
          categories: {
            include: {
              category: true,
            },
          },
          favorites: {
            where: {
              userId,
            },
          },
          _count: {
            select: {
              favorites: true,
            },
          },
        },
      }),
      prisma.category.findMany({
        orderBy: { name: "asc" },
        select: {
          id: true,
          name: true,
          slug: true,
        },
      }),
    ]);

    const mappedDesigns = designs.map((design) => ({
      id: design.id,
      title: design.title,
      description: design.description,
      price: design.price,
      imageUrl: design.imageUrl,
      averageRating: design.averageRating,
      reviewCount: design.reviewCount,
      categories: design.categories.map((c) => ({
        id: c.category.id,
        name: c.category.name,
        slug: c.category.slug,
      })),
      isFavorite: design.favorites.length > 0,
      favoritesCount: design._count.favorites,
    }));

    return res.json({
      designs: mappedDesigns,
      availableCategories: categories,
      pagination: {
        page: pageNumber,
        pageSize: pageSizeNumber,
        total,
        totalPages: Math.max(Math.ceil(total / pageSizeNumber), 1),
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to load marketplace.",
      designs: [],
      availableCategories: [],
      pagination: {
        page: 1,
        pageSize: MARKETPLACE_DEFAULT_PAGE_SIZE,
        total: 0,
        totalPages: 1,
      },
    });
  }
}

export async function toggleDesignFavorite(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized." });
    }

    const { designId } = req.params;
    if (!designId) {
      return res.status(400).json({ message: "Design ID is required." });
    }

    const design = await prisma.design.findFirst({
      where: {
        id: designId,
        isPublished: true,
      },
    });

    if (!design) {
      return res.status(404).json({ message: "Design not found." });
    }

    const existing = await prisma.designFavorite.findUnique({
      where: {
        designId_userId: {
          designId,
          userId,
        },
      },
    });

    if (existing) {
      await prisma.designFavorite.delete({
        where: {
          designId_userId: {
            designId,
            userId,
          },
        },
      });
    } else {
      await prisma.designFavorite.create({
        data: {
          designId,
          userId,
        },
      });
    }

    const favoritesCount = await prisma.designFavorite.count({
      where: { designId },
    });

    return res.json({
      message: existing ? "Removed from favorites." : "Added to favorites.",
      isFavorite: !existing,
      favoritesCount,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update favorite." });
  }
}
