"use client";

import { DefaultChatTransport } from "ai";
import { useChat } from "@ai-sdk/react";
import type { UIMessage as AIMessage } from "ai";
import { Bot } from "lucide-react";
import { useCallback, useState } from "react";
import { ChatInput } from "./chat-input";
import { ChatSidebar } from "./chat-sidebar";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@workspace/ui/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageAvatar,
} from "@workspace/ui/components/ai-elements/message";
import {
  Tool,
  ToolHeader,
  ToolContent,
  ToolInput,
  ToolOutput,
} from "@workspace/ui/components/ai-elements/tool";
import { Loader } from "@workspace/ui/components/ai-elements/loader";
import { Response } from "@workspace/ui/components/ai-elements/response";
import { nanoid } from "nanoid";

// Extract MessagePart type from AI SDK Message type
export type MessagePart = NonNullable<AIMessage["parts"]>[number];

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  parts: MessagePart[];
  content?: string;
};

export function ChatInterface() {
  const [chatId, setChatId] = useState(() => nanoid());
  const [input, setInput] = useState<string>("");

  const { messages, setMessages, sendMessage, status } = useChat<ChatMessage>({
    id: chatId,
    transport: new DefaultChatTransport({
      api: "/api/chat",
      prepareSendMessagesRequest({ messages, id, body }) {
        return {
          body: {
            id,
            messages, // Send full messages array
            ...body,
          },
        };
      },
    }),
    onError: (error: any) => {
      console.error("❌ Chat error:", error);
    },
    onFinish: ({ message }) => {
      console.log("✅ Message finished:", {
        role: message.role,
        parts: message.parts,
        partsCount: message.parts?.length || 0,
        partDetails: message.parts?.map((p: any) => ({
          type: p.type,
          state:
            p.type === "tool-invocation" ? p.toolInvocation?.state : undefined,
          toolName:
            p.type === "tool-invocation"
              ? p.toolInvocation?.toolName
              : undefined,
        })),
      });
    },
  });

  // Show loading when streaming but the assistant message hasn't started rendering yet
  const lastMessage = messages[messages.length - 1];
  const isLoading =
    status === "streaming" && (!lastMessage || lastMessage.role === "user");

  // Handle message submission
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim() || isLoading) return;

      sendMessage({
        role: "user",
        content: input,
        parts: [{ type: "text", text: input }],
      });
      setInput("");
    },
    [input, isLoading, sendMessage]
  );

  // Handle new chat creation
  const handleNewChat = useCallback(() => {
    const newChatId = nanoid();
    setChatId(newChatId);
    setMessages([]);
    setInput("");
  }, [setMessages]);

  // Handle selecting existing chat
  const handleSelectChat = useCallback(
    async (selectedChatId: string) => {
      try {
        // Fetch chat messages
        const response = await fetch(`/api/chat?id=${selectedChatId}`);
        const data = await response.json();

        if (data.success && data.data.messages) {
          // Convert stored messages back to UI message format
          const loadedMessages = data.data.messages.map((msg: any) => ({
            id: msg.id,
            role: msg.role,
            content: msg.parts, // AI SDK expects content as parts array
            parts: JSON.parse(msg.parts),
          }));

          setChatId(selectedChatId);
          setMessages(loadedMessages);
          setInput("");
        }
      } catch (error) {
        console.error("Failed to load chat:", error);
      }
    },
    [setMessages, setInput]
  );

  // Handle chat deletion
  const handleDeleteChat = useCallback(
    (deletedChatId: string) => {
      // If the deleted chat is the current one, start a new chat
      if (deletedChatId === chatId) {
        handleNewChat();
      }
    },
    [chatId, handleNewChat]
  );

  return (
    <div className="flex h-[calc(100vh-12rem)] flex-col">
      {/* Header with Sidebar */}
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">AI Assistant</h2>
        </div>
        <ChatSidebar
          currentChatId={chatId}
          onNewChat={handleNewChat}
          onSelectChat={handleSelectChat}
          onDeleteChat={handleDeleteChat}
        />
      </div>

      {/* Messages Container using AI Elements */}
      <Conversation>
        <ConversationScrollButton />
        <ConversationContent>
          {messages.length === 0 ? (
            <ConversationEmptyState
              title="Start a Conversation"
              description="Ask questions about reports, cases, or environmental incidents. I can help you analyze data and find patterns."
              icon={<Bot className="h-12 w-12" />}
            />
          ) : (
            messages.map((message, messageIdx) => {
              // Debug: Log complete message structure
              console.log("🔍 Rendering message:", {
                messageId: message.id,
                role: message.role,
                partsCount: message.parts?.length || 0,
                parts: message.parts?.map((p: any) => ({
                  type: p.type,
                  state:
                    p.type.startsWith("tool-")
                      ? p.state
                      : undefined,
                  toolName:
                    p.type.startsWith("tool-")
                      ? p.toolName
                      : undefined,
                })),
              });

              return (
                <Message
                  key={`${message.id}-${messageIdx}`}
                  from={message.role}
                >
                  <MessageAvatar
                    name={message.role === "user" ? "You" : "AI"}
                  />
                  <MessageContent variant="flat">
                    {message.parts?.map((part, idx) => {
                      // Text parts - render with Response component for markdown support
                      if (part.type === "text") {
                        return <Response key={idx}>{part.text}</Response>;
                      }

                      // Tool invocation parts
                      if (part.type.startsWith("tool-")) {
                        const toolPart = part as any;

                        // Handle input-streaming state
                        if (toolPart.state === "input-streaming") {
                          console.log(
                            "🛠️ Rendering streaming tool call:",
                            toolPart.toolName
                          );
                          return (
                            <Tool key={idx} defaultOpen>
                              <ToolHeader
                                title={toolPart.toolName || "Tool"}
                                type="tool-call"
                                state="input-streaming"
                              />
                              <ToolContent>
                                <ToolInput input={toolPart.input} />
                              </ToolContent>
                            </Tool>
                          );
                        }

                        // Handle input-available state (complete call, waiting for result)
                        if (toolPart.state === "input-available") {
                          console.log(
                            "🛠️ Rendering complete tool call:",
                            toolPart.toolName
                          );
                          return (
                            <Tool key={idx} defaultOpen>
                              <ToolHeader
                                title={toolPart.toolName || "Tool"}
                                type="tool-call"
                                state="input-available"
                              />
                              <ToolContent>
                                <ToolInput input={toolPart.input} />
                              </ToolContent>
                            </Tool>
                          );
                        }

                        // Handle output-available state (tool execution complete)
                        if (toolPart.state === "output-available") {
                          const hasError = toolPart.errorText ||
                            (toolPart.output &&
                            typeof toolPart.output === "object" &&
                            "error" in toolPart.output);

                          console.log(
                            "📊 Rendering tool result:",
                            toolPart.toolName,
                            hasError ? "ERROR" : "SUCCESS"
                          );

                          return (
                            <Tool key={idx} defaultOpen>
                              <ToolHeader
                                title={toolPart.toolName || "Tool"}
                                type="tool-result"
                                state={
                                  hasError ? "output-error" : "output-available"
                                }
                              />
                              <ToolContent>
                                <ToolOutput
                                  output={toolPart.output}
                                  errorText={toolPart.errorText}
                                />
                              </ToolContent>
                            </Tool>
                          );
                        }
                      }

                      console.log("⚠️ Unknown part type:", part.type);
                      return null;
                    })}
                  </MessageContent>
                </Message>
              );
            })
          )}

          {/* Loading indicator */}
          {isLoading && (
            <Message from="assistant">
              <MessageAvatar name="AI" src={""} />
              <MessageContent variant="flat">
                <Loader />
              </MessageContent>
            </Message>
          )}
        </ConversationContent>
      </Conversation>

      {/* Input Area */}
      <ChatInput
        input={input}
        isLoading={isLoading}
        onInputChange={setInput}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
