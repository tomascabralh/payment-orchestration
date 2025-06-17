import { PaymentOrderController } from "../../../../../core/api/controllers/PaymentOrderController";
import { CreatePaymentOrderUseCase } from "../../../../../core/application/CreatePaymentOrderUseCase";
import { PaymentOrderRepositoryImpl } from "../../../../../core/infrastructure/repositories/PaymentOrderRepositoryImpl";
import { GetPaymentOrderUseCase } from "../../../../../core/application/GetPaymentOrderUseCase";
import { ProcessPaymentOrderUseCase } from "../../../../../core/application/ProcessPaymentOrderUseCase";
import { PaymentGatewayAdapter } from "../../../../../core/infrastructure/adapters/PaymentGatewayAdapter";
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

type JsonResponse = {
  status: (code: number) => JsonResponse;
  json: (body: unknown) => void;
};

type CreatePaymentOrderRequest = {
  amount: number;
  description: string;
  country_iso_code: string;
};
type PaymentOrderResponse = unknown;

export async function POST({ request }: { request: Request }) {
  let body: CreatePaymentOrderRequest;
  try {
    body = (await request.json()) as CreatePaymentOrderRequest;
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
  let responseBody: PaymentOrderResponse = null;

  const response: JsonResponse = {
    status: (code: number) => {
      statusCode = code;
      return response;
    },
    json: (data: PaymentOrderResponse) => {
      responseBody = data;
    },
  };

  await controller.create({ body }, response);
  return new Response(JSON.stringify(responseBody), {
    status: statusCode,
    headers: { "Content-Type": "application/json" },
  });
}
