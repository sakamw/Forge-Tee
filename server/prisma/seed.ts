import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const sampleDesigns: Array<{
  slug: string;
  title: string;
  description: string;
  price: Prisma.Decimal | string;
  imageUrl: string;
  category: string;
  tags: string[];
  rating: number;
  reviewCount: number;
  favoriteCount: number;
}> = [
  {
    slug: "sunset-horizon",
    title: "Sunset Horizon",
    description:
      "A vibrant gradient design inspired by beach sunsets and soft ocean breezes.",
    price: new Prisma.Decimal(27.99),
    imageUrl:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80",
    category: "Nature",
    tags: ["nature", "sunset", "gradient"],
    rating: 4.8,
    reviewCount: 142,
    favoriteCount: 320,
  },
  {
    slug: "retro-wave",
    title: "Retro Wave",
    description:
      "Bold neon lines and a classic synthwave palette for lovers of the 80s aesthetic.",
    price: new Prisma.Decimal(24.99),
    imageUrl:
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80",
    category: "Pop Culture",
    tags: ["retro", "synthwave", "neon"],
    rating: 4.6,
    reviewCount: 98,
    favoriteCount: 214,
  },
  {
    slug: "minimal-monstera",
    title: "Minimal Monstera",
    description:
      "A clean, minimalist outline of monstera leaves on a neutral background.",
    price: new Prisma.Decimal(22.5),
    imageUrl:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80",
    category: "Minimalist",
    tags: ["minimalist", "botanical", "lineart"],
    rating: 4.9,
    reviewCount: 205,
    favoriteCount: 512,
  },
  {
    slug: "galactic-dreams",
    title: "Galactic Dreams",
    description:
      "An illustrated journey through space featuring planets, comets, and starfields.",
    price: new Prisma.Decimal(29.99),
    imageUrl:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
    category: "Illustration",
    tags: ["space", "illustration", "galaxy"],
    rating: 4.7,
    reviewCount: 167,
    favoriteCount: 389,
  },
  {
    slug: "bold-typography",
    title: "Bold Statement",
    description:
      "High-impact typography design to make your message stand out loud and clear.",
    price: new Prisma.Decimal(21.5),
    imageUrl:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80",
    category: "Typography",
    tags: ["typography", "bold", "statement"],
    rating: 4.5,
    reviewCount: 86,
    favoriteCount: 190,
  },
  {
    slug: "urban-photography",
    title: "Urban Reflections",
    description:
      "Street photography capturing neon reflections in the heart of the city.",
    price: new Prisma.Decimal(26.0),
    imageUrl:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80",
    category: "Photography",
    tags: ["photography", "urban", "nightlife"],
    rating: 4.4,
    reviewCount: 64,
    favoriteCount: 132,
  },
  {
    slug: "abstract-flow",
    title: "Abstract Flow",
    description:
      "Dynamic curved shapes and pastel gradients that create a calming visual flow.",
    price: new Prisma.Decimal(23.75),
    imageUrl:
      "https://images.unsplash.com/photo-1526481280695-3c46917e2e8f?auto=format&fit=crop&w=900&q=80",
    category: "Abstract",
    tags: ["abstract", "pastel", "fluid"],
    rating: 4.3,
    reviewCount: 72,
    favoriteCount: 118,
  },
  {
    slug: "wanderlust-map",
    title: "Wanderlust Map",
    description:
      "Hand-drawn world map with travel icons for the adventure seekers.",
    price: new Prisma.Decimal(28.5),
    imageUrl:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80",
    category: "Illustration",
    tags: ["travel", "illustration", "map"],
    rating: 4.9,
    reviewCount: 231,
    favoriteCount: 540,
  },
];

async function main() {
  await prisma.$transaction(
    sampleDesigns.map((design) =>
      prisma.design.upsert({
        where: { slug: design.slug },
        update: {
          title: design.title,
          description: design.description,
          price: design.price,
          imageUrl: design.imageUrl,
          category: design.category,
          tags: design.tags.map((tag) => tag.toLowerCase()),
          rating: design.rating,
          reviewCount: design.reviewCount,
          favoriteCount: design.favoriteCount,
          isPublished: true,
        },
        create: {
          title: design.title,
          slug: design.slug,
          description: design.description,
          price: design.price,
          imageUrl: design.imageUrl,
          category: design.category,
          tags: design.tags.map((tag) => tag.toLowerCase()),
          rating: design.rating,
          reviewCount: design.reviewCount,
          favoriteCount: design.favoriteCount,
          isPublished: true,
        },
      })
    )
  );
}

main()
  .catch((error) => {
    console.error("Failed to seed database", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

