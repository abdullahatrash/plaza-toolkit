"use client";

import { Bot, User } from "lucide-react";
import { ChatArtifact } from "./chat-artifact";
import { cn } from "@workspace/ui/lib/utils";

interface MessagePart {
  type: "text" | "tool-call" | "tool-result";
  text?: string;
  toolCallId?: string;
  toolName?: string;
  args?: Record<string, any>;
  result?: any;
}

interface ChatMessageProps {
  message: {
    id: string;
    role: "user" | "assistant" | "system";
    parts: MessagePart[];
  };
  isStreaming?: boolean;
}

export function ChatMessage({ message, isStreaming = false }: ChatMessageProps) {
  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";

  return (
    <div
      className={cn(
        "flex gap-3 w-full",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {/* Avatar - Left side for assistant */}
      {isAssistant && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
          <Bot className="h-4 w-4 text-primary-foreground" />
        </div>
      )}

      {/* Message Content */}
      <div className={cn("flex flex-col gap-2 max-w-[80%]", isUser && "items-end")}>
        {message.parts.map((part, index) => {
          // Text parts
          if (part.type === "text" && part.text) {
            return (
              <div
                key={`${message.id}-${index}`}
                className={cn(
                  "rounded-lg px-4 py-2",
                  isUser
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                <p className="text-sm whitespace-pre-wrap">{part.text}</p>
              </div>
            );
          }

          // Tool call parts
          if (part.type === "tool-call") {
            return (
              <ChatArtifact
                key={`${message.id}-${index}`}
                part={{
                  type: "tool-call",
                  toolCallId: part.toolCallId!,
                  toolName: part.toolName!,
                  args: part.args!,
                }}
              />
            );
          }

          // Tool result parts
          if (part.type === "tool-result") {
            return (
              <ChatArtifact
                key={`${message.id}-${index}`}
                part={{
                  type: "tool-result",
                  toolCallId: part.toolCallId!,
                  toolName: part.toolName!,
                  result: part.result,
                }}
              />
            );
          }

          return null;
        })}

        {/* Streaming indicator */}
        {isStreaming && isAssistant && (
          <div className="rounded-lg px-4 py-2 bg-muted">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" />
              <div
                className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              />
              <div
                className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Avatar - Right side for user */}
      {isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
          <User className="h-4 w-4" />
        </div>
      )}
    </div>
  );
}
