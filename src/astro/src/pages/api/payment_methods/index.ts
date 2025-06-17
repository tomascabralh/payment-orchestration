import { PaymentMethodsController } from "../../../../../core/api/controllers/PaymentMethodsController";
import { ListCountryPaymentMethodsUseCase } from "../../../../../core/application/ListCountryPaymentMethodsUseCase";
import { PaymentMethodsCountryAdapterImpl } from "../../../../../core/infrastructure/adapters/PaymentMethodsCountryAdapter";
import { PrismaPaymentMethodRepository } from "../../../../../core/infrastructure/repositories/PrismaPaymentMethodRepository";

const repo = new PrismaPaymentMethodRepository();
const adapter = new PaymentMethodsCountryAdapterImpl(repo);
const useCase = new ListCountryPaymentMethodsUseCase(adapter);
const controller = new PaymentMethodsController(useCase);

export const prerender = false;

type PaymentMethodsResponse = unknown;

export async function GET({ request }: { request: Request }) {
  const url = new URL(request.url);
  const country_code = url.searchParams.get("country_code") || "";
  let statusCode = 200;
  let body: PaymentMethodsResponse = null;
  await controller.list(
    { query: { country_code } },
    {
      json: (data: PaymentMethodsResponse) => {
        body = data;
      },
      status: (code: number) => {
        statusCode = code;
        return {
          json: (data: PaymentMethodsResponse) => {
            body = data;
          },
        };
      },
    }
  );
  return new Response(JSON.stringify(body), {
    status: statusCode,
    headers: { "Content-Type": "application/json" },
  });
}
