export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function GET(request: NextRequest) {
  try {
    if (!process.env.R2_BUCKET_NAME) {
      return NextResponse.json(
        { error: 'Missing R2_BUCKET_NAME environment variable' },
        { status: 500 }
      );
    }

    const { searchParams } = request.nextUrl;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '9');
    const startIndex = (page - 1) * limit;

    const command = new ListObjectsV2Command({
      Bucket: process.env.R2_BUCKET_NAME,
    });

    const response = await s3Client.send(command);
    
    const allFiles = response.Contents?.map(file => ({
      key: file.Key,
      lastModified: file.LastModified,
      size: file.Size,
      url: `https://h5.sunodownload.net/${file.Key}`,
    })) || [];

    const paginatedFiles = allFiles.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      files: paginatedFiles,
      total: allFiles.length,
      page,
      limit,
    });
  } catch (error) {
    console.error('Error listing files:', error);
    return NextResponse.json(
      { error: 'Failed to list files' },
      { status: 500 }
    );
  }
} 