import nodemailer from 'nodemailer';

// Nodemailer transport yapılandırması
const transporter = nodemailer.createTransport({
  service: 'gmail', // veya 'yahoo', 'outlook' vb.
  auth: {
    user: process.env.EMAIL_USER, // E-posta adresiniz
    pass: process.env.EMAIL_PASS, // E-posta şifreniz veya uygulama şifresi
  },
});

// E-posta doğrulama isteği gönderme fonksiyonu
export const sendVerificationRequest = ({
  identifier: email,
  url,
  provider: { server, from },
}: {
  identifier: string;
  url: string;
  provider: { server: string; from: string };
}) => {
  const { host } = new URL(url);
  const message = {
    to: email,
    from,
    subject: `Sign in to ${host}`,
    text: `Sign in to ${host}\n\n${url}\n\n`,
    html: `<p>Sign in to <strong>${host}</strong></p><p><a href="${url}">Sign in</a></p>`,
  };
  transporter.sendMail(message, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};
