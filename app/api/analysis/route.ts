import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { 
      verticalId, 
      primaryDatasetName, 
      analysisResult, 
      recommendations,
      solution,
      metadata 
    } = data;

    const result = await sql`
      INSERT INTO analyses (
        vertical_id,
        primary_dataset_name,
        analysis_result,
        recommendations,
        solution,
        metadata,
        created_at
      ) VALUES (
        ${verticalId},
        ${primaryDatasetName},
        ${analysisResult},
        ${JSON.stringify(recommendations)},
        ${solution},
        ${JSON.stringify(metadata)},
        NOW()
      )
      RETURNING id, created_at
    `;

    return NextResponse.json({
      success: true,
      data: result[0],
    });
  } catch (error) {
    console.error('Error saving analysis:', error);
    return NextResponse.json(
      { 
        error: 'Failed to save analysis',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    const analyses = await sql`
      SELECT 
        id,
        vertical_id,
        primary_dataset_name,
        analysis_result,
        recommendations,
        solution,
        metadata,
        created_at
      FROM analyses
      ORDER BY created_at DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `;

    const total = await sql`
      SELECT COUNT(*) as count FROM analyses
    `;

    return NextResponse.json({
      success: true,
      data: analyses,
      total: total[0].count,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Error fetching analyses:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch analyses',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}