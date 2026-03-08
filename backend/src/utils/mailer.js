const nodemailer = require("nodemailer");

let transporter;

function getTransporter() {
  if (transporter) return transporter;

  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    throw new Error("GMAIL_USER or GMAIL_APP_PASSWORD is missing");
  }

  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });

  return transporter;
}

async function sendEmail({ to, subject, text, html }) {
  const from = process.env.MAIL_FROM || process.env.EMAIL_FROM || process.env.GMAIL_USER;

  if (!from) {
    throw new Error("MAIL_FROM, EMAIL_FROM, or GMAIL_USER is missing");
  }

  const tx = getTransporter();
  return tx.sendMail({ from, to, subject, text, html });
}

module.exports = { sendEmail };
