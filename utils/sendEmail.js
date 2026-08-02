// Force reload of .env in case it's required before main config
require('dotenv').config();
const nodemailer = require('nodemailer');

console.log('📧 DEBUG: RAW env values:', {
  email: process.env.ADMIN_EMAIL,
  pass: process.env.ADMIN_EMAIL_PASSWORD,
});

const email = process.env.ADMIN_EMAIL?.trim() || null;
const password = process.env.ADMIN_EMAIL_PASSWORD?.trim() || null;

console.log('📧 DEBUG: After trim:', { email, password });

let transporter = null;
if (email && password) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: email,
      pass: password,
    },
  });
  console.log('✅ Email transporter ready');
} else {
  console.warn('⚠️  ADMIN_EMAIL / ADMIN_EMAIL_PASSWORD missing. Emails disabled.');
}

const sendEmail = (subject, text) => {
  if (!transporter) {
    console.log('ℹ️  Email not sent (no credentials):', subject);
    return;
  }
  transporter.sendMail({
    from: `"GameContest" <${email}>`,
    to: email,
    subject,
    text,
  }).catch(err => console.error('Email error:', err.message));
};

module.exports = sendEmail;