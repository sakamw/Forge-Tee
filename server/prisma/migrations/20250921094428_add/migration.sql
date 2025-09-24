-- CreateEnum
CREATE TYPE "public"."ApplicationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "public"."freelancer_application" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "public"."ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "freelancer_application_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "freelancer_application_userId_key" ON "public"."freelancer_application"("userId");

-- AddForeignKey
ALTER TABLE "public"."freelancer_application" ADD CONSTRAINT "freelancer_application_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
