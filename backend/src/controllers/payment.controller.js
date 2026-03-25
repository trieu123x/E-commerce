import { createPayment } from "../services/momo.service.js";
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