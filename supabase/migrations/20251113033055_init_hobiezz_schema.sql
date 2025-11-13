/*
  # Initialize Hobiezz Database Schema

  1. New Tables
    - `users` - User accounts with email and password
    - `user_interests` - Tracks which media types each user wants to track
    - `user_notes` - Personal notes for each user
    - `films` - Film tracking with metadata
    - `film_series` - TV series tracking with episode count
    - `anime` - Anime tracking with episode count
    - `komik` - Comic/manga tracking
    - `novel` - Novel tracking
    - `finance` - Financial data tracking

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Users can only access their own records

  3. Indexes
    - Add indexes on user_id foreign keys for performance
*/

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

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE films ENABLE ROW LEVEL SECURITY;
ALTER TABLE film_series ENABLE ROW LEVEL SECURITY;
ALTER TABLE anime ENABLE ROW LEVEL SECURITY;
ALTER TABLE komik ENABLE ROW LEVEL SECURITY;
ALTER TABLE novel ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id::text)
  WITH CHECK (auth.uid()::text = id::text);

-- RLS Policies for user_interests
CREATE POLICY "Users can view own interests"
  ON user_interests FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own interests"
  ON user_interests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own interests"
  ON user_interests FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = user_id::text)
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own interests"
  ON user_interests FOR DELETE
  TO authenticated
  USING (auth.uid()::text = user_id::text);

-- RLS Policies for user_notes
CREATE POLICY "Users can view own notes"
  ON user_notes FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own notes"
  ON user_notes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own notes"
  ON user_notes FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = user_id::text)
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own notes"
  ON user_notes FOR DELETE
  TO authenticated
  USING (auth.uid()::text = user_id::text);

-- RLS Policies for films
CREATE POLICY "Users can view own films"
  ON films FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own films"
  ON films FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own films"
  ON films FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = user_id::text)
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own films"
  ON films FOR DELETE
  TO authenticated
  USING (auth.uid()::text = user_id::text);

-- RLS Policies for film_series
CREATE POLICY "Users can view own series"
  ON film_series FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own series"
  ON film_series FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own series"
  ON film_series FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = user_id::text)
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own series"
  ON film_series FOR DELETE
  TO authenticated
  USING (auth.uid()::text = user_id::text);

-- RLS Policies for anime
CREATE POLICY "Users can view own anime"
  ON anime FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own anime"
  ON anime FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own anime"
  ON anime FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = user_id::text)
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own anime"
  ON anime FOR DELETE
  TO authenticated
  USING (auth.uid()::text = user_id::text);

-- RLS Policies for komik
CREATE POLICY "Users can view own komik"
  ON komik FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own komik"
  ON komik FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own komik"
  ON komik FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = user_id::text)
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own komik"
  ON komik FOR DELETE
  TO authenticated
  USING (auth.uid()::text = user_id::text);

-- RLS Policies for novel
CREATE POLICY "Users can view own novel"
  ON novel FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own novel"
  ON novel FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own novel"
  ON novel FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = user_id::text)
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own novel"
  ON novel FOR DELETE
  TO authenticated
  USING (auth.uid()::text = user_id::text);

-- RLS Policies for finance
CREATE POLICY "Users can view own finance"
  ON finance FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own finance"
  ON finance FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own finance"
  ON finance FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = user_id::text)
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own finance"
  ON finance FOR DELETE
  TO authenticated
  USING (auth.uid()::text = user_id::text);