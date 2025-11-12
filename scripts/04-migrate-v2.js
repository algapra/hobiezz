import "dotenv/config";
import pkg from "pg";
const { Client } = pkg;

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

const migrationSQL = `
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_interests (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  interest_type VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, interest_type)
);

CREATE TABLE IF NOT EXISTS user_notes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS films (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  judul VARCHAR(255) NOT NULL,
  tahun INTEGER,
  sinopsis TEXT,
  genre VARCHAR(255),
  rating DECIMAL(3, 1),
  photo_url VARCHAR(255),
  status VARCHAR(50) DEFAULT 'watching',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS film_series (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  judul VARCHAR(255) NOT NULL,
  tahun INTEGER,
  sinopsis TEXT,
  genre VARCHAR(255),
  berapa_episode INTEGER,
  rating DECIMAL(3, 1),
  photo_url VARCHAR(255),
  status VARCHAR(50) DEFAULT 'watching',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS anime (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  judul VARCHAR(255) NOT NULL,
  tahun INTEGER,
  sinopsis TEXT,
  genre VARCHAR(255),
  berapa_episode INTEGER,
  rating DECIMAL(3, 1),
  photo_url VARCHAR(255),
  status VARCHAR(50) DEFAULT 'watching',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS komik (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  judul VARCHAR(255) NOT NULL,
  penulis VARCHAR(255),
  sinopsis TEXT,
  genre VARCHAR(255),
  rating DECIMAL(3, 1),
  photo_url VARCHAR(255),
  status VARCHAR(50) DEFAULT 'reading',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS novel (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  judul VARCHAR(255) NOT NULL,
  penulis VARCHAR(255),
  sinopsis TEXT,
  genre VARCHAR(255),
  rating DECIMAL(3, 1),
  photo_url VARCHAR(255),
  status VARCHAR(50) DEFAULT 'reading',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS finance (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  saldo DECIMAL(15, 2) DEFAULT 0,
  pengeluaran_bulan_ini DECIMAL(15, 2) DEFAULT 0,
  aset_dimiliki DECIMAL(15, 2) DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_user_interests_user_id ON user_interests(user_id);
CREATE INDEX IF NOT EXISTS idx_films_user_id ON films(user_id);
CREATE INDEX IF NOT EXISTS idx_film_series_user_id ON film_series(user_id);
CREATE INDEX IF NOT EXISTS idx_anime_user_id ON anime(user_id);
CREATE INDEX IF NOT EXISTS idx_komik_user_id ON komik(user_id);
CREATE INDEX IF NOT EXISTS idx_novel_user_id ON novel(user_id);
CREATE INDEX IF NOT EXISTS idx_finance_user_id ON finance(user_id);
`;

async function runMigration() {
  try {
    console.log("[v0] Connecting to database...");
    await client.connect();
    console.log("[v0] Connected successfully!");

    console.log("[v0] Running migration...");
    await client.query(migrationSQL);
    console.log("[v0] ✓ Migration completed successfully!");
  } catch (error) {
    console.error("[v0] Migration failed:", error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigration();
