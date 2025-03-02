const nodemailer = require("nodemailer");

const sendVerificationEmail = async (email, token) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS,
      },
    });
  
    const verificationUrl = `http://localhost:8080/api/v1/auth/verify-email?token=${token}`;
  
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Email Verification",
      text: `Please verify your email by clicking on the following link: ${verificationUrl}`,
      html: `<p>Please verify your email by clicking on the following link: <a href="${verificationUrl}">Verify Email</a></p>`,
    };
  
    try {
      await transporter.sendMail(mailOptions);
      console.log("Verification email sent to: ", email);
    } catch (error) {
      console.error("Error sending verification email: ", error);
      throw new Error("Failed to send verification email");
    }
  };
  

module.exports = { sendVerificationEmail };
