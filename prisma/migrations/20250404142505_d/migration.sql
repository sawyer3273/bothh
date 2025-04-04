-- AlterTable
ALTER TABLE "Vacancy" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'active',
ADD COLUMN     "updatedAt" TIMESTAMP(3);
