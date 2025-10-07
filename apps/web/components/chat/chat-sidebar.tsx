"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/sheet";
import { Button } from "@workspace/ui/components/button";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import {
  History,
  MessageSquare,
  Plus,
  Trash2,
  FileText,
  FolderOpen,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@workspace/ui/components/badge";

interface Chat {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: Array<{
    id: string;
    role: string;
    parts: string;
  }>;
  report?: {
    id: string;
    title: string;
    reportNumber: string;
  };
  case?: {
    id: string;
    title: string;
    caseNumber: string;
  };
}

interface ChatSidebarProps {
  currentChatId: string;
  onNewChat: () => void;
  onSelectChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
}

export function ChatSidebar({
  currentChatId,
  onNewChat,
  onSelectChat,
  onDeleteChat,
}: ChatSidebarProps) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const fetchChats = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/chat");
      const data = await response.json();

      if (data.success) {
        setChats(data.data.chats);
      } else {
        toast.error("Failed to load chat history");
      }
    } catch (error) {
      console.error("Failed to fetch chats:", error);
      toast.error("Failed to load chat history");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch chats when sidebar opens
  useEffect(() => {
    if (isOpen) {
      fetchChats();
    }
  }, [isOpen]);

  const handleDeleteChat = async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!confirm("Are you sure you want to delete this chat?")) {
      return;
    }

    try {
      const response = await fetch(`/api/chat?id=${chatId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Chat deleted");
        setChats((prev) => prev.filter((chat) => chat.id !== chatId));
        onDeleteChat(chatId);
      } else {
        toast.error(data.error || "Failed to delete chat");
      }
    } catch (error) {
      console.error("Delete chat error:", error);
      toast.error("Failed to delete chat");
    }
  };

  const handleSelectChat = (chatId: string) => {
    onSelectChat(chatId);
    setIsOpen(false);
  };

  const handleNewChat = () => {
    onNewChat();
    setIsOpen(false);
  };

  const getFirstMessage = (chat: Chat): string => {
    if (!chat.messages || chat.messages.length === 0) return "No messages yet";

    try {
      const parts = JSON.parse(chat.messages[0]?.parts || "[]");
      const textPart = parts.find((p: any) => p.type === "text");
      return textPart?.text || "No preview available";
    } catch {
      return "No preview available";
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0">
          <History className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Chat History</SheetTitle>
          <SheetDescription>
            View and manage your AI conversations
          </SheetDescription>
        </SheetHeader>

        <div className="mt-4 space-y-4 px-4">
          {/* New Chat Button */}
          <Button onClick={handleNewChat} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            New Chat
          </Button>

          {/* Chat List */}
          <ScrollArea className="h-[calc(100vh-12rem)]">
            <div className="space-y-2 px-1">
              {isLoading && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Loading chats...
                </p>
              )}

              {!isLoading && chats.length === 0 && (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    No chats yet. Start a new conversation!
                  </p>
                </div>
              )}

              {chats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => handleSelectChat(chat.id)}
                  className={`group relative rounded-lg border p-3 cursor-pointer transition-colors hover:bg-accent ${
                    currentChatId === chat.id
                      ? "border-primary bg-accent"
                      : "border-border"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold truncate">
                        {chat.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {getFirstMessage(chat)}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        {chat.report && (
                          <Badge variant="outline" className="text-xs">
                            <FileText className="h-3 w-3 mr-1" />
                            {chat.report.reportNumber}
                          </Badge>
                        )}
                        {chat.case && (
                          <Badge variant="outline" className="text-xs">
                            <FolderOpen className="h-3 w-3 mr-1" />
                            {chat.case.caseNumber}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(chat.updatedAt).toLocaleDateString(
                          undefined,
                          {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => handleDeleteChat(chat.id, e)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
}
