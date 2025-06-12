import { PaymentOrder } from "../../../../../../domain/paymentOrder/PaymentOrder";
import { PaymentOrderService } from "../../../../../../application/paymentOrder/PaymentOrderService";
import { PrismaPaymentOrderRepository } from "../../../../../../adapters/PrismaPaymentOrderRepository";

export const prerender = false;

const repository = new PrismaPaymentOrderRepository();
const service = new PaymentOrderService(repository);

export async function GET({ request }) {
  const url = new URL(request.url);
  const parts = url.pathname.split("/");
  const uuid = parts[parts.length - 1];

  const order = await service.getPaymentOrder(uuid!);

  if (!order) {
    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
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
      },
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}

export async function POST({ request }) {
  const url = new URL(request.url);
  const parts = url.pathname.split("/");
  const uuid = parts[parts.length - 1];
  const body = await request.json();

  const order = new PaymentOrder(
    uuid!,
    body.amount,
    body.description,
    body.country_iso_code,
    new Date(),
    `http://localhost:4321/api/payment_order/${uuid}`
  );

  const created = await service.createPaymentOrder(order);

  return new Response(
    JSON.stringify({
      uuid: created.uuid,
      type: "payment_order",
      attributes: {
        amount: created.amount,
        description: created.description,
        country_iso_code: created.countryIsoCode,
        created_at: created.createdAt,
        payment_url: created.paymentUrl,
      },
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}
