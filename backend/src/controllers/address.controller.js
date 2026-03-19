import db from "../../models/index.js";

export const createAddress = async (req, res) => {
  const transaction = await db.sequelize.transaction();

  try {
    const userId = req.user.id;
    const { address, district, ward, is_default = false } = req.body;

    // Validation
    if (!address || !district || !ward) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập đầy đủ thông tin địa chỉ'
      });
    }

    // Nếu set default → bỏ default cũ
    if (is_default) {
      await db.Address.update(
        { is_default: false },
        {
          where: { user_id: userId, is_default: true },
          transaction
        }
      );
    }

    const newAddress = await db.Address.create({
      user_id: userId,
      address,
      district,
      ward,
      is_default
    }, { transaction });

    await transaction.commit();

    res.status(201).json({
      success: true,
      data: newAddress
    });

  } catch (error) {
    await transaction.rollback();
    console.error(error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

export const getUserAddresses = async (req, res) => {
  try {
    const userId = req.user.id;

    const addresses = await db.Address.findAll({
      where: { user_id: userId },
      order: [['is_default', 'DESC']]
    });

    res.json({ success: true, data: addresses });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

export const getAddressById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const address = await db.Address.findOne({
      where: { id, user_id: userId }
    });

    if (!address) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy' });
    }

    res.json({ success: true, data: address });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

export const updateAddress = async (req, res) => {
  const transaction = await db.sequelize.transaction();

  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { address, district, ward, is_default } = req.body;

    const addressRecord = await db.Address.findOne({
      where: { id, user_id: userId },
      transaction
    });

    if (!addressRecord) {
      await transaction.rollback();
      return res.status(404).json({ success: false, message: 'Không tìm thấy địa chỉ' });
    }

    // Nếu set default
    if (is_default === true && !addressRecord.is_default) {
      await db.Address.update(
        { is_default: false },
        {
          where: { user_id: userId },
          transaction
        }
      );
    }

    await addressRecord.update({
      address: address || addressRecord.address,
      district: district || addressRecord.district,
      ward: ward || addressRecord.ward,
      is_default: is_default !== undefined ? is_default : addressRecord.is_default
    }, { transaction });

    await transaction.commit();

    res.json({ success: true, data: addressRecord });

  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

export const deleteAddress = async (req, res) => {
  const transaction = await db.sequelize.transaction();

  try {
    const { id } = req.params;
    const userId = req.user.id;

    const address = await db.Address.findOne({
      where: { id, user_id: userId },
      transaction
    });

    if (!address) {
      await transaction.rollback();
      return res.status(404).json({ success: false, message: 'Không tìm thấy địa chỉ' });
    }

    // Không cho xóa default nếu còn address khác
    if (address.is_default) {
      const count = await db.Address.count({
        where: {
          user_id: userId,
          id: { [db.Sequelize.Op.ne]: id }
        },
        transaction
      });

      if (count > 0) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: 'Không thể xóa địa chỉ mặc định'
        });
      }
    }

    await address.destroy({ transaction });

    await transaction.commit();

    res.json({ success: true });

  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ success: false });
  }
};

export const setDefaultAddress = async (req, res) => {
  const transaction = await db.sequelize.transaction();

  try {
    const { id } = req.params;
    const userId = req.user.id;

    const address = await db.Address.findOne({
      where: { id, user_id: userId },
      transaction
    });

    if (!address) {
      await transaction.rollback();
      return res.status(404).json({ success: false });
    }

    await db.Address.update(
      { is_default: false },
      { where: { user_id: userId }, transaction }
    );

    address.is_default = true;
    await address.save({ transaction });

    await transaction.commit();

    res.json({ success: true, data: address });

  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ success: false });
  }
};


