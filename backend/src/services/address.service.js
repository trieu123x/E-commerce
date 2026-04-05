import addressRepository from "../repositories/address.repository.js";
import db from "../../models/index.js";

class AddressService {
  async getUserAddresses(userId) {
    return await addressRepository.findAllByUserId(userId);
  }

  async getAddressById(userId, id) {
    const address = await addressRepository.findByIdAndUser(id, userId);
    if (!address) throw new Error("Address not found or unauthorized");
    return address;
  }

  async createAddress(userId, data) {
    const { address, district, ward, is_default = false } = data;
    const transaction = await db.sequelize.transaction();

    try {
      if (is_default) {
        await addressRepository.updateAll(userId, { is_default: false }, { transaction });
      }

      const newAddress = await addressRepository.create({
        user_id: userId,
        address,
        district,
        ward,
        is_default,
      }, { transaction });

      await transaction.commit();
      return newAddress;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async updateAddress(userId, id, data) {
    const { address, district, ward, is_default } = data;
    const transaction = await db.sequelize.transaction();

    try {
      const addressRecord = await addressRepository.findByIdAndUser(id, userId, { transaction });
      if (!addressRecord) {
        throw new Error("Address not found or unauthorized");
      }

      if (is_default === true && !addressRecord.is_default) {
        await addressRepository.updateAll(userId, { is_default: false }, { transaction });
      }

      await addressRecord.update({
        address: address || addressRecord.address,
        district: district || addressRecord.district,
        ward: ward || addressRecord.ward,
        is_default: is_default !== undefined ? is_default : addressRecord.is_default,
      }, { transaction });

      await transaction.commit();
      return addressRecord;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async deleteAddress(userId, id) {
    const transaction = await db.sequelize.transaction();

    try {
      const addressRecord = await addressRepository.findByIdAndUser(id, userId, { transaction });
      if (!addressRecord) {
        throw new Error("Address not found or unauthorized");
      }

      if (addressRecord.is_default) {
        const otherCount = await addressRepository.count(userId, id, { transaction });
        if (otherCount > 0) {
          throw new Error("Không thể xóa địa chỉ mặc định");
        }
      }

      await addressRecord.destroy({ transaction });
      await transaction.commit();
      return true;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async setDefaultAddress(userId, id) {
    const transaction = await db.sequelize.transaction();

    try {
      const addressRecord = await addressRepository.findByIdAndUser(id, userId, { transaction });
      if (!addressRecord) {
        throw new Error("Address not found or unauthorized");
      }

      await addressRepository.updateAll(userId, { is_default: false }, { transaction });
      addressRecord.is_default = true;
      await addressRecord.save({ transaction });

      await transaction.commit();
      return addressRecord;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

export default new AddressService();
