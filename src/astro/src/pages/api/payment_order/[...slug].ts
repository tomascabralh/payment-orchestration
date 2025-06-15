import { PaymentOrderController } from "../../../../../core/api/controllers/PaymentOrderController";
import { PaymentOrderRepositoryImpl } from "../../../../../core/infrastructure/PaymentOrderRepositoryImpl";
import { GetPaymentOrderUseCase } from "../../../../../core/application/GetPaymentOrderUseCase";
import { CreatePaymentOrderUseCase } from "../../../../../core/application/CreatePaymentOrderUseCase";

const repo = new PaymentOrderRepositoryImpl();
const getUseCase = new GetPaymentOrderUseCase(repo);
const createUseCase = new CreatePaymentOrderUseCase(repo);
const controller = new PaymentOrderController(getUseCase, createUseCase);

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
