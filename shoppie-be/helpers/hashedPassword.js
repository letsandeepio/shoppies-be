const bcrypt = require('bcrypt');

const hashedPassword = (password) => {
  const saltRounds = 10;
  return bcrypt.hashSync(password, saltRounds);
};

module.exports = hashedPassword;
