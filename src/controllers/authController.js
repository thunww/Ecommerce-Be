const User = require("../models/user");
const Role = require("../models/role");
const UserRole = require("../models/userrole");
const bcrypt = require("bcrypt");
const { generateToken } = require("../config/jwt");
const { registerUser } = require("../services/authService");

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

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Missing email or password" });
    }

    const user = await User.findOne({ where: { email }, include: Role });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const roles = user.Roles.map((r) => r.name);
    const token = generateToken({ id: user.user_id, email: user.email, roles });

    return res.status(200).json({ token, user, roles });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { handleregisterUser, loginUser };
