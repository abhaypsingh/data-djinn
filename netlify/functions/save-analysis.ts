import { Handler } from '@netlify/functions';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const data = JSON.parse(event.body || '{}');
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

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        data: result[0],
      }),
    };
  } catch (error) {
    console.error('Error saving analysis:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to save analysis',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
    };
  }
};