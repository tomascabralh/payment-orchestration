import { PaymentOrderController } from "../../controllers/PaymentOrderController";

describe("PaymentOrderController", () => {
  const mockService = {
    getPaymentOrder: jest.fn(),
    createPaymentOrder: jest.fn(),
    processPaymentOrder: jest.fn(),
  };
  const controller = new PaymentOrderController(mockService as any);

  it("returns 404 if order not found (GET)", async () => {
    mockService.getPaymentOrder.mockResolvedValue(null);
    const req = { url: "http://localhost/api/payment_order/uuid" } as any;
    const res = await controller.get(req);
    expect(res.status).toBe(404);
  });

  it("calls service.createPaymentOrder with correct args (POST)", async () => {
    const req = {
      json: async () => ({
        amount: 10,
        description: "desc",
        country_iso_code: "AR",
      }),
    } as any;
    mockService.createPaymentOrder.mockResolvedValue({
      uuid: "id",
      amount: 10,
      description: "desc",
      countryIsoCode: "AR",
      createdAt: new Date(),
      paymentUrl: "",
      providers: [],
    });
    const res = await controller.create(req);
    expect(mockService.createPaymentOrder).toHaveBeenCalled();
    expect(res.status).toBe(201);
  });

  it("returns 400 if service throws (POST)", async () => {
    const req = { json: async () => ({}) } as any;
    mockService.createPaymentOrder.mockRejectedValue(new Error("fail"));
    const res = await controller.create(req);
    expect(res.status).toBe(400);
  });
});
