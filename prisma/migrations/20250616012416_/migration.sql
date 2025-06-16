/*
  Warnings:

  - You are about to drop the `PaymentProvider` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "PaymentProvider";

-- CreateIndex
CREATE INDEX "PaymentMethod_code_idx" ON "PaymentMethod"("code");

-- CreateIndex
CREATE INDEX "ProviderMetric_providerCode_idx" ON "ProviderMetric"("providerCode");
