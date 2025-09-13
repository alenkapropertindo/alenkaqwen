-- CreateEnum
CREATE TYPE "public"."Kategori" AS ENUM ('Strategis', 'Promo', 'Dp_Rendah');

-- AlterTable
ALTER TABLE "public"."Product" ADD COLUMN     "kategori" "public"."Kategori" NOT NULL DEFAULT 'Strategis';
