import { PaymentOrderService } from "../services/PaymentOrderService";
import { v4 as uuidv4 } from "uuid";

export class PaymentOrderController {
  constructor(private service: PaymentOrderService) {}

  async get(request: Request) {
    const url = new URL(request.url);
    const parts = url.pathname.split("/");
    const uuid = parts[parts.length - 1];
    const order = await this.service.getPaymentOrder(uuid!);
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
      { headers: { "Content-Type": "application/json" } }
    );
  }

  async create(request: Request) {
    try {
      const body = await request.json();
      const uuid = uuidv4();
      const order = {
        uuid,
        amount: body.amount,
        description: body.description,
        countryIsoCode: body.country_iso_code,
        createdAt: new Date(),
        paymentUrl: `http://localhost:4321/api/payment_order/${uuid}`,
        providers: [],
      };
      const created = await this.service.createPaymentOrder(order);
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
            providers: created.providers,
          },
        }),
        {
          status: 201,
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (error: any) {
      return new Response(
        JSON.stringify({
          error: error.message || "Failed to create payment order",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  }

  async process(request: Request) {
    try {
      const url = new URL(request.url);
      const parts = url.pathname.split("/");
      const uuid = parts[parts.length - 1];
      const body = await request.json();
      const providerCode = body.providerCode;
      const result = await this.service.processPaymentOrder(providerCode);
      return new Response(JSON.stringify(result), { status: 200 });
    } catch (e: any) {
      return new Response(JSON.stringify({ error: e.message }), {
        status: 400,
      });
    }
  }
}
