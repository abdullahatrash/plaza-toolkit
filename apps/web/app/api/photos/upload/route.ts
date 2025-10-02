import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/with-auth';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { prisma } from '@workspace/database';
import type { ApiResponse } from '@workspace/types/api';

export async function POST(request: NextRequest) {
  const authResult = await withAuth(request);

  if ('error' in authResult) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: authResult.error },
      { status: authResult.status }
    );
  }

  const { user } = authResult;

  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const reportId = formData.get('reportId') as string;

    if (!files || files.length === 0) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'No files provided' },
        { status: 400 }
      );
    }

    if (!reportId) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Report ID required' },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'photos');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    const uploadedFiles = [];

    for (const file of files) {
      // Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 8);
      const extension = file.name.split('.').pop();
      const filename = `${timestamp}-${randomString}.${extension}`;
      const filepath = join(uploadsDir, filename);

      // Convert file to buffer and save
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filepath, buffer);

      // Save to database
      const photo = await prisma.photo.create({
        data: {
          reportId,
          fileUrl: `/uploads/photos/${filename}`,
          fileName: file.name,
          fileSize: file.size,
          mimeType: file.type,
          uploadedBy: user.id
        }
      });

      uploadedFiles.push({
        id: photo.id,
        filename,
        originalName: file.name,
        url: `/uploads/photos/${filename}`,
        size: file.size,
        type: file.type
      });
    }

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: { files: uploadedFiles }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Photo upload error:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Failed to upload photos' },
      { status: 500 }
    );
  }
}
