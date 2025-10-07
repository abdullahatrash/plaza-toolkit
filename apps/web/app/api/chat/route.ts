import { NextRequest, NextResponse } from 'next/server';
import { streamText, convertToModelMessages, createUIMessageStream, JsonToSseTransformStream } from 'ai';
import { nanoid } from 'nanoid';
import { withAuth } from '@/lib/with-auth';
import { chatApi } from '@workspace/lib/db-api';
import { UserRole } from '@workspace/database';
import type { ApiResponse } from '@workspace/types/api';
import { aiProvider } from '@/lib/ai/provider';
import { getSystemPrompt } from '@/lib/ai/prompts';
import { getReport } from '@/lib/ai/tools/get-report';
import { searchReports } from '@/lib/ai/tools/search-reports';
import { getCase } from '@/lib/ai/tools/get-case';
import { searchCases } from '@/lib/ai/tools/search-cases';
import { generateChatTitle } from '@/lib/ai/generate-title';

// GET /api/chat - Get user's chat history or specific chat messages
export async function GET(request: NextRequest) {
  const authResult = await withAuth(request);

  if ('error' in authResult) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: authResult.error },
      { status: authResult.status }
    );
  }

  const { user } = authResult;

  // Only ANALYST and ADMIN can use AI chat
  if (user.role !== UserRole.ANALYST && user.role !== UserRole.ADMIN) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Unauthorized. Only analysts and admins can access AI chat.' },
      { status: 403 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const chatId = searchParams.get('id');

    // If chatId is provided, return specific chat with messages
    if (chatId) {
      const chat = await chatApi.findById(chatId);

      if (!chat) {
        return NextResponse.json<ApiResponse>(
          { success: false, error: 'Chat not found' },
          { status: 404 }
        );
      }

      // Verify ownership
      if (chat.userId !== user.id) {
        return NextResponse.json<ApiResponse>(
          { success: false, error: 'Forbidden. You do not own this chat.' },
          { status: 403 }
        );
      }

      const messages = await chatApi.getMessages(chatId);

      return NextResponse.json<ApiResponse>({
        success: true,
        data: { chat, messages }
      });
    }

    // Otherwise, return all user chats
    const chats = await chatApi.getUserChats(user.id);

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { chats }
    });

  } catch (error) {
    console.error('Get chats error:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Failed to fetch chats' },
      { status: 500 }
    );
  }
}

// POST /api/chat - Create or continue chat conversation
export async function POST(request: NextRequest) {
  const authResult = await withAuth(request);

  if ('error' in authResult) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: authResult.error },
      { status: authResult.status }
    );
  }

  const { user } = authResult;

  // Only ANALYST and ADMIN can use AI chat
  if (user.role !== UserRole.ANALYST && user.role !== UserRole.ADMIN) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Unauthorized. Only analysts and admins can access AI chat.' },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    console.log('📥 Received body:', JSON.stringify(body, null, 2));

    const { id, messages, reportId, caseId } = body;

    // Validate required fields
    if (!id || !messages || messages.length === 0) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Missing required fields: id and messages' },
        { status: 400 }
      );
    }

    // Get the last user message
    const userMessage = messages[messages.length - 1];
    console.log('💬 User message:', userMessage);

    // Check if chat exists
    let chat = await chatApi.findById(id);

    // If chat doesn't exist, create it with auto-generated title
    if (!chat) {
      // Extract text from first message for title generation
      const firstMessageText = userMessage.parts
        .filter((part: any) => part.type === 'text')
        .map((part: any) => part.text)
        .join(' ');

      const title = generateChatTitle(firstMessageText);

      await chatApi.create({
        id,
        userId: user.id,
        title,
        reportId,
        caseId,
      });

      // Fetch with includes
      const fetchedChat = await chatApi.findById(id);
      if (!fetchedChat) {
        return NextResponse.json<ApiResponse>(
          { success: false, error: 'Failed to create chat' },
          { status: 500 }
        );
      }
      chat = fetchedChat;
    }

    // Verify ownership
    if (!chat || chat.userId !== user.id) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Forbidden. You do not own this chat.' },
        { status: 403 }
      );
    }

    // Get existing messages
    const previousMessages = await chatApi.getMessages(id);

    // Convert to UI messages format
    const allMessages = [
      ...previousMessages.map((msg) => ({
        id: msg.id,
        role: msg.role as 'user' | 'assistant' | 'system',
        parts: JSON.parse(msg.parts)
      })),
      userMessage
    ];

    // Save user message
    await chatApi.saveMessages([
      {
        id: userMessage.id,
        chatId: id,
        role: 'user',
        parts: JSON.stringify(userMessage.parts),
        attachments: JSON.stringify([]),
      }
    ]);

    // Create UI message stream
    const stream = createUIMessageStream({
      execute: async ({ writer: dataStream }) => {
        const result = streamText({
          model: aiProvider,
          system: getSystemPrompt(),
          messages: convertToModelMessages(allMessages),
          tools: {
            getReport: getReport({ dataStream }),
            searchReports: searchReports({ dataStream }),
            getCase: getCase({ dataStream }),
            searchCases: searchCases({ dataStream }),
          },
          onStepFinish: async (step) => {
            console.log('🔧 Step finished:', {
              toolCalls: step.toolCalls?.length || 0,
              toolResults: step.toolResults?.length || 0,
              fullStep: step,
            });

            if (step.toolCalls && step.toolCalls.length > 0) {
              console.log('🛠️ Tool calls:', JSON.stringify(step.toolCalls, null, 2));
            }

            if (step.toolResults && step.toolResults.length > 0) {
              console.log('📊 Tool results:', JSON.stringify(step.toolResults, null, 2));
            }
          },
        });

        // Merge the UI message stream
        dataStream.merge(result.toUIMessageStream());
      },
      generateId: nanoid,
      onFinish: async ({ messages }) => {
        console.log('✅ Chat finished, saving messages:', messages.length);

        // Log complete message structure
        messages.forEach((msg, idx) => {
          console.log(`📝 Message ${idx}:`, {
            id: msg.id,
            role: msg.role,
            partsCount: msg.parts?.length || 0,
            parts: msg.parts?.map((p: any) => ({
              type: p.type,
              toolName: p.type === 'tool-invocation' ? p.toolInvocation?.toolName : undefined,
              state: p.type === 'tool-invocation' ? p.toolInvocation?.state : undefined,
            })),
          });
        });

        // Save assistant messages
        await chatApi.saveMessages(
          messages
            .filter(msg => msg.role === 'assistant')
            .map((message) => ({
              id: message.id,
              chatId: id,
              role: 'assistant',
              parts: JSON.stringify(message.parts),
              attachments: JSON.stringify([]),
            }))
        );
      },
    });

    return new Response(stream.pipeThrough(new JsonToSseTransformStream()));

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}

// PATCH /api/chat - Update chat title
export async function PATCH(request: NextRequest) {
  const authResult = await withAuth(request);

  if ('error' in authResult) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: authResult.error },
      { status: authResult.status }
    );
  }

  const { user } = authResult;

  try {
    const body = await request.json();
    const { id, title } = body;

    if (!id || !title) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Missing required fields: id and title' },
        { status: 400 }
      );
    }

    // Verify ownership
    const chat = await chatApi.findById(id);
    if (!chat) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Chat not found' },
        { status: 404 }
      );
    }

    if (chat.userId !== user.id) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Forbidden. You do not own this chat.' },
        { status: 403 }
      );
    }

    const updatedChat = await chatApi.updateTitle(id, title);

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { chat: updatedChat }
    });

  } catch (error) {
    console.error('Update chat error:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Failed to update chat' },
      { status: 500 }
    );
  }
}

// DELETE /api/chat - Delete a chat
export async function DELETE(request: NextRequest) {
  const authResult = await withAuth(request);

  if ('error' in authResult) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: authResult.error },
      { status: authResult.status }
    );
  }

  const { user } = authResult;
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Missing chat id' },
      { status: 400 }
    );
  }

  try {
    const chat = await chatApi.findById(id);

    if (!chat) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Chat not found' },
        { status: 404 }
      );
    }

    if (chat.userId !== user.id) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Forbidden. You do not own this chat.' },
        { status: 403 }
      );
    }

    await chatApi.deleteById(id);

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { message: 'Chat deleted successfully' }
    });

  } catch (error) {
    console.error('Delete chat error:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Failed to delete chat' },
      { status: 500 }
    );
  }
}
