import { NextRequest, NextResponse } from 'next/server';
import { evidenceApi } from '@workspace/lib/db-api';
import { verifyAuth } from '@/lib/auth-utils';

// GET /api/evidence/[id] - Get evidence by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const evidence = await evidenceApi.findById(params.id);

    if (!evidence) {
      return NextResponse.json({ error: 'Evidence not found' }, { status: 404 });
    }

    return NextResponse.json(evidence);
  } catch (error) {
    console.error('Error fetching evidence:', error);
    return NextResponse.json(
      { error: 'Failed to fetch evidence' },
      { status: 500 }
    );
  }
}

// PATCH /api/evidence/[id] - Update evidence
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, type, location, latitude, longitude, metadata, tags } = body;

    const updatedEvidence = await evidenceApi.update(params.id, {
      ...(title && { title }),
      ...(description && { description }),
      ...(type && { type }),
      ...(location && { location }),
      ...(latitude !== undefined && { latitude }),
      ...(longitude !== undefined && { longitude }),
      ...(metadata && { metadata }),
      ...(tags && { tags })
    });

    return NextResponse.json(updatedEvidence);
  } catch (error) {
    console.error('Error updating evidence:', error);
    return NextResponse.json(
      { error: 'Failed to update evidence' },
      { status: 500 }
    );
  }
}

// DELETE /api/evidence/[id] - Delete evidence
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admins can delete evidence (chain of custody)
    if (user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await evidenceApi.delete(params.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting evidence:', error);
    return NextResponse.json(
      { error: 'Failed to delete evidence' },
      { status: 500 }
    );
  }
}
