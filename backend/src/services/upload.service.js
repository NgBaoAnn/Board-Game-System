const supabase = require("../configs/storage.config");
const BadRequestError = require("../errors/badrequest.exception");

class UploadService {
  constructor() {
    this.avatarBucket = "avatars";
    this.gameBucket = "game-images";
  }

  async uploadAvatar(file) {
    if (!supabase) {
      throw new BadRequestError("Storage is not configured");
    }

    if (!file) {
      throw new BadRequestError("No file uploaded");
    }

    const fileExt = file.originalname.split(".").pop();
    const fileName = `avatar_${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from(this.avatarBucket)
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (error) {
      throw new BadRequestError(`Upload failed: ${error.message}`);
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(this.avatarBucket).getPublicUrl(fileName);

    return {
      url: publicUrl,
    };
  }

  async uploadGameImage(file) {
    if (!supabase) {
      throw new BadRequestError("Storage is not configured");
    }

    if (!file) {
      throw new BadRequestError("No file uploaded");
    }

    const fileExt = file.originalname.split(".").pop();
    const fileName = `game_${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from(this.gameBucket)
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (error) {
      throw new BadRequestError(`Upload failed: ${error.message}`);
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(this.gameBucket).getPublicUrl(fileName);

    return {
      url: publicUrl,
    };
  }
}

module.exports = new UploadService();
