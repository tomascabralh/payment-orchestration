import { PaymentOrderController } from "../../../../../core/api/controllers/PaymentOrderController";
import { CreatePaymentOrderUseCase } from "../../../../../core/application/CreatePaymentOrderUseCase";
import { PaymentOrderRepositoryImpl } from "../../../../../core/infrastructure/PaymentOrderRepositoryImpl";
import { GetPaymentOrderUseCase } from "../../../../../core/application/GetPaymentOrderUseCase";
import { ProcessPaymentOrderUseCase } from "../../../../../core/application/ProcessPaymentOrderUseCase";
import { PaymentGatewayAdapter } from "../../../../../core/infrastructure/PaymentGatewayAdapter";
import { PaymentMethodRegistry } from "../../../../../core/application/services/PaymentMethodRegistry";
import { PrismaPaymentMethodRepository } from "../../../../../core/infrastructure/repositories/PrismaPaymentMethodRepository";
import { PrismaProviderMetricsRepository } from "../../../../../core/infrastructure/repositories/PrismaProviderMetricsRepository";

const repo = new PaymentOrderRepositoryImpl();
const createUseCase = new CreatePaymentOrderUseCase(repo);
const getUseCase = new GetPaymentOrderUseCase(repo);

const processUseCase = new ProcessPaymentOrderUseCase(
  repo,
  new PaymentGatewayAdapter(),
  new PaymentMethodRegistry(),
  new PrismaPaymentMethodRepository(),
  new PrismaProviderMetricsRepository()
);
const controller = new PaymentOrderController(
  getUseCase,
  createUseCase,
  processUseCase
);

export const prerender = false;

export async function POST({ request }: { request: Request }) {
  let body: any;
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid or missing JSON body" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
  let statusCode = 201;
  let responseBody: any = null;
  await controller.create(
    { body },
    {
      status: (code: number) => {
        statusCode = code;
        return {
          json: (data: any) => {
            responseBody = data;
          },
        };
      },
      json: (data: any) => {
        responseBody = data;
      },
    }
  );
  return new Response(JSON.stringify(responseBody), {
    status: statusCode,
    headers: { "Content-Type": "application/json" },
  });
}
