import { PaymentProvider } from "../payment_provider/PaymentProviderEntity";

export interface PaymentOrder {
  uuid: string;
  amount: number;
  description: string;
  countryIsoCode: string;
  createdAt: Date;
  paymentUrl: string;
  providers: PaymentProvider[];
}
