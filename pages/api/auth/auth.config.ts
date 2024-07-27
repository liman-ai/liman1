
import type { NextAuthOptions } from 'next-auth';
import EmailProvider from 'next-auth/providers/email';

export const sendVerificationRequest = async ({
  identifier: email,
  url,
  provider: { server, from },
}: {
  identifier: string;
  url: string;
  provider: { server: string; from: string };
}) => {
  const response = await fetch(`${process.env.NEXTAUTH_URL}/api/send-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, url, from }),
  });

  if (!response.ok) {
    console.error('Error sending email:', await response.text());
  }
};

// NextAuth.js yapılandırması
export const authOptions: NextAuthOptions = {
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: '/login',
    newUser: '/signup',
  },
  providers: [
    EmailProvider({
      server: {
        host: "smtp.gmail.com",
        port: 587,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      },
      from: process.env.EMAIL_FROM,
      sendVerificationRequest,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
      }
      return session;
    },
  },
};
