const { use } = require("../app");
const { User, Role } = require("../models");

const getAllUsers = async () => {
    try {
        const users = await User.findAll({
            attributes: ['user_id', 'profile_picture','first_name', 'last_name', 'email','is_verified'],
            include: [
                {
                    model: Role,
                    as: 'roles',
                    attributes: ['role_name'],
                    through: { attributes: [] } // Loại bỏ thông tin từ bảng trung gian UserRole
                }
            ]
        });

        // Chuyển đổi dữ liệu để trả về đúng format mong muốn
        const usersWithRoles = users.map(user => ({
            ...user.get({ plain: true }),
            roles: user.roles.map(role => role.role_name)
        }));

        return { success: true, users: usersWithRoles };
    } catch (error) {
        console.error("Error fetching users:", error);
        throw new Error("Internal Server Error");
    }
};

const assignRoleToUser = async (userId, roleId) => {
    try {
        const user = await User.findByPk(userId);
        const role = await Role.findByPk(roleId);

        if(!user || !role)
            return {success: false, message: "User or Role not found" };
        
        await user.addRole(role);
        return { success: true, message: "Role assigned successfully" };
    } catch (error) {
        console.error("Error assigning role:", error);
        throw new Error("Internal Server Error");
    }
}

const removeRoleFromUser = async (userId, roleId) =>{
    try {
        const user = await User.findByPk(userId);
        const role = await Role.findByPk(roleId);

        if(!user || !role)
            return {success: false, message: "User or Role not found" };
        
        await user.removeRole(role);
        return { success: true, message: "Role removed successfully" };
    } catch (error) {
        console.error("Error removing role:", error);
        throw new Error("Internal Server Error");
    }
}

const deleteUser = async (userId) => {
    try {
        const user = await User.findByPk(userId);
        
        if(!user)
            return {success:false, message: "User not found "};

        await user.destroy();
        return { success: true, message: "User deleted successfully" };
    } catch (error) {
        console.error("Error deleting user:", error);
        throw new Error("Internal Server Error");
    }
}

const updateUser = async (userId,updatedDate) => {
    try {
        const user = await User.findByPk(userId);
        
        if(!user)
            return {success:false, message: "User not found "};

        await user.update(updatedDate);
        return { success: true, message: "User updated successfully", user };
    } catch (error) {
        console.error("Error updating user:", error);
        throw new Error("Internal Server Error");
    }
}

const createUser = async (userData) => {
    try {
        
        const newUser = await User.create(userData);

        return { success: true, message: "User created successfully", user: newUser };
    } catch (error) {
        console.error("Error creating user:", error);
        throw new Error("Internal Server Error");
    }
};

module.exports = { 
    getAllUsers,
    assignRoleToUser,
    removeRoleFromUser,
    deleteUser,
    updateUser,
    createUser
 };   
