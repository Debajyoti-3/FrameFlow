import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false, 
  auth: {
    user: process.env.BREVO_SMTP_USER,  // login in Brevo SMTP
    pass: process.env.BREVO_SMTP_PASS,   // SMTP key
  },
});
