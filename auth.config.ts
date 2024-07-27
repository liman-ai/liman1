import type { NextAuthOptions } from 'next-auth';
import EmailProvider from 'next-auth/providers/email';

// E-posta doğrulama isteği gönderme fonksiyonu
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
  })

  if (!response.ok) {
    console.error('Error sending email:', await response.text())
  }
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
