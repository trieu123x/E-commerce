import "dotenv/config";
import vnpayService from "./src/services/vnpay.service.js";

console.log("Config keys:");
for (const [k, v] of Object.entries(vnpayService.config)) {
  console.log(`[${k}]: typeof ${typeof v}, length ${v?.length}, value "${v}"`);
}

const url = vnpayService.createPaymentUrl({
  amount: 10000,
  orderId: "12345",
  orderInfo: 'Thanh toan QR',
  bankCode: 'VNPAYQR',
  ipAddr: '127.0.0.1'
});

console.log("\nGenerated URL:");
console.log(url);
