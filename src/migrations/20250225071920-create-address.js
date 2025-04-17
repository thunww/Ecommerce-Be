// migrations/[timestamp]-create-addresses.js
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Addresses', {
            address_id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Users',
                    key: 'user_id',
                },
                onDelete: 'CASCADE',
            },
            recipient_name: {
                type: Sequelize.STRING(100),
                allowNull: true,
                defaultValue: 'Khách hàng'
            },
            phone: {
                type: Sequelize.STRING(15),
                allowNull: true,
            },
            address_line: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
            city: {
                type: Sequelize.STRING(50),
                allowNull: true,
            },
            province: {
                type: Sequelize.STRING(50),
                allowNull: true,
            },
            postal_code: {
                type: Sequelize.STRING(10),
                allowNull: true,
            },
            is_default: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
        });
    },
    down: async (queryInterface) => {
        await queryInterface.dropTable('Addresses');
    },
}; 