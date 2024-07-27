import NextAuth from 'next-auth';
import { authConfig } from '../../../auth.config'; // auth.config.ts dosyasının doğru yolunu belirttiğinizden emin olun

export default NextAuth(authConfig);
