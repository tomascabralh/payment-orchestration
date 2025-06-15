import { GetPaymentOrderUseCase } from "../../application/GetPaymentOrderUseCase";
import { CreatePaymentOrderUseCase } from "../../application/CreatePaymentOrderUseCase";

export class PaymentOrderController {
  constructor(
    private readonly getOrderUseCase: GetPaymentOrderUseCase,
    private readonly createOrderUseCase: CreatePaymentOrderUseCase
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
}
