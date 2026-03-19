// services/vnpay.service.js
import crypto from 'crypto';
import querystring from 'qs';
import { vnpayConfig } from '../config/vnpay.config.js';

export class VNPayService {
  constructor() {
    this.config = vnpayConfig;
  }

  // Tạo URL thanh toán
  createPaymentUrl(paymentParams) {
    const {
      amount,
      orderId,
      orderInfo = 'Thanh toan don hang',
      bankCode = '',
      language = 'vn',
      ipAddr = '127.0.0.1'
    } = paymentParams;

    // Chuẩn bị params
    const date = new Date();
    const createDate = this.formatDate(date, 'yyyyMMddHHmmss');
    const expireDate = this.formatDate(new Date(date.getTime() + 15 * 60 * 1000), 'yyyyMMddHHmmss');

    let vnp_Params = {
      vnp_Version: this.config.version,
      vnp_Command: this.config.command,
      vnp_TmnCode: this.config.tmnCode,
      vnp_Locale: language,
      vnp_CurrCode: this.config.currency,
      vnp_TxnRef: orderId,
      vnp_OrderInfo: orderInfo,
      vnp_OrderType: 'other',
      vnp_Amount: amount * 100, // VNPAY yêu cầu amount nhân 100
      vnp_ReturnUrl: this.config.returnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate,
      vnp_ExpireDate: expireDate
    };

    // Thêm bankCode nếu có
    if (bankCode && bankCode !== '') {
      vnp_Params['vnp_BankCode'] = bankCode;
    }

    // Sắp xếp params theo thứ tự alphabet
    vnp_Params = this.sortObject(vnp_Params);

    // Tạo chuỗi hash
    const signData = querystring.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac('sha512', this.config.hashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    // Thêm signature vào params
    vnp_Params['vnp_SecureHash'] = signed;

    // Tạo URL
    const paymentUrl = this.config.paymentUrl + '?' + querystring.stringify(vnp_Params, { encode: false });

    return paymentUrl;
  }

  // Xác minh callback từ VNPAY
  verifyCallback(query) {
    const vnp_Params = { ...query };
    const secureHash = vnp_Params['vnp_SecureHash'];

    // Xóa các trường không cần thiết
    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    // Sắp xếp params
    const sortedParams = this.sortObject(vnp_Params);

    // Tạo chuỗi hash để verify
    const signData = querystring.stringify(sortedParams, { encode: false });
    const hmac = crypto.createHmac('sha512', this.config.hashSecret);
    const checkSum = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    // So sánh hash
    return secureHash === checkSum;
  }

  // Query thông tin giao dịch
  async queryTransaction(vnp_TransactionNo, vnp_TxnRef) {
    const date = new Date();
    const queryDate = this.formatDate(date, 'yyyyMMddHHmmss');

    let vnp_Params = {
      vnp_RequestId: this.generateRequestId(),
      vnp_Version: this.config.version,
      vnp_Command: 'querydr',
      vnp_TmnCode: this.config.tmnCode,
      vnp_TxnRef: vnp_TxnRef,
      vnp_OrderInfo: `Truy van giao dich ${vnp_TxnRef}`,
      vnp_TransactionDate: queryDate,
      vnp_CreateDate: queryDate,
      vnp_IpAddr: '127.0.0.1'
    };

    if (vnp_TransactionNo) {
      vnp_Params['vnp_TransactionNo'] = vnp_TransactionNo;
    }

    // Tạo signature
    vnp_Params = this.sortObject(vnp_Params);
    const signData = querystring.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac('sha512', this.config.hashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    vnp_Params['vnp_SecureHash'] = signed;

    try {
      const response = await fetch(this.config.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(vnp_Params)
      });

      return await response.json();
    } catch (error) {
      console.error('VNPAY query error:', error);
      throw error;
    }
  }

  // Refund transaction
  async refundTransaction(refundParams) {
    const {
      vnp_TransactionNo,
      vnp_TxnRef,
      amount,
      transactionType = '02', // 02: hoàn tiền toàn phần, 03: hoàn tiền một phần
      transactionDate,
      user,
      orderInfo = 'Hoan tien giao dich'
    } = refundParams;

    const date = new Date();
    const createDate = this.formatDate(date, 'yyyyMMddHHmmss');

    let vnp_Params = {
      vnp_RequestId: this.generateRequestId(),
      vnp_Version: this.config.version,
      vnp_Command: 'refund',
      vnp_TmnCode: this.config.tmnCode,
      vnp_TransactionType: transactionType,
      vnp_TxnRef: vnp_TxnRef,
      vnp_Amount: amount * 100,
      vnp_TransactionNo: vnp_TransactionNo,
      vnp_TransactionDate: transactionDate,
      vnp_CreateDate: createDate,
      vnp_CreateBy: user,
      vnp_IpAddr: '127.0.0.1',
      vnp_OrderInfo: orderInfo
    };

    // Tạo signature
    vnp_Params = this.sortObject(vnp_Params);
    const signData = querystring.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac('sha512', this.config.hashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    vnp_Params['vnp_SecureHash'] = signed;

    try {
      const response = await fetch(this.config.refundUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(vnp_Params)
      });

      return await response.json();
    } catch (error) {
      console.error('VNPAY refund error:', error);
      throw error;
    }
  }

  // Helper methods
  formatDate(date, format) {
    const pad = (n) => n < 10 ? '0' + n : n;
    
    return format
      .replace('yyyy', date.getFullYear())
      .replace('MM', pad(date.getMonth() + 1))
      .replace('dd', pad(date.getDate()))
      .replace('HH', pad(date.getHours()))
      .replace('mm', pad(date.getMinutes()))
      .replace('ss', pad(date.getSeconds()));
  }

  sortObject(obj) {
    const sorted = {};
    Object.keys(obj).sort().forEach(key => {
      sorted[key] = obj[key];
    });
    return sorted;
  }

  generateRequestId() {
    return `${Date.now()}${Math.floor(Math.random() * 1000)}`;
  }

  // Lấy danh sách ngân hàng hỗ trợ
  getSupportedBanks() {
    return [
      { code: 'VNPAYQR', name: 'VNPAY QR', description: 'Quét QR Code qua ứng dụng ngân hàng' },
      { code: 'VNBANK', name: 'LOCAL BANK', description: 'Thanh toán qua tài khoản ngân hàng Việt Nam' },
      { code: 'INTCARD', name: 'INTERNATIONAL CARD', description: 'Thanh toán qua thẻ quốc tế' },
      { code: 'VISA', name: 'VISA', description: 'Thanh toán qua thẻ VISA' },
      { code: 'MASTERCARD', name: 'MASTERCARD', description: 'Thanh toán qua thẻ Mastercard' },
      { code: 'JCB', name: 'JCB', description: 'Thanh toán qua thẻ JCB' },
      { code: 'UPI', name: 'UPI', description: 'Thanh toán qua UPI' },
      { code: 'NCB', name: 'Ngân hàng NCB', description: 'Ngân hàng Quốc dân' },
      { code: 'SACOMBANK', name: 'Sacombank', description: 'Ngân hàng TMCP Sài Gòn Thương Tín' },
      { code: 'EXIMBANK', name: 'Eximbank', description: 'Ngân hàng Xuất Nhập khẩu' },
      { code: 'MSBANK', name: 'MSBANK', description: 'Ngân hàng Hàng Hải' },
      { code: 'NAMABANK', name: 'NamABank', description: 'Ngân hàng Nam Á' },
      { code: 'VISA', name: 'VISA', description: 'Thanh toán qua thẻ VISA' },
      { code: 'MASTERCARD', name: 'MASTERCARD', description: 'Thanh toán qua thẻ Mastercard' }
    ];
  }
}

export default new VNPayService();