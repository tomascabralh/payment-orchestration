import { GetPaymentOrderUseCase } from "../../application/GetPaymentOrderUseCase";
import { CreatePaymentOrderUseCase } from "../../application/CreatePaymentOrderUseCase";
import { ProcessPaymentOrderUseCase } from "../../application/ProcessPaymentOrderUseCase";

type JsonResponse = {
  status: (code: number) => JsonResponse;
  json: (body: unknown) => void;
};

type CreateOrderRequest = {
  body: { amount: number; description: string; country_iso_code: string };
};
type ProcessOrderRequest = {
  params: { uuid: string };
  body: { provider_id: string; redirect_url?: string };
};

export class PaymentOrderController {
  constructor(
    private readonly getOrderUseCase: GetPaymentOrderUseCase,
    private readonly createOrderUseCase: CreatePaymentOrderUseCase,
    private readonly processOrderUseCase: ProcessPaymentOrderUseCase
  ) {}

  async get(req: { params: { uuid: string } }, res: JsonResponse) {
    const { uuid } = req.params;
    const order = await this.getOrderUseCase.execute(uuid);
    if (!order) return res.status(404).json({ error: "Not found" });
    return res.json(order);
  }

  async create(req: CreateOrderRequest, res: JsonResponse) {
    try {
      const { amount, description, country_iso_code } = req.body;
      const order = await this.createOrderUseCase.execute({
        amount,
        description,
        countryIsoCode: country_iso_code,
      });
      return res.status(201).json({
        uuid: order.uuid,
        type: "payment_order",
        attributes: {
          amount: order.amount,
          description: order.description,
          country_iso_code: order.countryIsoCode,
          created_at: order.createdAt,
        },
      });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Unknown error";
      return res.status(400).json({ error: message });
    }
  }

  async process(req: ProcessOrderRequest, res: JsonResponse) {
    try {
      const { uuid } = req.params;
      const { provider_id, redirect_url } = req.body;

      const order = await this.processOrderUseCase.execute({
        uuid,
        providerId: provider_id,
      });

      return res.json({
        uuid: order.uuid,
        type: "payment_order",
        attributes: {
          amount: order.amount,
          description: order.description,
          country_iso_code: order.countryIsoCode,
          status: order.status,
          created_at: order.createdAt,
          transactions: order.transactions.map((t) => ({
            transaction_id: t.transactionId,
            provider: t.provider,
            status: t.status,
            amount: t.amount,
            created_at: t.createdAt,
            redirect_url: t.redirectUrl,
          })),
        },
      });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Unknown error";
      if (message === "Payment order not found") {
        return res.status(404).json({ error: message });
      }
      if (message === "No payment providers available for this order") {
        return res.status(400).json({ error: message });
      }
      if (message === "All payment providers failed") {
        return res.status(500).json({ error: message });
      }
      return res.status(400).json({ error: message });
    }
  }
}
