const { Address } = require('../models');
const { Op } = require('sequelize');

class AddressService {
    async getAddresses(user_id) {
        return await Address.findAll({
            where: { user_id },
            order: [
                ['is_default', 'DESC'],
                ['created_at', 'DESC']
            ]
        });
    }

    async addAddress(user_id, full_name, phone, address, city, district, ward, is_default) {
        // Nếu địa chỉ mới là mặc định, bỏ mặc định của các địa chỉ khác
        if (is_default) {
            await Address.update(
                { is_default: false },
                { where: { user_id } }
            );
        }

        // Tạo địa chỉ mới
        return await Address.create({
            user_id,
            full_name,
            phone,
            address,
            city,
            district,
            ward,
            is_default: is_default || false
        });
    }

    async updateAddress(address_id, full_name, phone, address, city, district, ward, is_default) {
        const addressObj = await Address.findByPk(address_id);
        if (!addressObj) {
            throw new Error('Không tìm thấy địa chỉ');
        }

        // Nếu địa chỉ được cập nhật thành mặc định, bỏ mặc định của các địa chỉ khác
        if (is_default) {
            await Address.update(
                { is_default: false },
                {
                    where: {
                        user_id: addressObj.user_id,
                        id: { [Op.ne]: address_id }
                    }
                }
            );
        }

        // Cập nhật thông tin địa chỉ
        addressObj.full_name = full_name;
        addressObj.phone = phone;
        addressObj.address = address;
        addressObj.city = city;
        addressObj.district = district;
        addressObj.ward = ward;
        addressObj.is_default = is_default || false;
        await addressObj.save();

        return addressObj;
    }

    async deleteAddress(address_id) {
        const address = await Address.findByPk(address_id);
        if (!address) {
            throw new Error('Không tìm thấy địa chỉ');
        }

        // Nếu xóa địa chỉ mặc định, cập nhật địa chỉ mặc định mới
        if (address.is_default) {
            const newDefaultAddress = await Address.findOne({
                where: {
                    user_id: address.user_id,
                    id: { [Op.ne]: address_id }
                }
            });

            if (newDefaultAddress) {
                newDefaultAddress.is_default = true;
                await newDefaultAddress.save();
            }
        }

        await address.destroy();
    }
}

module.exports = new AddressService(); 