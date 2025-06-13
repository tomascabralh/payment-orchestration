import { PaymentOrderController } from "../../../../../../core/controllers/PaymentOrderController";
import { PaymentOrderService } from "../../../../../../core/services/PaymentOrderService";
import { PrismaPaymentOrderRepository } from "../../../../../../core/adapters/PrismaPaymentOrderRepository";
import { PrismaPaymentProviderRepository } from "../../../../../../core/adapters/PrismaPaymentProviderRepository";
import { GetProvidersByCountryService } from "../../../../../../core/services/PaymentProviderService";

export const prerender = false;

const orderRepository = new PrismaPaymentOrderRepository();
const providerRepository = new PrismaPaymentProviderRepository();
const getProvidersService = new GetProvidersByCountryService(
  providerRepository
);
const service = new PaymentOrderService(orderRepository, getProvidersService);
const controller = new PaymentOrderController(service);

export async function POST({ request }: { request: Request }) {
  return controller.create(request);
}
