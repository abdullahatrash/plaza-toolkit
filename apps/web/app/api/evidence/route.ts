import { NextRequest, NextResponse } from 'next/server';
import { evidenceApi } from '@workspace/lib/db-api';
import { verifyAuth } from '@/lib/auth-utils';
import { EvidenceType } from '@workspace/database';

// GET /api/evidence - List all evidence with filters
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || undefined;
    const caseId = searchParams.get('caseId') || undefined;
    const reportId = searchParams.get('reportId') || undefined;
    const collectedBy = searchParams.get('collectedBy') || undefined;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const result = await evidenceApi.list(
      { type, caseId, reportId, collectedBy },
      { page, limit }
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching evidence:', error);
    return NextResponse.json(
      { error: 'Failed to fetch evidence' },
      { status: 500 }
    );
  }
}

// POST /api/evidence - Create new evidence
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only certain roles can create evidence
    if (!['OFFICER', 'ANALYST', 'ADMIN'].includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const {
      type,
      title,
      description,
      fileUrl,
      fileType,
      fileSize,
      hash,
      collectedAt,
      location,
      latitude,
      longitude,
      reportId,
      caseId,
      metadata,
      tags
    } = body;

    if (!type || !title) {
      return NextResponse.json(
        { error: 'Type and title are required' },
        { status: 400 }
      );
    }

    const evidenceData: any = {
      type,
      title,
      description,
      fileUrl,
      fileType,
      fileSize,
      hash,
      collectedAt: collectedAt ? new Date(collectedAt) : new Date(),
      location,
      latitude,
      longitude,
      metadata,
      tags,
      collector: {
        connect: { id: user.id }
      }
    };

    // Connect to report if provided
    if (reportId) {
      evidenceData.report = { connect: { id: reportId } };
    }

    // Connect to case if provided
    if (caseId) {
      evidenceData.case = { connect: { id: caseId } };
    }

    const newEvidence = await evidenceApi.create(evidenceData);

    return NextResponse.json(newEvidence, { status: 201 });
  } catch (error) {
    console.error('Error creating evidence:', error);
    return NextResponse.json(
      { error: 'Failed to create evidence' },
      { status: 500 }
    );
  }
}
