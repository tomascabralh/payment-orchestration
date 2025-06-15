/*
  Warnings:

  - You are about to drop the column `paymentUrl` on the `PaymentOrder` table. All the data in the column will be lost.
  - You are about to drop the column `providers` on the `PaymentOrder` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PaymentOrder" DROP COLUMN "paymentUrl",
DROP COLUMN "providers";
