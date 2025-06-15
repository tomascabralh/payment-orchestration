import { PaymentMethodsController } from "../../../../../core/api/controllers/PaymentMethodsController";
import { ListCountryPaymentMethodsUseCase } from "../../../../../core/application/ListCountryPaymentMethodsUseCase";
import { PaymentMethodsCountryAdapterImpl } from "../../../../../core/infrastructure/PaymentMethodsCountryAdapter";

const adapter = new PaymentMethodsCountryAdapterImpl();
const useCase = new ListCountryPaymentMethodsUseCase(adapter);
const controller = new PaymentMethodsController(useCase);

export const prerender = false;

export async function GET({ request }: { request: Request }) {
  const url = new URL(request.url);
  const country_code = url.searchParams.get("country_code") || "";
  let statusCode = 200;
  let body: any = null;
  await controller.list(
    { query: { country_code } },
    {
      json: (data: any) => {
        body = data;
      },
      status: (code: number) => {
        statusCode = code;
        return {
          json: (data: any) => {
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
