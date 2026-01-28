import { handlers } from '@/app/lib/auth';

export const runtime = 'nodejs'; // 🔥 REQUIRED FOR POSTGRES
export const { GET, POST } = handlers;
