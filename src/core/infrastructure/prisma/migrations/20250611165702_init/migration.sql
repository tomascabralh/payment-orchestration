-- CreateTable
CREATE TABLE "PaymentOrder" (
    "uuid" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "countryIsoCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paymentUrl" TEXT NOT NULL,

    CONSTRAINT "PaymentOrder_pkey" PRIMARY KEY ("uuid")
);
