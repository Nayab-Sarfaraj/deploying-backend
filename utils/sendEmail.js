const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const User = require("../models/userSchema");
const jwt = require("jsonwebtoken");
const sendEmail = async ({ email, userId }) => {
  try {
    console.log("runnig");
    const token = jwt.sign({ id: userId }, process.env.SECRET_KEY);

    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "8e21ac06e6c02b",
        pass: "e81347c5ff890f",
      },
    });
    const mailOptions = {
      from: "nayabsarfaraj@gmail.com",
      to: email,
      subject: "Verify your email",
      html: `<p>Click <a href="${
        process.env.DOMAIN
      }/verifyemail?token=${token}">here</a> to ${"verify your email"}
            or copy and paste the link below in your browser. <br> ${
              process.env.DOMAIN
            }/verifyemail?token=${token}
            </p>`,
    };
    const mailResponse = await transport.sendMail(mailOptions);

    return mailResponse;
  } catch (error) {
    console.log("error while sending the email : " + error);
  }
};
module.exports = sendEmail;
