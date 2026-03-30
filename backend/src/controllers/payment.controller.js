import { createPayment } from "../services/momo.service.js";
import vnpayService from "../services/vnpay.service.js";
import stripeService from "../services/stripe.service.js";
import orderService from "../services/order.service.js";
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
    await orderService.completeOrder(orderId);
    return res.redirect(`http://localhost:3000/completed?orderId=${orderId}`);
  } else {
    await orderService.cancelOrder(orderId);
    return res.redirect(`http://localhost:3000/fail?orderId=${orderId}`);
  }
};

export const momoIPN = async (req, res) => {
  try {
    const { orderId, resultCode } = req.body;

    let actualOrderId = orderId;
    if (typeof orderId === "string" && orderId.includes("_")) {
      actualOrderId = orderId.split("_")[1];
    }

    if (resultCode == 0) {
      await orderService.completeOrder(actualOrderId);
    } else {
      await orderService.cancelOrder(actualOrderId);
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

  console.log("VNPay Return RAW PARAMS:", vnp_Params);
  console.log("isValid:", isValid);

  const orderId = vnp_Params["vnp_TxnRef"];

  if (isValid && vnp_Params["vnp_ResponseCode"] === "00") {
    await orderService.completeOrder(orderId);
    return res.redirect(`http://localhost:3000/completed?orderId=${orderId}`);
  } else {
    // Nếu thanh toán thất bại hoặc khách hủy
    await orderService.cancelOrder(orderId);
    return res.redirect(`http://localhost:3000/fail?orderId=${orderId}`);
  }
};

export const vnpayIPN = async (req, res) => {
  try {
    const vnp_Params = req.query;
    const isValid = vnpayService.verifyCallback(vnp_Params);
    console.log("RAW PARAMS:", req.query);
    console.log("isValid:", isValid);
    if (isValid) {
      const orderId = vnp_Params["vnp_TxnRef"];
      const responseCode = vnp_Params["vnp_ResponseCode"];

      if (responseCode === "00") {
        await orderService.completeOrder(orderId);
      } else {
        await orderService.cancelOrder(orderId);
      }

      console.log(responseCode, orderId);
      return res
        .status(200)
        .json({ RspCode: "00", Message: "Confirm Success" });
    } else {
      return res
        .status(200)
        .json({ RspCode: "97", Message: "Invalid checksum" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ RspCode: "99", Message: "Unknow error" });
  }
};

export const createStripePayment = async (req, res) => {
  try {
    const { orderId } = req.body;
    console.log(`[Stripe] Creating checkout session for order ${orderId}...`);
    const order = await db.Order.findByPk(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const session = await stripeService.createCheckoutSession(order);
    return res.json({ payUrl: session.url });
  } catch (err) {
    console.error("Stripe error:", err.message);
    return res.status(500).json({ 
      success: false, 
      message: err.message || "Lỗi khi tạo phiên thanh toán Stripe",
      error_code: err.code
    });
  }
};

export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    // Stripe webhooks require the RAW body to verify the signature
    event = stripeService.verifyWebhook(req.rawBody, sig);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;
      const orderId = session.metadata.orderId;
      console.log(`Stripe: Payment successful for Order ${orderId}`);
      await orderService.completeOrder(orderId);
      break;

    case "checkout.session.expired":
      const expiredSession = event.data.object;
      const expiredOrderId = expiredSession.metadata.orderId;
      console.log(`Stripe: Session expired for Order ${expiredOrderId}`);
      await orderService.cancelOrder(expiredOrderId);
      break;

    default:
      console.log(`Stripe: Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};
