import { PaymentOrderService } from "../../../../../../application/paymentOrder/PaymentOrderService";
import { PrismaPaymentOrderRepository } from "../../../../../../adapters/PrismaPaymentOrderRepository";
import { PrismaPaymentProviderRepository } from "../../../../../../adapters/PrismaPaymentProviderRepository";
import { GetProvidersByCountryService } from "../../../../../../application/paymentProvider/GetProvidersByCountryService";
import { processWithProvider } from "../../../../../../application/paymentProcess/processWithProvider";

export const prerender = false;

const orderRepository = new PrismaPaymentOrderRepository();
const providerRepository = new PrismaPaymentProviderRepository();

const getProvidersService = new GetProvidersByCountryService(
  providerRepository
);
const service = new PaymentOrderService(orderRepository, getProvidersService);

export async function GET({ request }: { request: Request }) {
  const url = new URL(request.url);
  const parts = url.pathname.split("/");
  const uuid = parts[parts.length - 1];

  const order = await service.getPaymentOrder(uuid!);

  if (!order) {
    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(
    JSON.stringify({
      uuid: order.uuid,
      type: "payment_order",
      attributes: {
        amount: order.amount,
        description: order.description,
        country_iso_code: order.countryIsoCode,
        created_at: order.createdAt,
        payment_url: order.paymentUrl,
        providers: order.providers,
      },
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}

export async function POST({ request }: { request: Request }) {
  try {
    const url = new URL(request.url);
    const parts = url.pathname.split("/");
    const uuid = parts[parts.length - 1];
    const body = await request.json();
    const providerCode = body.providerCode;

    const order = await service.getPaymentOrder(uuid!);
    if (!order) {
      return new Response(JSON.stringify({ error: "Order not found" }), {
        status: 404,
      });
    }
    const provider = order.providers.find((p) => p.code === providerCode);
    if (!provider) {
      return new Response(
        JSON.stringify({ error: "Provider not valid for this order" }),
        { status: 400 }
      );
    }
    const result = await processWithProvider(providerCode);
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 400 });
  }
}
