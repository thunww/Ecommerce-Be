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

const sendResetPasswordEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS,
    },
  });

  const resetUrl = `http://localhost:8080/api/v1/auth/reset-password?token=${token}`;

  // Set up the email options
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Reset Your Password",
    html: `
      <p>You have requested to reset your password.</p>
      <p>Please click the link below to reset your password (this link is valid for 1 hour):</p>
      <a href="${resetUrl}">${resetUrl}</a>
    `,
  };

  // Send the email
  try {
    await transporter.sendMail(mailOptions);
    //console.log(`Reset password email sent to: ${email}`);
  } catch (error) {
    console.error("Error sending reset password email:", error);
    throw new Error("Failed to send reset password email");
  }

};
  

module.exports = { sendVerificationEmail,sendResetPasswordEmail };
