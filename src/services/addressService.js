const { Address } = require("../models");
const { Op } = require("sequelize");

class AddressService {
  // Lấy tất cả địa chỉ của một user
  async getAllAddressesById(user_id) {
    try {
      if (!user_id || isNaN(user_id)) {
        return {
          status: "error",
          message: "Invalid user ID",
          data: null,
        };
      }

      const addresses = await Address.findAll({
        where: { user_id },
        order: [
          ["is_default", "DESC"],
          ["created_at", "DESC"],
        ],
      });

      if (addresses.length === 0) {
        return {
          status: "error",
          message: "No addresses found for this user",
          data: null,
        };
      }

      return {
        status: "success",
        message: "Addresses retrieved successfully",
        data: addresses,
      };
    } catch (error) {
      return {
        status: "error",
        message: "Failed to retrieve addresses: " + error.message,
        data: null,
      };
    }
  }

  // Tạo địa chỉ mới
  async createAddress(user_id, addressData) {
    try {
      if (!user_id || isNaN(user_id)) {
        return {
          status: "error",
          message: "Invalid user ID",
          data: null,
        };
      }

      const {
        recipient_name,
        phone,
        address_line,
        city,
        district,
        ward,
        is_default,
      } = addressData;

      // Validation cơ bản
      if (
        !recipient_name ||
        !phone ||
        !address_line ||
        !city ||
        !district ||
        !ward
      ) {
        return {
          status: "error",
          message: "Missing required fields",
          data: null,
        };
      }

      // Nếu đặt is_default = true, cập nhật các địa chỉ khác thành false
      if (is_default) {
        await Address.update(
          { is_default: false },
          { where: { user_id, is_default: true } }
        );
      }

      const newAddress = await Address.create({
        user_id,
        recipient_name,
        phone,
        address_line,
        city,
        district,
        ward,
        is_default: is_default || false,
      });

      return {
        status: "success",
        message: "Address created successfully",
        data: newAddress,
      };
    } catch (error) {
      return {
        status: "error",
        message: "Failed to create address: " + error.message,
        data: null,
      };
    }
  }

  // Lấy một địa chỉ theo address_id
  async getAddressById(address_id, user_id) {
    try {
      if (!address_id || isNaN(address_id) || !user_id || isNaN(user_id)) {
        return {
          status: "error",
          message: "Invalid address ID or user ID",
          data: null,
        };
      }

      const address = await Address.findOne({
        where: { address_id, user_id },
      });

      if (!address) {
        return {
          status: "error",
          message: "Address not found",
          data: null,
        };
      }

      return {
        status: "success",
        message: "Address retrieved successfully",
        data: address,
      };
    } catch (error) {
      return {
        status: "error",
        message: "Failed to retrieve address: " + error.message,
        data: null,
      };
    }
  }
  // Lấy địa chỉ mặc định của user
  async getDefaultAddress(user_id) {
    try {
      if (!user_id || isNaN(user_id)) {
        return {
          status: "error",
          message: "Invalid user ID",
          data: null,
        };
      }

      const defaultAddress = await Address.findOne({
        where: {
          user_id,
          is_default: true,
        },
      });

      if (!defaultAddress) {
        return {
          status: "error",
          message: "Default address not found",
          data: null,
        };
      }

      return {
        status: "success",
        message: "Default address retrieved successfully",
        data: defaultAddress,
      };
    } catch (error) {
      return {
        status: "error",
        message: "Failed to retrieve default address: " + error.message,
        data: null,
      };
    }
  }

  // Cập nhật địa chỉ
  async updateAddress(address_id, user_id, updateData) {
    try {
      if (!address_id || isNaN(address_id) || !user_id || isNaN(user_id)) {
        return {
          status: "error",
          message: "Invalid address ID or user ID",
          data: null,
        };
      }

      const address = await Address.findOne({
        where: { address_id, user_id },
      });

      if (!address) {
        return {
          status: "error",
          message: "Address not found",
          data: null,
        };
      }

      const {
        recipient_name,
        phone,
        address_line,
        city,
        district,
        ward,
        is_default,
      } = updateData;

      // Nếu cập nhật is_default = true, đặt các địa chỉ khác thành false
      if (is_default) {
        await Address.update(
          { is_default: false },
          { where: { user_id, is_default: true } }
        );
      }

      await address.update({
        recipient_name: recipient_name || address.recipient_name,
        phone: phone || address.phone,
        address_line: address_line || address.address_line,
        city: city || address.city,
        district: district || address.district,
        ward: ward || address.ward,
        is_default: is_default !== undefined ? is_default : address.is_default,
      });

      return {
        status: "success",
        message: "Address updated successfully",
        data: address,
      };
    } catch (error) {
      return {
        status: "error",
        message: "Failed to update address: " + error.message,
        data: null,
      };
    }
  }

  // Xóa địa chỉ
  async deleteAddress(address_id, user_id) {
    try {
      if (!address_id || isNaN(address_id) || !user_id || isNaN(user_id)) {
        return {
          status: "error",
          message: "Invalid address ID or user ID",
          data: null,
        };
      }

      const address = await Address.findOne({
        where: { address_id, user_id },
      });

      if (!address) {
        return {
          status: "error",
          message: "Address not found",
          data: null,
        };
      }

      await address.destroy();

      // Kiểm tra xem user còn bao nhiêu địa chỉ
      const remainingAddresses = await Address.findAll({
        where: { user_id },
      });

      if (remainingAddresses.length === 0) {
        return {
          status: "success",
          message: "Address deleted. No addresses left for this user",
          data: [],
        };
      }

      return {
        status: "success",
        message: "Address deleted successfully",
        data: remainingAddresses,
      };
    } catch (error) {
      return {
        status: "error",
        message: "Failed to delete address: " + error.message,
        data: null,
      };
    }
  }

  // Đặt địa chỉ làm mặc định
  async setDefaultAddress(address_id, user_id) {
    try {
      if (!address_id || isNaN(address_id) || !user_id || isNaN(user_id)) {
        return {
          status: "error",
          message: "Invalid address ID or user ID",
          data: null,
        };
      }

      const address = await Address.findOne({
        where: { address_id, user_id },
      });

      if (!address) {
        return {
          status: "error",
          message: "Address not found",
          data: null,
        };
      }

      // Đặt tất cả địa chỉ khác của user thành không mặc định
      await Address.update(
        { is_default: false },
        { where: { user_id, is_default: true } }
      );

      // Đặt địa chỉ này thành mặc định
      await address.update({ is_default: true });

      return {
        status: "success",
        message: "Default address set successfully",
        data: address,
      };
    } catch (error) {
      return {
        status: "error",
        message: "Failed to set default address: " + error.message,
        data: null,
      };
    }
  }
}

module.exports = new AddressService();
