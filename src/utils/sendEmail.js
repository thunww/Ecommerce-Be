const nodemailer = require("nodemailer");
require("dotenv").config();
const sendVerificationEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const verificationUrl = `${process.env.SERVER_URL}/api/v1/auth/verify-email?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Email Verification",
    text: `Please verify your email by clicking on the following link: ${verificationUrl}`,
    html: ` <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; border: 1px solid #ddd; border-radius: 10px; max-width: 500px; margin: auto;">
                <h2 style="color: #4CAF50;">Chào mừng bạn đến với CLASSYSHOP!</h2>
                <p style="font-size: 16px; color: #555;">Cảm ơn bạn đã đăng ký tài khoản tại <strong>CLASSYSHOP</strong>. Để hoàn tất quá trình đăng ký, vui lòng xác nhận email của bạn bằng cách nhấn vào nút bên dưới:</p>
                <a href="${verificationUrl}" style="
                    display: inline-block;
                    background-color: #ff6600;
                    color: white;
                    padding: 12px 20px;
                    text-decoration: none;
                    font-size: 16px;
                    border-radius: 5px;
                    font-weight: bold;
                    margin-top: 10px;
                ">Xác Nhận Email</a>
                <p style="margin-top: 20px; font-size: 14px; color: #666;">
                    Nếu bạn không tạo tài khoản trên CLASSYSHOP, vui lòng bỏ qua email này.
                </p>
                <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
                <p style="font-size: 14px; color: #888;"> CLASSYSHOP - Mua sắm thông minh, giao hàng tận nơi.</p>
            </div>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent to: ", email);
  } catch (error) {
    console.error("Error sending verification email: ", error);
    throw new Error("Failed to send verification email");
  }
};

const sendResetPasswordEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

  // Thiết lập nội dung email với HTML và CSS
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Reset Your Password",
    html: `
      <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; border: 1px solid #ddd; border-radius: 10px; max-width: 500px; margin: auto;">
        <h2 style="color: #4CAF50;">Chào mừng bạn đến với CLASSYSHOP!</h2>
        <p style="font-size: 16px; color: #555;">Bạn đã yêu cầu thay đổi mật khẩu. Để tiếp tục, vui lòng nhấn vào nút bên dưới:</p>
        <a href="${resetUrl}" style="
            display: inline-block;
            background-color: #ff6600;
            color: white;
            padding: 12px 20px;
            text-decoration: none;
            font-size: 16px;
            border-radius: 5px;
            font-weight: bold;
            margin-top: 10px;
        ">Reset Your Password</a>
        <p style="margin-top: 20px; font-size: 14px; color: #666;">
          Link này sẽ có hiệu lực trong 1 giờ. Nếu bạn không yêu cầu thay đổi mật khẩu, vui lòng bỏ qua email này.
        </p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
        <p style="font-size: 14px; color: #888;"> CLASSYSHOP - Mua sắm thông minh, giao hàng tận nơi.</p>
      </div>
    `,
  };

  // Gửi email
  try {
    await transporter.sendMail(mailOptions);
    console.log("Password reset email sent to: ", email);
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw new Error("Failed to send reset password email");
  }
};

module.exports = { sendVerificationEmail, sendResetPasswordEmail };
