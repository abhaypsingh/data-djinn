const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL);

async function migrate() {
  try {
    console.log('Starting database migration...');

    // Create analyses table
    await sql`
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
      )
    `;
    console.log('✓ Created analyses table');

    // Create indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_analyses_vertical_id ON analyses(vertical_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_analyses_created_at ON analyses(created_at DESC)`;
    console.log('✓ Created indexes for analyses');

    // Create datasets table
    await sql`
      CREATE TABLE IF NOT EXISTS datasets (
        id SERIAL PRIMARY KEY,
        analysis_id INTEGER REFERENCES analyses(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL,
        format VARCHAR(50),
        row_count INTEGER,
        column_count INTEGER,
        file_size BIGINT,
        preview TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
    console.log('✓ Created datasets table');

    // Create index for datasets
    await sql`CREATE INDEX IF NOT EXISTS idx_datasets_analysis_id ON datasets(analysis_id)`;
    console.log('✓ Created indexes for datasets');

    // Create sessions table
    await sql`
      CREATE TABLE IF NOT EXISTS sessions (
        id SERIAL PRIMARY KEY,
        session_id VARCHAR(255) UNIQUE NOT NULL,
        vertical_id VARCHAR(50),
        step VARCHAR(50),
        metadata JSONB,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;
    console.log('✓ Created sessions table');

    // Create indexes for sessions
    await sql`CREATE INDEX IF NOT EXISTS idx_sessions_session_id ON sessions(session_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_sessions_created_at ON sessions(created_at DESC)`;
    console.log('✓ Created indexes for sessions');

    console.log('\n✅ Database migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();