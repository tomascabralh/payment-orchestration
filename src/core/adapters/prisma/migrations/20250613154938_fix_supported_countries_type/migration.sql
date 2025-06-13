/*
  Warnings:

  - The `supportedCountries` column on the `PaymentProvider` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "PaymentProvider" DROP COLUMN "supportedCountries",
ADD COLUMN     "supportedCountries" TEXT[];
