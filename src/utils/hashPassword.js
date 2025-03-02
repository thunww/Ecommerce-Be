const bcrypt = require('bcrypt');
const saltRounds = 5;

const hashPassword = (password) => {
const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
};

module.exports = hashPassword; 
