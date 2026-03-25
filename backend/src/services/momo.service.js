import crypto from "crypto";
import https from "https";

const config = {
  accessKey: "F8BBA842ECF85",
  secretKey: "K951B6PE1waDMi640xX08PD3vg6EkVlz",
  partnerCode: "MOMO",
  redirectUrl: "http://localhost:3000/completed",
  ipnUrl: "https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b", //  đổi sang ngrok
};

export const createPayment = (order, dynamicRedirectUrl) => {
  return new Promise((resolve, reject) => {
    try {
      const amount = Math.round(Number(order.total_amount)).toString();
      const finalRedirectUrl = dynamicRedirectUrl || config.redirectUrl;

      const orderId = config.partnerCode + "_" + order.id + "_" + new Date().getTime();
      const requestId = orderId;
      const orderInfo = `Thanh toán đơn hàng #${order.id}`;
      const requestType = "captureWallet";
      const extraData = "";

      // 🔥 RAW SIGNATURE (QUAN TRỌNG)
      const rawSignature =
        `accessKey=${config.accessKey}` +
        `&amount=${amount}` +
        `&extraData=${extraData}` +
        `&ipnUrl=${config.ipnUrl}` +
        `&orderId=${orderId}` +
        `&orderInfo=${orderInfo}` +
        `&partnerCode=${config.partnerCode}` +
        `&redirectUrl=${finalRedirectUrl}` +
        `&requestId=${requestId}` +
        `&requestType=${requestType}`;

      const signature = crypto
        .createHmac("sha256", config.secretKey)
        .update(rawSignature)
        .digest("hex");

      // 🔥 BODY gửi đi
      const requestBody = JSON.stringify({
        partnerCode: config.partnerCode,
        partnerName: "Test",
        storeId: "MomoTestStore",
        requestId,
        amount,
        orderId,
        orderInfo,
        redirectUrl: finalRedirectUrl,
        ipnUrl: config.ipnUrl,
        lang: "vi",
        requestType,
        autoCapture: true,
        extraData,
        signature,
      });

      const options = {
        hostname: "test-payment.momo.vn",
        port: 443,
        path: "/v2/gateway/api/create",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(requestBody),
        },
      };

      const req = https.request(options, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          const result = JSON.parse(data);

          if (result.resultCode !== 0) {
            return reject(result);
          }

          resolve(result);
        });
      });

      req.on("error", (e) => {
        reject(e);
      });

      req.write(requestBody);
      req.end();

    } catch (err) {
      reject(err);
    }
  });
};