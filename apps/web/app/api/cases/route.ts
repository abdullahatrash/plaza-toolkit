import { NextRequest, NextResponse } from 'next/server';
import { caseApi } from '@workspace/lib/db-api';
import { verifyAuth } from '@/lib/auth-utils';
import { CaseStatus, Priority } from '@workspace/database';

// GET /api/cases - List all cases with filters
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || undefined;
    const priority = searchParams.get('priority') || undefined;
    const ownerId = searchParams.get('ownerId') || undefined;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const result = await caseApi.list(
      { status, priority, ownerId },
      { page, limit }
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching cases:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cases' },
      { status: 500 }
    );
  }
}

// POST /api/cases - Create a new case
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only certain roles can create cases
    if (!['OFFICER', 'ANALYST', 'PROSECUTOR', 'ADMIN'].includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { title, description, priority, type, reportIds } = body;

    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      );
    }

    // Generate case number
    const caseNumber = `CASE-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    const caseData: any = {
      caseNumber,
      title,
      description,
      status: CaseStatus.OPEN,
      priority: priority || Priority.MEDIUM,
      type: type || 'INVESTIGATION',
      owner: {
        connect: { id: user.id }
      }
    };

    // Connect reports if provided
    if (reportIds && Array.isArray(reportIds) && reportIds.length > 0) {
      caseData.reports = {
        connect: reportIds.map((id: string) => ({ id }))
      };
    }

    const newCase = await caseApi.create(caseData);

    return NextResponse.json(newCase, { status: 201 });
  } catch (error) {
    console.error('Error creating case:', error);
    return NextResponse.json(
      { error: 'Failed to create case' },
      { status: 500 }
    );
  }
}
