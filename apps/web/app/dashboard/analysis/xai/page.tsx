"use client";

// import { Brain } from 'lucide-react';
import { ChatInterface } from "@/components/chat/chat-interface";

export default function XAIPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Assistant</h1>
        <p className="text-muted-foreground mt-2">
          Analyze environmental incidents and investigate patterns with AI
        </p>
      </div>

      <div className="rounded-lg border bg-card">
        <ChatInterface />
      </div>
    </div>
  );
}
