import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null;

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!sql) {
    return NextResponse.json({
      success: true,
      message: 'Update skipped (no database configured)'
    });
  }

  try {
    const { id } = await params;
    const analysisId = parseInt(id);
    const data = await request.json();
    const { solution, metadata } = data;

    const result = await sql`
      UPDATE analyses
      SET 
        solution = ${solution},
        metadata = ${JSON.stringify(metadata)},
        updated_at = NOW()
      WHERE id = ${analysisId}
      RETURNING id
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Analysis not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result[0],
    });
  } catch (error) {
    console.error('Error updating analysis:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update analysis',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!sql) {
    return NextResponse.json({
      success: false,
      message: 'Database not configured'
    });
  }

  try {
    const { id } = await params;
    const analysisId = parseInt(id);

    const result = await sql`
      SELECT 
        id,
        vertical_id,
        primary_dataset_name,
        analysis_result,
        recommendations,
        solution,
        metadata,
        created_at,
        updated_at
      FROM analyses
      WHERE id = ${analysisId}
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Analysis not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result[0],
    });
  } catch (error) {
    console.error('Error fetching analysis:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch analysis',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}