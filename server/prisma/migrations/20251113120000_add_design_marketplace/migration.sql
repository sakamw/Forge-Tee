-- CreateTable
CREATE TABLE "public"."design" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "imageUrl" TEXT,
    "category" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "favoriteCount" INTEGER NOT NULL DEFAULT 0,
    "designerId" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT TRUE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "design_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "design_slug_key" ON "public"."design"("slug");

-- CreateIndex
CREATE INDEX "design_category_idx" ON "public"."design"("category");

-- CreateIndex
CREATE INDEX "design_published_created_idx" ON "public"."design"("isPublished", "createdAt");

-- AddForeignKey
ALTER TABLE "public"."design"
ADD CONSTRAINT "design_designerId_fkey" FOREIGN KEY ("designerId") REFERENCES "public"."user"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

