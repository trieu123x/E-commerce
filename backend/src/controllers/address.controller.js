import addressService from "../services/address.service.js";

export const createAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const address = await addressService.createAddress(userId, req.body);
    res.status(201).json({
      success: true,
      data: address,
    });
  } catch (error) {
    console.error("Create address error:", error);
    res.status(500).json({ success: false, message: error.message || "Lỗi server" });
  }
};

export const getUserAddresses = async (req, res) => {
  try {
    const userId = req.user.id;
    const addresses = await addressService.getUserAddresses(userId);
    res.json({ success: true, data: addresses });
  } catch (error) {
    console.error("Get user addresses error:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

export const getAddressById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const address = await addressService.getAddressById(userId, id);
    res.json({ success: true, data: address });
  } catch (error) {
    console.error("Get address by id error:", error);
    const status = error.message.includes("not found") ? 404 : 500;
    res.status(status).json({ success: false, message: error.message || "Lỗi server" });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const address = await addressService.updateAddress(userId, id, req.body);
    res.json({ success: true, data: address });
  } catch (error) {
    console.error("Update address error:", error);
    const status = error.message.includes("not found") ? 404 : 500;
    res.status(status).json({ success: false, message: error.message || "Lỗi server" });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    await addressService.deleteAddress(userId, id);
    res.json({ success: true });
  } catch (error) {
    console.error("Delete address error:", error);
    const status = error.message.includes("not found") ? 404 : (error.message.includes("mặc định") ? 400 : 500);
    res.status(status).json({ success: false, message: error.message || "Lỗi server" });
  }
};

export const setDefaultAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const address = await addressService.setDefaultAddress(userId, id);
    res.json({ success: true, data: address });
  } catch (error) {
    console.error("Set default address error:", error);
    const status = error.message.includes("not found") ? 404 : 500;
    res.status(status).json({ success: false, message: error.message || "Lỗi server" });
  }
};

// Aliases for compatibility
export const getAddresses = getUserAddresses;
