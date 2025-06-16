import { PrismaClient } from "@prisma/client";
import { PaymentMethodVO } from "../src/core/domain/PaymentMethodVO";
import { PrismaPaymentMethodRepository } from "../src/core/infrastructure/repositories/PrismaPaymentMethodRepository";

const prisma = new PrismaClient();
const paymentMethodRepository = new PrismaPaymentMethodRepository(prisma);

async function main() {
  const paymentMethods = [
    new PaymentMethodVO("ghibli_pay", "GhibliPay", ["US", "AR"]),
    new PaymentMethodVO("nerve_transfer", "NerveTransfer", ["US"]),
    new PaymentMethodVO("akira_credits", "Akira Credits", ["AR"]),
    new PaymentMethodVO("fail_bank", "Fail Bank", ["US", "AR"]),
  ];

  await paymentMethodRepository.seedPaymentMethods(paymentMethods);
  console.log("Payment methods seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
