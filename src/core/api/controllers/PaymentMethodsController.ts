import { ListCountryPaymentMethodsUseCase } from "../../application/ListCountryPaymentMethodsUseCase";

export class PaymentMethodsController {
  constructor(
    private readonly listMethodsUseCase: ListCountryPaymentMethodsUseCase
  ) {}

  async list(req: { query: { country_code: string } }, res: any) {
    const { country_code } = req.query;
    const methods = await this.listMethodsUseCase.execute(country_code);
    return res.json(methods);
  }
}
