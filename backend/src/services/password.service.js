const bcrypt = require("bcryptjs");

class PasswordService {
  hash(plain) {
    return bcrypt.hash(plain, 10);
  }

  compare(plain, hashed) {
    return bcrypt.compare(plain, hashed);
  }
}

module.exports = new PasswordService();
