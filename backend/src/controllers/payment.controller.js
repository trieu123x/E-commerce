import { createPayment } from "../services/momo.service.js";
import vnpayService from "../services/vnpay.service.js";
import db from "../../models/index.js";

export const createMomoPayment = async (req, res) => {
  try {
    const { orderId, redirectUrl } = req.body;

    const order = await db.Order.findByPk(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const momoRes = await createPayment(order, redirectUrl);

    return res.json({
      payUrl: momoRes.payUrl,
    });
  } catch (err) {
    console.error("MoMo error:", err);
    return res.status(500).json(err);
  }
};
export const momoReturn = async (req, res) => {
  const { resultCode, orderId } = req.query;

  if (resultCode == 0) {
    return res.redirect(`http://localhost:3000/completed?orderId=${orderId}`);
  } else {
    return res.redirect(`http://localhost:3000/fail`);
  }
};

export const momoIPN = async (req, res) => {
  try {
    const { orderId, resultCode } = req.body;

    if (resultCode == 0) {
      let actualOrderId = orderId;
      if (typeof orderId === 'string' && orderId.includes('_')) {
        actualOrderId = orderId.split('_')[1];
      }

      await db.Order.update(
        { status: "paid" },
        { where: { id: actualOrderId } }
      );
    }

    return res.status(200).json({ message: "ok" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "error" });
  }
};

export const createVnpayPayment = async (req, res) => {
  try {
    const { orderId, bankCode } = req.body;
    const order = await db.Order.findByPk(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const ipAddr =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;

    const paymentUrl = vnpayService.createPaymentUrl({
      amount: order.total_amount,
      orderId: orderId,
      ipAddr,
      bankCode,
    });

    return res.json({ payUrl: paymentUrl });
  } catch (err) {
    console.error("VNPay error:", err);
    return res.status(500).json(err);
  }
};

export const vnpayReturn = async (req, res) => {
  const vnp_Params = req.query;
  const isValid = vnpayService.verifyCallback(vnp_Params);

  if (isValid && vnp_Params["vnp_ResponseCode"] === "00") {
    return res.redirect(`http://localhost:3000/completed?orderId=${vnp_Params["vnp_TxnRef"]}`);
  } else {
    return res.redirect(`http://localhost:3000/fail`);
  }
};

export const vnpayIPN = async (req, res) => {
  try {
    const vnp_Params = req.query;
    const isValid = vnpayService.verifyCallback(vnp_Params);

    if (isValid) {
      const orderId = vnp_Params["vnp_TxnRef"];
      const responseCode = vnp_Params["vnp_ResponseCode"];

      if (responseCode === "00") {
        await db.Order.update(
          { status: "paid" },
          { where: { id: orderId } }
        );
      }
      return res.status(200).json({ RspCode: "00", Message: "Confirm Success" });
    } else {
      return res.status(200).json({ RspCode: "97", Message: "Invalid checksum" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ RspCode: "99", Message: "Unknow error" });
  }
};