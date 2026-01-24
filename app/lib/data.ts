import postgres from 'postgres';
// import { User } from './definitions';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
