const User = require("../models/user");
const Role = require("../models/role");
const UserRole = require("../models/userrole");
const bcrypt = require("bcrypt");
const { registerUser, loginUser } = require("../services/authService");

const handleregisterUser = async (req, res) => {
  try {

    const { username, email, password } = req.body;

    const user = await registerUser(username, email, password);

    return res.status(201).json({
      message: "Registration successful",
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        role: "customer",
      },
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const handleLoginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Gọi service xử lý đăng nhập
    const { token, user } = await loginUser(email, password);
    
    res.json({ message: 'Login successful', token, user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { handleregisterUser, handleLoginUser };
