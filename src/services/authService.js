const User = require("../models/user");
const Role = require("../models/role")
const UserRole = require("../models/userrole");
const {hashPassword,comparePassword} = require("../utils/hashPassword");
const {generateToken} = require("../config/jwt")
require("dotenv").config();

const registerUser = async (username, email, password) => {
  if (!username || !email || !password) {
    throw new Error("Missing information");
  }

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser)
     throw new Error('Email already in use');

  const hashedPassword = await hashPassword(password);
  const newUser = await User.create({ username, email, password: hashedPassword });

  const customerRole = await Role.findOne({ where: { role_name: 'customer' } });
  if (!customerRole) throw new Error('Role customer không tồn tại');

  await UserRole.create({ user_id: newUser.user_id, role_id: customerRole.role_id });

  return newUser; 
};

const loginUser = async (email, password) => {
  // Tìm user theo email
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error('Email does not exist!');
  }
  const isMatch = comparePassword(password, user.password);
  if (!isMatch) {
    throw new Error('Incorrect password!');
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



module.exports = { registerUser, loginUser };
