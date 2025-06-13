import type { PaymentOrder } from "../../../../../../domain/payment_order/PaymentOrderEntity";
import { PaymentOrderService } from "../../../../../../application/paymentOrder/PaymentOrderService";
import { PrismaPaymentOrderRepository } from "../../../../../../adapters/PrismaPaymentOrderRepository";
import { PrismaPaymentProviderRepository } from "../../../../../../adapters/PrismaPaymentProviderRepository";
import { GetProvidersByCountryService } from "../../../../../../application/paymentProvider/GetProvidersByCountryService";
import { v4 as uuidv4 } from "uuid";

export const prerender = false;

const orderRepository = new PrismaPaymentOrderRepository();
const providerRepository = new PrismaPaymentProviderRepository();

const getProvidersService = new GetProvidersByCountryService(
  providerRepository
);
const service = new PaymentOrderService(orderRepository, getProvidersService);

export async function POST({ request }: { request: Request }) {
  try {
    const body = await request.json();
    const uuid = uuidv4();

    const order: PaymentOrder = {
      uuid,
      amount: body.amount,
      description: body.description,
      countryIsoCode: body.country_iso_code,
      createdAt: new Date(),
      paymentUrl: `http://localhost:4321/api/payment_order/${uuid}`,
      providers: [],
    };

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
          providers: created.providers,
        },
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to create payment order" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
