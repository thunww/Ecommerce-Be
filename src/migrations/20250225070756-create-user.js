module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      user_id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      first_name: { type: Sequelize.STRING(50), allowNull: true },
      last_name: { type: Sequelize.STRING(50), allowNull: true },
      username: { type: Sequelize.STRING(50), allowNull: false, unique: true },
      password: { type: Sequelize.STRING(255), allowNull: false },
      email: { type: Sequelize.STRING(100), allowNull: false, unique: true },
      phone: { type: Sequelize.STRING(15), allowNull: true, unique: true },
      gender: { type: Sequelize.STRING(10), allowNull: true },
      date_of_birth: { type: Sequelize.DATE, allowNull: true },
      profile_picture: { type: Sequelize.STRING(255), allowNull: true },
      is_verified: { type: Sequelize.BOOLEAN, defaultValue: false },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('Users');
  },
};
