-- CreateTable
CREATE TABLE "PaymentProvider" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "supportedCountries" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentProvider_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PaymentProvider_code_key" ON "PaymentProvider"("code");

-- CreateIndex
CREATE INDEX "PaymentProvider_code_idx" ON "PaymentProvider"("code");
