const AddressService = require("../services/AddressService");

const getAllAddressesById = async (req, res) => {
  try {
    const user_id = req.user?.id;
    if (!user_id) {
      return res.status(400).json({
        status: "error",
        message: "User ID is required",
        data: null,
      });
    }

    const result = await AddressService.getAllAddressesById(user_id);
    return res.status(result.status === "success" ? 200 : 404).json(result);
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error: " + error.message,
      data: null,
    });
  }
};

const createAddress = async (req, res) => {
  try {
    const user_id = req.user?.id;
    if (!user_id) {
      return res.status(400).json({
        status: "error",
        message: "User ID is required",
        data: null,
      });
    }

    const result = await AddressService.createAddress(user_id, req.body);
    return res.status(result.status === "success" ? 201 : 400).json(result);
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error: " + error.message,
      data: null,
    });
  }
};

const getAddressById = async (req, res) => {
  try {
    const user_id = req.user?.id;
    const address_id = parseInt(req.params.address_id);
    if (!user_id || !address_id) {
      return res.status(400).json({
        status: "error",
        message: "User ID and address ID are required",
        data: null,
      });
    }

    const result = await AddressService.getAddressById(address_id, user_id);
    return res.status(result.status === "success" ? 200 : 404).json(result);
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error: " + error.message,
      data: null,
    });
  }
};

const getDefaultAddress = async (req, res) => {
  try {
    const user_id = req.user?.id;
    if (!user_id) {
      return res.status(400).json({
        status: "error",
        message: "User ID is required",
        data: null,
      });
    }

    const result = await AddressService.getDefaultAddress(user_id);
    return res.status(result.status === "success" ? 200 : 404).json(result);
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error: " + error.message,
      data: null,
    });
  }
};

const updateAddress = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const address_id = parseInt(req.params.address_id);
    if (!user_id || !address_id) {
      return res.status(400).json({
        status: "error",
        message: "User ID and address ID are required",
        data: null,
      });
    }

    const result = await AddressService.updateAddress(
      address_id,
      user_id,
      req.body
    );
    return res.status(result.status === "success" ? 200 : 404).json(result);
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error: " + error.message,
      data: null,
    });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const address_id = parseInt(req.params.address_id);
    if (!user_id || !address_id) {
      return res.status(400).json({
        status: "error",
        message: "User ID and address ID are required",
        data: null,
      });
    }

    const result = await AddressService.deleteAddress(address_id, user_id);
    return res.status(result.status === "success" ? 200 : 404).json(result);
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error: " + error.message,
      data: null,
    });
  }
};

const setDefaultAddress = async (req, res) => {
  try {
    const user_id = req.user?.id;
    const address_id = parseInt(req.params.address_id);
    if (!user_id || !address_id) {
      return res.status(400).json({
        status: "error",
        message: "User ID and address ID are required",
        data: null,
      });
    }

    const result = await AddressService.setDefaultAddress(address_id, user_id);
    return res.status(result.status === "success" ? 200 : 404).json(result);
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error: " + error.message,
      data: null,
    });
  }
};

module.exports = {
  getAllAddressesById,
  createAddress,
  getAddressById,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  getDefaultAddress,
};
