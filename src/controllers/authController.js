const User = require("../models/user");
const { registerUser, loginUser ,forgotPassword,resetPassword } = require("../services/authService");
const {verifyToken} = require("../config/jwt");
const {generateToken} = require("../config/jwt");

const handleregisterUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const result = await registerUser(username, email, password);

    return res.status(201).json({
      message: "User registration successful. Please check your email for verification.",
      user: {
        user_id: result.user_id,
        username: result.username,
        email: result.email,
        role: result.role
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
  const { token } = req.query;
  if (!token) {
    return res.status(400).json({ message: 'Token is required' });
  }

  try {
    const decoded = verifyToken(token) ;

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

const handleForgotPassword = async (req, res) => {
  try {

    const { email } = req.body;

    const result = await forgotPassword(email);

    return res.status(200).json(result);
  } catch (error) {
    if (error.message === "No user found with this email") {
      return res.status(404).json({ message: error.message });
    }
    console.error("Error in forgotPassword:", error);
    return res.status(500).json({ message: "Failed to send reset password email, please try again later" });
  }
};

const handleResetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    const resultMessage = await resetPassword(token, newPassword);
    
    return res.status(200).json({ message: resultMessage });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    
    if (error.name === "TokenExpiredError") {
      return res.status(400).json({ message: "Reset token has expired" });
    }
    if (error.message === "Reset token is required") {
      return res.status(400).json({ message: "Reset token is required" });
    }
    if (error.message === "User not found") {
      return res.status(404).json({ message: "User not found" });
    }
    
    return res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = { 
  handleregisterUser,
  handleLoginUser, 
  verifyEmail,
  handleForgotPassword,
  handleResetPassword
  
};
