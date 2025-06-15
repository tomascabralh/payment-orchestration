import { PaymentOrderController } from "../../../../../core/api/controllers/PaymentOrderController";
import { PaymentOrderRepositoryImpl } from "../../../../../core/infrastructure/PaymentOrderRepositoryImpl";
import { GetPaymentOrderUseCase } from "../../../../../core/application/GetPaymentOrderUseCase";
import { CreatePaymentOrderUseCase } from "../../../../../core/application/CreatePaymentOrderUseCase";
import { ProcessPaymentOrderUseCase } from "../../../../../core/application/ProcessPaymentOrderUseCase";
import { PaymentGatewayAdapter } from "../../../../../core/infrastructure/PaymentGatewayAdapter";

const repo = new PaymentOrderRepositoryImpl();
const getUseCase = new GetPaymentOrderUseCase(repo);
const createUseCase = new CreatePaymentOrderUseCase(repo);
const processUseCase = new ProcessPaymentOrderUseCase(
  repo,
  new PaymentGatewayAdapter()
);
const controller = new PaymentOrderController(
  getUseCase,
  createUseCase,
  processUseCase
);

export const prerender = false;

export async function GET({ params }: { params: { slug: string } }) {
  const uuid = params.slug;
  let statusCode = 200;
  let responseBody: any = null;
  await controller.get(
    { params: { uuid } },
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

export async function POST({
  params,
  request,
}: {
  params: { slug: string };
  request: Request;
}) {
  const uuid = params.slug;
  let statusCode = 200;
  let responseBody: any = null;

  const body = await request.json();
  const provider_id = body.providerCode;

  await controller.process(
    { params: { uuid }, body: { provider_id } },
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
