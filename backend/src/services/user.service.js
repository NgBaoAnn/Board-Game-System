const userRepo = require("../repositories/user.repo");
const sanitizeUser = require("../utils/sanitize-user");
const NotFoundError = require("../errors/notfound.exception");
const passwordService = require("./password.service");
class UserService {
  async createUser({ email, password, username, role_id }) {
    const existing = await userRepo.findByEmail(email);
    if (existing) {
      throw new DuplicateError("Email already exists");
    }

    const hashedPassword = await passwordService.hash(password);

    const user = await userRepo.create({
      role_id: role_id,
      username,
      email,
      password: hashedPassword,
    });

    return sanitizeUser(user);
  }

  async updateUser(payload) {
    const { id, ...updateData } = payload;
    const updatedUser = await userRepo.update(id, updateData);
    return sanitizeUser(updatedUser);
  }

  async getUser(id) {
    const user = await userRepo.findById(id);

    if (!user) {
      throw new NotFoundError("User not found!");
    }
    return sanitizeUser(user);
  }

  async getAllUser({ page = 1, limit = 10 } = {}) {
    const offset = (page - 1) * limit;
    const listUsers = await userRepo.findAll({ offset, limit });
    return listUsers.map(sanitizeUser);
  }

  async deleteUser(id) {
    const existing = await userRepo.findById(id);

    if (!existing) {
      throw new NotFoundError("User not found");
    }

    await userRepo.remove(id);
    return true;
  }
}

module.exports = new UserService();
