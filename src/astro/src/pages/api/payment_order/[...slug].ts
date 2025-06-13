import { PaymentOrderController } from "../../../../../core/controllers/PaymentOrderController";
import { PaymentOrderService } from "../../../../../core/services/PaymentOrderService";
import { PrismaPaymentOrderRepository } from "../../../../../core/infrastructure/PrismaPaymentOrderRepository";
import { PrismaPaymentProviderRepository } from "../../../../../core/infrastructure/PrismaPaymentProviderRepository";
import { GetProvidersByCountryService } from "../../../../../core/services/PaymentProviderService";

export const prerender = false;

const orderRepository = new PrismaPaymentOrderRepository();
const providerRepository = new PrismaPaymentProviderRepository();
const getProvidersService = new GetProvidersByCountryService(
  providerRepository
);
const service = new PaymentOrderService(orderRepository, getProvidersService);
const controller = new PaymentOrderController(service);

export async function GET({ request }: { request: Request }) {
  return controller.get(request);
}

export async function POST({ request }: { request: Request }) {
  return controller.process(request);
}
