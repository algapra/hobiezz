import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL)

const migrationSQL = `
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User interests table
CREATE TABLE IF NOT EXISTS user_interests (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  interest_type VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, interest_type)
);

-- User notes table
CREATE TABLE IF NOT EXISTS user_notes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Films table
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

-- Film Series table
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

-- Anime table
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

-- Komik table
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

-- Novel table
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

-- Finance table
CREATE TABLE IF NOT EXISTS finance (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  saldo DECIMAL(15, 2) DEFAULT 0,
  pengeluaran_bulan_ini DECIMAL(15, 2) DEFAULT 0,
  aset_dimiliki DECIMAL(15, 2) DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_interests_user_id ON user_interests(user_id);
CREATE INDEX IF NOT EXISTS idx_films_user_id ON films(user_id);
CREATE INDEX IF NOT EXISTS idx_film_series_user_id ON film_series(user_id);
CREATE INDEX IF NOT EXISTS idx_anime_user_id ON anime(user_id);
CREATE INDEX IF NOT EXISTS idx_komik_user_id ON komik(user_id);
CREATE INDEX IF NOT EXISTS idx_novel_user_id ON novel(user_id);
CREATE INDEX IF NOT EXISTS idx_finance_user_id ON finance(user_id);
`

async function runMigration() {
  try {
    console.log("[v0] Starting database migration...")

    // Split SQL statements and execute one by one
    const statements = migrationSQL
      .split(";")
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt.length > 0)

    for (const statement of statements) {
      console.log(`[v0] Executing: ${statement.substring(0, 50)}...`)
      await sql`${statement}`
    }

    console.log("[v0] ✓ Migration completed successfully!")
  } catch (error) {
    console.error("[v0] Migration failed:", error.message)
    process.exit(1)
  }
}

runMigration()
