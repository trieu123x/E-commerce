import "dotenv/config";
import vnpayService from "./src/services/vnpay.service.js";
import https from "https";
import crypto from "crypto";

const config = {
  tmnCode: "LBLG4WFW",
  hashSecret: "10OHPVF2JL464XLT0RWOCAVIMJ3UYGQO",
  returnUrl: "http://localhost:3000/payment/callback",
  paymentUrl: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
  version: "2.1.0",
  command: "pay",
  currency: "VND"
};

const pad = n => (n<10?'0'+n:n); 
function fDate(d, spoofYear){
  return (spoofYear || d.getFullYear())+''+pad(d.getMonth()+1)+''+pad(d.getDate())+''+pad(d.getHours())+''+pad(d.getMinutes())+''+pad(d.getSeconds());
}
function sortObj(obj) { 
  let sorted={}; 
  let keys=Object.keys(obj).map(encodeURIComponent).sort(); 
  for(let k of keys) sorted[k]=encodeURIComponent(obj[k]).replace(/%20/g, '+'); 
  return sorted; 
} 

async function test(year) {
  let d = new Date();
  let p = {
    vnp_Version: config.version,
    vnp_Command: config.command,
    vnp_TmnCode: config.tmnCode,
    vnp_Locale: 'vn',
    vnp_CurrCode: config.currency,
    vnp_TxnRef: 'A' + Date.now(),
    vnp_OrderInfo: 'ThanhToanQR',
    vnp_OrderType: 'other',
    vnp_Amount: 1000000,
    vnp_ReturnUrl: config.returnUrl,
    vnp_IpAddr: '127.0.0.1',
    vnp_CreateDate: fDate(d, year),
    vnp_ExpireDate: fDate(new Date(d.getTime()+15*60000), year),
    vnp_BankCode: 'VNPAYQR'
  };
  p = sortObj(p);
  let signData = Object.keys(p).map(k=>k+'='+p[k]).join('&');
  let signed = crypto.createHmac('sha512', config.hashSecret).update(Buffer.from(signData, 'utf-8')).digest('hex');
  p['vnp_SecureHash'] = signed;
  let url = config.paymentUrl + '?' + Object.keys(p).map(k=>k+'='+p[k]).join('&');
  let res = await fetch(url, {redirect:'manual'});
  console.log('YEAR:', year, 'STATUS:', res.status, res.headers.get('location'));
}

async function run() {
  await test(2024);
  await test(2023);
  await test(2025);
  await test(2026);
}
run();
