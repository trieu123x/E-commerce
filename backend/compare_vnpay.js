import { VNPayService } from "./src/services/vnpay.service.js";
import { VNPay } from "vnpay";

// Same config
const config = {
  tmnCode: "TEST_TMN",
  hashSecret: "TEST_SECRET_TEST_SECRET_TEST_SECRET",
  returnUrl: "http://localhost:3000/return",
  paymentUrl: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
  version: "2.1.0",
  command: "pay",
  currency: "VND"
};

const vnpayService = new VNPayService();
vnpayService.config = config;

// Create custom url
const customUrl = vnpayService.createPaymentUrl({
  amount: 10000,
  orderId: "12345",
  orderInfo: "Thanh toan QR",
  bankCode: "VNPAYQR",
  ipAddr: "127.0.0.1"
});

// Create using official vnpay package
const vnpayInstance = new VNPay({
    tmnCode: config.tmnCode,
    secureSecret: config.hashSecret,
    vnpayHost: "https://sandbox.vnpayment.vn",
});

const officialUrl = vnpayInstance.buildPaymentUrl({
    vnp_Amount: 10000,
    vnp_IpAddr: '127.0.0.1',
    vnp_TxnRef: '12345',
    vnp_OrderInfo: 'Thanh toan QR',
    vnp_OrderType: 'other',
    vnp_ReturnUrl: config.returnUrl,
    vnp_Locale: 'vn',
    vnp_CreateDate: vnpayService.formatDate(new Date(), "yyyyMMddHHmmss"),
    vnp_ExpireDate: vnpayService.formatDate(new Date(Date.now() + 15 * 60 * 1000), "yyyyMMddHHmmss"),
    vnp_BankCode: 'VNPAYQR'
});


console.log("CUSTOM URL:\n" + customUrl);
console.log("\nOFFICIAL URL:\n" + officialUrl);
