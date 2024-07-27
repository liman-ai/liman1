import nodemailer from 'nodemailer';
import type { NextAuthOptions } from 'next-auth';
import EmailProvider from 'next-auth/providers/email';

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

// NextAuth.js yapılandırması
export const authOptions: NextAuthOptions = {
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: '/login',
    newUser: '/signup',
  },
  callbacks: {
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnLoginPage = nextUrl.pathname.startsWith('/login');
      const isOnSignupPage = nextUrl.pathname.startsWith('/signup');

      if (isLoggedIn) {
        if (isOnLoginPage || isOnSignupPage) {
          return Response.redirect(new URL('/', nextUrl));
        }
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token = { ...token, id: user.id };
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        const { id } = token as { id: string };
        const { user } = session;

        session = { ...session, user: { ...user, id } };
      }

      return session;
    }
  },
  providers: [
    EmailProvider({
      server: {
        host: "smtp.gmail.com", // SMTP sunucusu
        port: 587, // Port numarası
        auth: {
          user: process.env.EMAIL_USER, // .env dosyasındaki EMAIL_USER
          pass: process.env.EMAIL_PASS, // .env dosyasındaki EMAIL_PASS
        },
      },
      from: process.env.EMAIL_FROM, // Gönderen e-posta adresi
      sendVerificationRequest, // E-posta doğrulama isteği gönderme fonksiyonu
    }),
  ]
};
