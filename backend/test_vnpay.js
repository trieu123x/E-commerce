import { VNPayService } from "./src/services/vnpay.service.js";

const vnpayService = new VNPayService();

vnpayService.config = {
  tmnCode: "TEST_TMN",
  hashSecret: "TEST_SECRET_TEST_SECRET_TEST_SECRET",
  returnUrl: "http://localhost:3000/return",
  paymentUrl: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
  version: "2.1.0",
  command: "pay",
  currency: "VND"
};

const url = vnpayService.createPaymentUrl({
  amount: 10000,
  orderId: "12345",
  orderInfo: "Thanh toan QR",
  bankCode: "VNPAYQR",
  ipAddr: "127.0.0.1"
});

console.log(url);
