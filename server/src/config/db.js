const { Pool } = require('pg');
require('dotenv').config();

const isLocalhost =
  process.env.DB_HOST === 'localhost' || process.env.DB_HOST === '127.0.0.1';

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
  ssl: isLocalhost ? false : { rejectUnauthorized: false },
});

pool.on('connect', () => {
  console.log('Connected to PostgreSQL Database');
});

module.exports = pool;