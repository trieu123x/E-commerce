export const vnpayConfig = {
  tmnCode: process.env.VNPAY_TMN_CODE,
  hashSecret: process.env.VNPAY_HASH_SECRET,
  returnUrl: process.env.VNPAY_RETURN_URL,
  paymentUrl: process.env.VNPAY_PAYMENT_URL,
  apiUrl: process.env.VNPAY_API_URL,
  refundUrl: process.env.VNPAY_API_REFUND,
  currency: 'VND',
  locale: 'vn',
  version: '2.1.0',
  command: 'pay'
};