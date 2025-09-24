import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middlewares/userMiddleware";
import { sendEmail } from "../services/mailer";
import { freelancerApplicationApprovedEmailHtml, freelancerApplicationRejectedEmailHtml } from "../emails/templates";

const prisma = new PrismaClient();

export async function listFreelancerApplications(
  req: AuthRequest,
  res: Response
) {
  try {
    const status = (req.query.status as string | undefined)?.toUpperCase();
    const q = (req.query.q as string | undefined)?.trim();
    const page = Math.max(1, parseInt((req.query.page as string) || "1", 10));
    const pageSize = Math.min(50, Math.max(1, parseInt((req.query.pageSize as string) || "10", 10)));
    const sortBy = (req.query.sortBy as string | undefined) || "createdAt"; // createdAt | status
    const sortDir = ((req.query.sortDir as string | undefined) || "desc").toLowerCase() === "asc" ? "asc" : "desc";
    const dateFrom = req.query.dateFrom ? new Date(String(req.query.dateFrom)) : undefined;
    const dateTo = req.query.dateTo ? new Date(String(req.query.dateTo)) : undefined;
    const where: any = {};
    if (
      status === "PENDING" ||
      status === "APPROVED" ||
      status === "REJECTED"
    ) {
      where.status = status;
    }
    if (q) {
      where.user = {
        OR: [
          { email: { contains: q, mode: "insensitive" } },
          { username: { contains: q, mode: "insensitive" } },
          { firstName: { contains: q, mode: "insensitive" } },
          { lastName: { contains: q, mode: "insensitive" } },
        ],
      };
    }
    const [total, apps] = await Promise.all([
      prisma.freelancerApplication.count({
        where: {
          status: where.status,
          ...(q
            ? {
                user: {
                  OR: [
                    { email: { contains: q, mode: "insensitive" } },
                    { username: { contains: q, mode: "insensitive" } },
                    { firstName: { contains: q, mode: "insensitive" } },
                    { lastName: { contains: q, mode: "insensitive" } },
                  ],
                },
              }
            : {}),
          ...(dateFrom || dateTo
            ? {
                createdAt: {
                  ...(dateFrom ? { gte: dateFrom } : {}),
                  ...(dateTo ? { lte: dateTo } : {}),
                },
              }
            : {}),
        },
      }),
      prisma.freelancerApplication.findMany({
      where: {
        ...where,
        ...(dateFrom || dateTo
          ? {
              createdAt: {
                ...(dateFrom ? { gte: dateFrom } : {}),
                ...(dateTo ? { lte: dateTo } : {}),
              },
            }
          : {}),
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: sortBy === "status" ? { status: sortDir as any } : { createdAt: sortDir as any },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    ]);
    return res.json({ applications: apps, total, page, pageSize });
  } catch (e) {
    return res.status(500).json({ message: "Failed to fetch applications." });
  }
}

export async function listUsers(_req: AuthRequest, res: Response) {
  try {
    const q = (_req.query.q as string | undefined)?.trim();
    const role = (_req.query.role as string | undefined)?.toUpperCase();
    const admin = _req.query.admin as string | undefined; // "true" | "false" | undefined
    const active = _req.query.active as string | undefined; // "true" | "false" | undefined
    const page = Math.max(1, parseInt((_req.query.page as string) || "1", 10));
    const pageSize = Math.min(50, Math.max(1, parseInt((_req.query.pageSize as string) || "10", 10)));

    const where: any = {};
    if (q) {
      where.OR = [
        { email: { contains: q, mode: "insensitive" } },
        { username: { contains: q, mode: "insensitive" } },
        { firstName: { contains: q, mode: "insensitive" } },
        { lastName: { contains: q, mode: "insensitive" } },
      ];
    }
    if (role === "BUYER" || role === "FREELANCER") {
      where.role = role as any;
    }
    if (admin === "true" || admin === "false") {
      where.isAdmin = admin === "true";
    }
    if (active === "true" || active === "false") {
      where.isDeleted = active === "true" ? false : true;
    }

    const select = {
      id: true,
      firstName: true,
      lastName: true,
      username: true,
      email: true,
      role: true,
      isAdmin: true,
      verified: true,
      isDeleted: true,
      dateJoined: true,
      updatedAt: true,
    } as const;

    const sortBy = ((_req.query.sortBy as string | undefined) || "dateJoined");
    const sortDir = (((_req.query.sortDir as string | undefined) || "desc").toLowerCase() === "asc" ? "asc" : "desc") as any;
    const orderBy: any =
      sortBy === "firstName" ? { firstName: sortDir } :
      sortBy === "lastName" ? { lastName: sortDir } :
      sortBy === "role" ? { role: sortDir } :
      sortBy === "isAdmin" ? { isAdmin: sortDir } :
      sortBy === "isDeleted" ? { isDeleted: sortDir } :
      { dateJoined: sortDir };

    const [total, users] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({ select, where, orderBy, skip: (page - 1) * pageSize, take: pageSize }),
    ]);
    return res.json({ users, total, page, pageSize });
  } catch (e) {
    return res.status(500).json({ message: "Failed to fetch users." });
  }
}

export async function updateUserRole(req: AuthRequest, res: Response) {
  try {
    const { userId } = req.params as { userId: string };
    const { role } = req.body as { role: "BUYER" | "FREELANCER" };
    if (role !== "BUYER" && role !== "FREELANCER") {
      return res.status(400).json({ message: "Invalid role." });
    }
    const user = await prisma.user.update({ where: { id: userId }, data: { role: role as any } });
    return res.json({ message: "User role updated.", user });
  } catch (e) {
    return res.status(500).json({ message: "Failed to update user role." });
  }
}

export async function setUserAdmin(req: AuthRequest, res: Response) {
  try {
    const { userId } = req.params as { userId: string };
    const { isAdmin } = req.body as { isAdmin: boolean };
    const user = await prisma.user.update({ where: { id: userId }, data: { isAdmin } });
    return res.json({ message: "Admin flag updated.", user });
  } catch (e) {
    return res.status(500).json({ message: "Failed to update admin flag." });
  }
}

export async function setUserActive(req: AuthRequest, res: Response) {
  try {
    const { userId } = req.params as { userId: string };
    const { active } = req.body as { active: boolean };
    const user = await prisma.user.update({ where: { id: userId }, data: { isDeleted: !active } });
    return res.json({ message: active ? "User reactivated." : "User deactivated.", user });
  } catch (e) {
    return res.status(500).json({ message: "Failed to update user status." });
  }
}

export async function approveFreelancer(req: AuthRequest, res: Response) {
  try {
    const { applicationId } = req.params;
    const app = await prisma.freelancerApplication.update({
      where: { id: applicationId },
      data: { status: "APPROVED" as any },
    });
    await prisma.user.update({
      where: { id: app.userId },
      data: { role: "FREELANCER" as any },
    });
    // Send approval email
    const user = await prisma.user.findUnique({ where: { id: app.userId } });
    const dashboardUrl = `${process.env.CLIENT_URL ?? "http://localhost:5173"}/freelancer`;
    if (user?.email) {
      try {
        await sendEmail({
          to: user.email,
          subject: "Your freelancer account is verified",
          html: freelancerApplicationApprovedEmailHtml({ firstName: user.firstName ?? undefined, dashboardUrl }),
        });
      } catch (_) {
        // ignore email errors
      }
    }
    return res.json({ message: "Application approved." });
  } catch (e) {
    return res.status(500).json({ message: "Failed to approve application." });
  }
}

export async function rejectFreelancer(req: AuthRequest, res: Response) {
  try {
    const { applicationId } = req.params;
    await prisma.freelancerApplication.update({
      where: { id: applicationId },
      data: { status: "REJECTED" as any },
    });
    // Send rejection email
    const app = await prisma.freelancerApplication.findUnique({ where: { id: applicationId } });
    if (app) {
      const user = await prisma.user.findUnique({ where: { id: app.userId } });
      if (user?.email) {
        try {
          await sendEmail({
            to: user.email,
            subject: "Your freelancer application status",
            html: freelancerApplicationRejectedEmailHtml({ firstName: user.firstName ?? undefined }),
          });
        } catch (_) {
          // ignore email errors
        }
      }
    }
    return res.json({ message: "Application rejected." });
  } catch (e) {
    return res.status(500).json({ message: "Failed to reject application." });
  }
}
