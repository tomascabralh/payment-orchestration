import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const providers = [
  {
    name: "MercadoPago",
    code: "mp",
    supportedCountries: ["AR"],
  },
  {
    name: "WebPay",
    code: "wp",
    supportedCountries: ["CL"],
  },
  {
    name: "Khipu",
    code: "kh",
    supportedCountries: ["CL"],
  },
  {
    name: "Stripe",
    code: "stripe",
    supportedCountries: ["US"],
  },
  {
    name: "GlitchPay",
    code: "glitchpay_ar",
    supportedCountries: ["AR"],
  },
  {
    name: "GlitchPay",
    code: "glitchpay_cl",
    supportedCountries: ["CL"],
  },
  {
    name: "GlitchPay",
    code: "glitchpay_us",
    supportedCountries: ["US"],
  },
];

async function main() {
  console.log("Start seeding...");

  for (const provider of providers) {
    const result = await prisma.paymentProvider.upsert({
      where: { code: provider.code },
      update: {
        name: provider.name,
        supportedCountries: provider.supportedCountries,
      },
      create: {
        name: provider.name,
        code: provider.code,
        supportedCountries: provider.supportedCountries,
      },
    });
    console.log(`Created provider with code: ${result.code}`);
  }

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
