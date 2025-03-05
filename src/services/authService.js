const User = require("../models/user");
const Role = require("../models/role");
const UserRole = require("../models/userrole");
const {hashPassword,comparePassword} = require("../utils/hashPassword");
const {generateToken, verifyToken} = require("../config/jwt");
const {sendVerificationEmail, sendResetPasswordEmail }= require("../utils/sendEmail");

const registerUser = async (username, email, password) => {
  if (!username || !email || !password) {
    throw new Error("Missing information");
  }
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) throw new Error("Email already in use");

  const hashedPassword = await hashPassword(password);
  const newUser = await User.create({ username, email, password: hashedPassword });

  const customerRole = await Role.findOne({ where: { role_name: 'customer' } });
  await UserRole.create({ user_id: newUser.user_id, role_id: customerRole.role_id });

  const verificationToken = generateToken({
    user_id: newUser.user_id,
    email: newUser.email,
    role: customerRole.role_name
  });

  try {
    await sendVerificationEmail(newUser.email, verificationToken);
    console.log("Verification email sent successfully.");
  } catch (error) {
    console.log("Error sending verification email: ", error.message);
  }

   return {
    user_id: newUser.user_id,
    username: newUser.username,
    email: newUser.email,
    role: customerRole.role_name
  };
};


const loginUser = async (email, password) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error('Email does not exist!');
  }

  const isMatch = comparePassword(password, user.password);

  if (!isMatch) {
    throw new Error('Incorrect password!');
  }

  if(!user.is_verified){
    throw new Error('Please verify your email first!');
  }

  const userRole = await UserRole.findOne({ where: { user_id: user.user_id } });
  if (!userRole) {
    throw new Error('User has no assigned role!');
  }
  const role = await Role.findOne({ where: { role_id: userRole.role_id } });

  const token = generateToken({ user_id: user.user_id, email: user.email, role: role.role_name });

  return {
    message: "Login successful",
    token,
    user: {
      user_id: user.user_id,
      email: user.email,
      role: role.role_name,
    }
  };
};

const forgotPassword = async (email) => {

  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error("No user found with this email");
  }
  
  const resetToken = generateToken({ userId: user.user_id }, "1h");
  
  await sendResetPasswordEmail(email, resetToken);
  
  return { message: "Password reset email has been sent" };
};

const resetPassword = async (token, newPassword) => {
  if (!token) {
    throw new Error("Reset token is required");
  }

  const decoded = verifyToken(token);
  const userId = decoded.userId;

  const user = await User.findOne({ where: { user_id: userId } });
  if (!user) {
    throw new Error("User not found");
  }

  const hashedPassword = hashPassword(newPassword);
  user.password = hashedPassword;
  await user.save();

  return "Password has been successfully changed";
};


module.exports = { registerUser, loginUser, forgotPassword,resetPassword };
