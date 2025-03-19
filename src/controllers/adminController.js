const {
  getAllUsers,
  assignRoleToUser,
  removeRoleFromUser,
  deleteUser,
  updateUser,
  createUser,
  getUserById,
} = require("../services/adminService");

const handleGetAllUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const handleAssignRoleToUser = async (req, res) => {
  try {
    const { userId, roleId } = req.body;
    const result = await assignRoleToUser(userId, roleId);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error assigning role:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
const handleRemoveRoleFromUser = async (req, res) => {
  try {
    const { userId, roleId } = req.body;
    const result = await removeRoleFromUser(userId, roleId);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error removing role:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Xóa user
const handleDeleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await deleteUser(userId);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Cập nhật thông tin user
const handleUpdateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const updateData = req.body;
    const result = await updateUser(userId, updateData);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const handleCreateUser = async (req, res) => {
  try {
    const userData = req.body;
    const result = await createUser(userData);
    res.status(201).json(result);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const handleGetUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await getUserById(userId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {
  handleGetAllUsers,
  handleAssignRoleToUser,
  handleDeleteUser,
  handleRemoveRoleFromUser,
  handleUpdateUser,
  handleCreateUser,
  handleGetUserById,
};
