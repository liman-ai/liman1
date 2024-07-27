import NextAuth from 'next-auth';
import { authOptions } from 'nextjs/pages/auth/auth.config'; // auth.config.ts dosyasının doğru yolunu belirttiğinizden emin olun

export default NextAuth(authOptions);
