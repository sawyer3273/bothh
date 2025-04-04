-- AlterTable
ALTER TABLE "Vacancy" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updateCount" INTEGER NOT NULL DEFAULT 1;
