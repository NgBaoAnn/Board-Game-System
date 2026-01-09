const fs = require("fs");
const path = require("path");
const transporter = require("../configs/email.config");

class EmailService {
  constructor() {
    this.from =
      process.env.MAIL_FROM || "Game Board System <noreply@gameboard.com>";
  }

  loadTemplate(templateName, replacements = {}) {
    const templatePath = path.join(
      __dirname,
      "../templates",
      `${templateName}.html`
    );
    let template = fs.readFileSync(templatePath, "utf-8");

    Object.keys(replacements).forEach((key) => {
      template = template.replace(
        new RegExp(`{{${key}}}`, "g"),
        replacements[key]
      );
    });

    return template;
  }

  async sendResetPasswordOtp(email, otp) {
    const html = this.loadTemplate("reset-password-otp", { OTP: otp });

    const mailOptions = {
      from: this.from,
      to: email,
      subject: "🔐 Password Reset OTP - Game Board System",
      html,
    };

    await transporter.sendMail(mailOptions);
  }
}

module.exports = new EmailService();
