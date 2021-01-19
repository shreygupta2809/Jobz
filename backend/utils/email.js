const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  port: 465,
  host: "smtp.gmail.com",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
  secure: true,
});

module.exports = sendMail = async (to, subject, text) =>
  transport.sendMail({
    from: '"Jobz" <jobzdass@gmail.com>',
    to,
    subject,
    text,
    html: `<p>${text}. Congratulations on Acceptance!</p>`,
  });
