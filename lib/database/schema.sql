-- Create the main analyses table
CREATE TABLE IF NOT EXISTS analyses (
  id SERIAL PRIMARY KEY,
  vertical_id VARCHAR(50) NOT NULL,
  primary_dataset_name VARCHAR(255) NOT NULL,
  analysis_result TEXT,
  recommendations JSONB,
  solution TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_analyses_vertical_id ON analyses(vertical_id);
CREATE INDEX idx_analyses_created_at ON analyses(created_at DESC);

-- Create a table for tracking dataset uploads
CREATE TABLE IF NOT EXISTS datasets (
  id SERIAL PRIMARY KEY,
  analysis_id INTEGER REFERENCES analyses(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'primary' or 'additional'
  format VARCHAR(50),
  row_count INTEGER,
  column_count INTEGER,
  file_size BIGINT,
  preview TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create index for dataset queries
CREATE INDEX idx_datasets_analysis_id ON datasets(analysis_id);

-- Create a table for user sessions (optional, for tracking usage)
CREATE TABLE IF NOT EXISTS sessions (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR(255) UNIQUE NOT NULL,
  vertical_id VARCHAR(50),
  step VARCHAR(50),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index for session queries
CREATE INDEX idx_sessions_session_id ON sessions(session_id);
CREATE INDEX idx_sessions_created_at ON sessions(created_at DESC);