import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null;

export async function POST(request: NextRequest) {
  if (!sql) {
    return NextResponse.json({
      success: true,
      message: 'Dataset tracking skipped (no database)'
    });
  }

  try {
    const data = await request.json();
    const { 
      analysisId,
      name,
      type,
      format,
      rowCount,
      columnCount,
      fileSize,
      preview
    } = data;

    const result = await sql`
      INSERT INTO datasets (
        analysis_id,
        name,
        type,
        format,
        row_count,
        column_count,
        file_size,
        preview,
        created_at
      ) VALUES (
        ${analysisId},
        ${name},
        ${type},
        ${format || null},
        ${rowCount || null},
        ${columnCount || null},
        ${fileSize || null},
        ${preview || null},
        NOW()
      )
      RETURNING id
    `;

    return NextResponse.json({
      success: true,
      data: result[0],
    });
  } catch (error) {
    console.error('Error saving dataset:', error);
    return NextResponse.json(
      { 
        error: 'Failed to save dataset',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  if (!sql) {
    return NextResponse.json({
      success: true,
      data: [],
      message: 'No database configured'
    });
  }

  try {
    const { searchParams } = new URL(request.url);
    const analysisId = searchParams.get('analysisId');
    
    if (!analysisId) {
      return NextResponse.json(
        { error: 'Analysis ID is required' },
        { status: 400 }
      );
    }

    const datasets = await sql`
      SELECT 
        id,
        name,
        type,
        format,
        row_count,
        column_count,
        file_size,
        preview,
        created_at
      FROM datasets
      WHERE analysis_id = ${analysisId}
      ORDER BY created_at ASC
    `;

    return NextResponse.json({
      success: true,
      data: datasets,
    });
  } catch (error) {
    console.error('Error fetching datasets:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch datasets',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}