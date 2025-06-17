import { PaymentOrderController } from "../../../../../core/api/controllers/PaymentOrderController";
import { PaymentOrderRepositoryImpl } from "../../../../../core/infrastructure/repositories/PaymentOrderRepositoryImpl";
import { GetPaymentOrderUseCase } from "../../../../../core/application/GetPaymentOrderUseCase";
import { CreatePaymentOrderUseCase } from "../../../../../core/application/CreatePaymentOrderUseCase";
import { ProcessPaymentOrderUseCase } from "../../../../../core/application/ProcessPaymentOrderUseCase";
import { PaymentGatewayAdapter } from "../../../../../core/infrastructure/adapters/PaymentGatewayAdapter";
import { PaymentMethodRegistry } from "../../../../../core/application/services/PaymentMethodRegistry";
import { PrismaPaymentMethodRepository } from "../../../../../core/infrastructure/repositories/PrismaPaymentMethodRepository";
import { PrismaProviderMetricsRepository } from "../../../../../core/infrastructure/repositories/PrismaProviderMetricsRepository";

const repo = new PaymentOrderRepositoryImpl();
const getUseCase = new GetPaymentOrderUseCase(repo);
const createUseCase = new CreatePaymentOrderUseCase(repo);
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

export async function GET({ params }: { params: { slug: string } }) {
  const uuid = params.slug;
  let statusCode = 200;
  let responseBody: unknown = null;

  const response: JsonResponse = {
    status: (code: number) => {
      statusCode = code;
      return response;
    },
    json: (data: unknown) => {
      responseBody = data;
    },
  };

  await controller.get({ params: { uuid } }, response);

  return new Response(JSON.stringify(responseBody), {
    status: statusCode,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST({
  params,
  request,
}: {
  params: { slug: string };
  request: Request;
}) {
  const uuid = params.slug;
  let statusCode = 200;
  let responseBody: unknown = null;

  const body = await request.json();
  const provider_id = body.providerCode;
  const redirect_url = body.redirectUrl;

  const response: JsonResponse = {
    status: (code: number) => {
      statusCode = code;
      return response;
    },
    json: (data: unknown) => {
      responseBody = data;
    },
  };

  await controller.process(
    {
      params: { uuid },
      body: { provider_id, redirect_url },
    },
    response
  );

  return new Response(JSON.stringify(responseBody), {
    status: statusCode,
    headers: { "Content-Type": "application/json" },
  });
}
