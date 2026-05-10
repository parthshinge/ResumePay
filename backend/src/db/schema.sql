-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address VARCHAR(42) UNIQUE NOT NULL,
  email VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  wallet_address VARCHAR(42) NOT NULL,
  tx_hash VARCHAR(66) UNIQUE NOT NULL,
  amount DECIMAL(18, 6) NOT NULL,
  token VARCHAR(10) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  chain_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  verified_at TIMESTAMP
);

-- Resume uploads table
CREATE TABLE IF NOT EXISTS resume_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  wallet_address VARCHAR(42) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Resume reviews table
CREATE TABLE IF NOT EXISTS resume_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id UUID REFERENCES resume_uploads(id),
  user_id UUID REFERENCES users(id),
  wallet_address VARCHAR(42) NOT NULL,
  ats_score INTEGER NOT NULL,
  keyword_score INTEGER NOT NULL,
  grammar_score INTEGER NOT NULL,
  formatting_score INTEGER NOT NULL,
  role_fit_score INTEGER NOT NULL,
  overall_score INTEGER NOT NULL,
  strengths JSONB NOT NULL,
  weaknesses JSONB NOT NULL,
  suggestions JSONB NOT NULL,
  ats_optimization TEXT,
  recruiter_perspective TEXT,
  report_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_payments_wallet ON payments(wallet_address);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_tx_hash ON payments(tx_hash);
CREATE INDEX IF NOT EXISTS idx_resume_uploads_wallet ON resume_uploads(wallet_address);
CREATE INDEX IF NOT EXISTS idx_resume_reviews_wallet ON resume_reviews(wallet_address);
CREATE INDEX IF NOT EXISTS idx_resume_reviews_resume_id ON resume_reviews(resume_id);
