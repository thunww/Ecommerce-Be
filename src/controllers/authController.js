const User = require("../models/user");
const Role = require("../models/role");
const UserRole = require("../models/userrole");
const { registerUser, loginUser } = require("../services/authService");
const {verifyToken} = require("../config/jwt");
const handleregisterUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const result = await registerUser(username, email, password);

    return res.status(201).json({
      message: "User registration successful. Please check your email for verification.",
      user: {
        user_id: result.user_id,
        username: result.username,
        email: result.email
      }
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message
    });
  }
};


const handleLoginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const { token, user } = await loginUser(email, password);
    
    res.json({ message: 'Login successful', token, user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const verifyEmail = async (req, res) => {
  const { token } = req.query; // Lấy token từ query string

  if (!token) {
    return res.status(400).json({ message: 'Token is required' });
  }

  try {
    const decoded = verifyToken(token) ;// Giải mã token

    const user = await User.findOne({ where: { user_id: decoded.user_id } });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    user.is_verified = true;
    await user.save();

    return res.status(200).json({ message: 'Email successfully verified' });
  } catch (error) {
    return res.status(400).json({ message: 'Invalid or expired token' });
  }
};


module.exports = { handleregisterUser, handleLoginUser, verifyEmail };
