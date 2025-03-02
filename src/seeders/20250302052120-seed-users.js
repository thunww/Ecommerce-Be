const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface) => {
    const hashedPassword = await bcrypt.hash('password123', 5);

    await queryInterface.bulkInsert('Users', [
      {
        user_id: 1,
        first_name: 'John',
        last_name: 'Doe',
        username: 'johndoe',
        password: hashedPassword,
        email: 'johndoe@example.com',
        phone: '123456789',
        gender: 'male',
        date_of_birth: '1990-01-01',
        profile_picture: null,
        is_verified: true,
      },
      {
        user_id: 2,
        first_name: 'Jane',
        last_name: 'Smith',
        username: 'janesmith',
        password: hashedPassword,
        email: 'janesmith@example.com',
        phone: '987654321',
        gender: 'female',
        date_of_birth: '1995-05-15',
        profile_picture: null,
        is_verified: false,
      },
      {
        user_id: 3,
        first_name: 'Admin',
        last_name: 'User',
        username: 'admin',
        password: await bcrypt.hash('admin', 5),// Mật khẩu là 'admin123'
        email: 'admin@example.com',
        phone: '000000000',
        gender: 'male',
        date_of_birth: '1985-12-12',
        profile_picture: null,
        is_verified: true,
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Users', null, {});
  },
};
