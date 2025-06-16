import { GetPaymentOrderUseCase } from "../../application/GetPaymentOrderUseCase";
import { CreatePaymentOrderUseCase } from "../../application/CreatePaymentOrderUseCase";
import { ProcessPaymentOrderUseCase } from "../../application/ProcessPaymentOrderUseCase";

export class PaymentOrderController {
  constructor(
    private readonly getOrderUseCase: GetPaymentOrderUseCase,
    private readonly createOrderUseCase: CreatePaymentOrderUseCase,
    private readonly processOrderUseCase: ProcessPaymentOrderUseCase
  ) {}

  async get(
    req: { params: { uuid: string } },
    res: { status: (code: number) => any; json: (body: any) => any }
  ) {
    const { uuid } = req.params;
    const order = await this.getOrderUseCase.execute(uuid);
    if (!order) return res.status(404).json({ error: "Not found" });
    return res.json(order);
  }

  async create(req: { body: any }, res: any) {
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
    } catch (e: any) {
      return res.status(400).json({ error: e.message });
    }
  }

  async process(
    req: {
      params: { uuid: string };
      body: {
        provider_id: string;
        redirect_url?: string;
      };
    },
    res: any
  ) {
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
    } catch (e: any) {
      if (e.message === "Payment order not found") {
        return res.status(404).json({ error: e.message });
      }
      if (e.message === "No payment providers available for this order") {
        return res.status(400).json({ error: e.message });
      }
      if (e.message === "All payment providers failed") {
        return res.status(500).json({ error: e.message });
      }
      return res.status(400).json({ error: e.message });
    }
  }
}
