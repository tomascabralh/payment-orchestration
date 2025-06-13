import { PaymentProvider } from "./PaymentProviderEntity";

export interface PaymentOrder {
  uuid: string;
  amount: number;
  description: string;
  countryIsoCode: string;
  createdAt: Date;
  paymentUrl: string;
  providers: PaymentProvider[];
}
