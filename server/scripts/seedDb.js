import 'dotenv/config';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import pg from 'pg';

const __dirname = dirname(fileURLToPath(import.meta.url));
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function seed() {
  try {
    const schema = readFileSync(join(__dirname, '../db/schema.sql'), 'utf-8');
    const seedData = readFileSync(join(__dirname, '../db/seed.sql'), 'utf-8');

    await pool.query(schema);
    console.log('Schema created successfully');

    await pool.query(seedData);
    console.log('Seed data inserted successfully');
  } catch (err) {
    console.error('Seeding failed:', err.message);
  } finally {
    await pool.end();
  }
}

seed();
