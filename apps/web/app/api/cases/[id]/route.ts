import { NextRequest, NextResponse } from 'next/server';
import { caseApi } from '@workspace/lib/db-api';
import { verifyAuth } from '@/lib/auth-utils';

// GET /api/cases/[id] - Get case by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const caseRecord = await caseApi.findById(id);

    if (!caseRecord) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 });
    }

    return NextResponse.json(caseRecord);
  } catch (error) {
    console.error('Error fetching case:', error);
    return NextResponse.json(
      { error: 'Failed to fetch case' },
      { status: 500 }
    );
  }
}

// PATCH /api/cases/[id] - Update case
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    // Handle status update
    if (body.status) {
      const updatedCase = await caseApi.updateStatus(id, body.status, user.id);
      return NextResponse.json(updatedCase);
    }

    // Handle other updates
    const { title, description, priority, type, summary, findings, legalStatus, courtDate, verdict } = body;

    const updatedCase = await caseApi.update(id, {
      ...(title && { title }),
      ...(description && { description }),
      ...(priority && { priority }),
      ...(type && { type }),
      ...(summary && { summary }),
      ...(findings && { findings }),
      ...(legalStatus && { legalStatus }),
      ...(courtDate && { courtDate: new Date(courtDate) }),
      ...(verdict && { verdict })
    }, user.id);

    return NextResponse.json(updatedCase);
  } catch (error) {
    console.error('Error updating case:', error);
    return NextResponse.json(
      { error: 'Failed to update case' },
      { status: 500 }
    );
  }
}

// DELETE /api/cases/[id] - Delete case
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admins can delete cases
    if (user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    await caseApi.delete(id, user.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting case:', error);
    return NextResponse.json(
      { error: 'Failed to delete case' },
      { status: 500 }
    );
  }
}
