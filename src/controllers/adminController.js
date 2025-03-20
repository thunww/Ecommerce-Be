const {
  getAllUsers,
  assignRoleToUser,
  removeRoleFromUser,
  getUserById,
  banUser,
  unbanUser,
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

const handleGetUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await getUserById(userId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const handleBanUser = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    const result = await banUser(userId);
    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

const handleUnbanUser = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    const result = await unbanUser(userId);
    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

module.exports = {
  handleGetAllUsers,
  handleAssignRoleToUser,
  handleRemoveRoleFromUser,
  handleGetUserById,
  handleBanUser,
  handleUnbanUser,
};
