import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null;

export async function POST(request: NextRequest) {
  if (!sql) {
    // Return a mock session ID if database is not configured
    return NextResponse.json({
      success: true,
      data: {
        id: `mock-session-${Date.now()}`,
        session_id: `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      }
    });
  }

  try {
    const data = await request.json();
    const { verticalId, step, metadata } = data;
    
    const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const result = await sql`
      INSERT INTO sessions (
        session_id,
        vertical_id,
        step,
        metadata,
        created_at,
        updated_at
      ) VALUES (
        ${sessionId},
        ${verticalId || null},
        ${step || 'upload'},
        ${JSON.stringify(metadata || {})},
        NOW(),
        NOW()
      )
      RETURNING id, session_id
    `;

    return NextResponse.json({
      success: true,
      data: result[0],
    });
  } catch (error) {
    console.error('Error creating session:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create session',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  if (!sql) {
    return NextResponse.json({
      success: true,
      message: 'Session update skipped (no database)'
    });
  }

  try {
    const data = await request.json();
    const { sessionId, step, metadata } = data;
    
    await sql`
      UPDATE sessions 
      SET 
        step = ${step},
        metadata = ${JSON.stringify(metadata)},
        updated_at = NOW()
      WHERE session_id = ${sessionId}
    `;

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error('Error updating session:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update session',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}