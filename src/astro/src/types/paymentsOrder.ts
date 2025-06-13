export interface PaymentOrderFormProps {
  onSubmit: (data: PaymentOrderFormData) => void;
}

export interface PaymentOrderFormData {
  amount: number;
  description: string;
  country_iso_code: string;
}
