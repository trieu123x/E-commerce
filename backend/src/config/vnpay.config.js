export const vnpayConfig = {
  tmnCode: process.env.VNPAY_TMN_CODE || 'DEMO000',
  hashSecret: process.env.VNPAY_HASH_SECRET || 'O0SMCXWK7A0MKBEQQH4N9KFOJQHOILTC',
  returnUrl: process.env.VNPAY_RETURN_URL || 'http://localhost:3000/payment/callback',
  paymentUrl: process.env.VNPAY_PAYMENT_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
  apiUrl: process.env.VNPAY_API_URL || 'https://sandbox.vnpayment.vn/merchant_webapi/api/transaction',
  refundUrl: process.env.VNPAY_API_REFUND || 'https://sandbox.vnpayment.vn/merchant_webapi/api/transaction',
  currency: 'VND',
  locale: 'vn',
  version: '2.1.0',
  command: 'pay'
};