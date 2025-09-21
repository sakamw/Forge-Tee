-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('BUYER', 'FREELANCER');

-- AlterTable
ALTER TABLE "public"."user" ADD COLUMN     "role" "public"."Role" NOT NULL DEFAULT 'BUYER';
