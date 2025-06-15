import { PaymentOrderController } from "../../../../../core/api/controllers/PaymentOrderController";
import { CreatePaymentOrderUseCase } from "../../../../../core/application/CreatePaymentOrderUseCase";
import { PaymentOrderRepositoryImpl } from "../../../../../core/infrastructure/PaymentOrderRepositoryImpl";
import { GetPaymentOrderUseCase } from "../../../../../core/application/GetPaymentOrderUseCase";

const repo = new PaymentOrderRepositoryImpl();
const createUseCase = new CreatePaymentOrderUseCase(repo);
const getUseCase = new GetPaymentOrderUseCase(repo);
const controller = new PaymentOrderController(getUseCase, createUseCase);

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
