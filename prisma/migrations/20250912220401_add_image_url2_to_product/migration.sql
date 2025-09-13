-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('FOLLOWUP', 'PEMBERKASAN', 'AKAD_KREDIT');

-- CreateEnum
CREATE TYPE "public"."PaidStatus" AS ENUM ('PAID', 'PENDING');

-- AlterTable
ALTER TABLE "public"."user" ADD COLUMN     "rekeningNo" TEXT;

-- CreateTable
CREATE TABLE "public"."Product" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "lokasi" TEXT,
    "description" TEXT NOT NULL,
    "dpAkad" INTEGER NOT NULL,
    "videoLink" TEXT,
    "fee" INTEGER NOT NULL,
    "imageUrl" TEXT,
    "imageUrl2" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Customer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "status" "public"."Status" NOT NULL DEFAULT 'FOLLOWUP',
    "paidStatus" "public"."PaidStatus" NOT NULL DEFAULT 'PENDING',
    "komisi" INTEGER NOT NULL DEFAULT 1000000,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Customer_whatsapp_key" ON "public"."Customer"("whatsapp");

-- AddForeignKey
ALTER TABLE "public"."Customer" ADD CONSTRAINT "Customer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
