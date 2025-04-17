const addressService = require('../services/addressService');

exports.getAddresses = async (req, res) => {
    try {
        const addresses = await addressService.getAddresses(req.user.user_id);
        res.json(addresses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.addAddress = async (req, res) => {
    try {
        const { recipient_name, phone, address_line, city, province, postal_code, is_default } = req.body;
        const newAddress = await addressService.addAddress(req.user.user_id, recipient_name, phone, address_line, city, province, postal_code, is_default);
        res.status(201).json(newAddress);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateAddress = async (req, res) => {
    try {
        const { recipient_name, phone, address_line, city, province, postal_code, is_default } = req.body;
        const updatedAddress = await addressService.updateAddress(req.params.id, recipient_name, phone, address_line, city, province, postal_code, is_default);
        res.json(updatedAddress);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteAddress = async (req, res) => {
    try {
        await addressService.deleteAddress(req.params.id);
        res.json({ message: 'Đã xóa địa chỉ' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 