import { NextRequest, NextResponse } from 'next/server';
import { notificationApi } from '@workspace/lib/db-api';
import { verifyAuth } from '@/lib/auth-utils';

// GET /api/notifications - Get user's notifications
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const unreadOnly = searchParams.get('unreadOnly') === 'true';

    const notifications = await notificationApi.list(user.id, unreadOnly);
    const unreadCount = await notificationApi.getUnreadCount(user.id);

    return NextResponse.json({
      notifications,
      unreadCount
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}
