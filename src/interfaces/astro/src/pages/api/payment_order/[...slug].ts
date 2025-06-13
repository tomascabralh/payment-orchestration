import { PaymentOrderService } from "../../../../../../application/paymentOrder/PaymentOrderService";
import { PrismaPaymentOrderRepository } from "../../../../../../adapters/PrismaPaymentOrderRepository";

export const prerender = false;

const repository = new PrismaPaymentOrderRepository();
const service = new PaymentOrderService(repository);

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
