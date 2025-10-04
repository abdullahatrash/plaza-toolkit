import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/with-auth';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { createHash } from 'crypto';
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
    const file = formData.get('file') as File;
    const type = formData.get('type') as string || 'general'; // 'evidence', 'photos', 'documents', etc.

    if (!file) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Create uploads directory based on type
    const uploadsDir = join(process.cwd(), 'public', 'uploads', type);
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

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

    // Calculate file hash for integrity verification
    const hash = createHash('sha256').update(buffer).digest('hex');

    const fileUrl = `/uploads/${type}/${filename}`;

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: {
          url: fileUrl,
          filename,
          originalName: file.name,
          size: file.size,
          type: file.type,
          hash
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
