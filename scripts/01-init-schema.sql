-- Create tables for the media tracking and finance app

-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User interests table
CREATE TABLE user_interests (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  interest_type VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, interest_type)
);

-- User notes table
CREATE TABLE user_notes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Films table
CREATE TABLE films (
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
CREATE TABLE film_series (
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
CREATE TABLE anime (
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
CREATE TABLE komik (
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
CREATE TABLE novel (
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
CREATE TABLE finance (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  saldo DECIMAL(15, 2) DEFAULT 0,
  pengeluaran_bulan_ini DECIMAL(15, 2) DEFAULT 0,
  aset_dimiliki DECIMAL(15, 2) DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_user_interests_user_id ON user_interests(user_id);
CREATE INDEX idx_films_user_id ON films(user_id);
CREATE INDEX idx_film_series_user_id ON film_series(user_id);
CREATE INDEX idx_anime_user_id ON anime(user_id);
CREATE INDEX idx_komik_user_id ON komik(user_id);
CREATE INDEX idx_novel_user_id ON novel(user_id);
CREATE INDEX idx_finance_user_id ON finance(user_id);
