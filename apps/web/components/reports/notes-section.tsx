'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import { Button } from '@workspace/ui/components/button';
import { Textarea } from '@workspace/ui/components/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@workspace/ui/components/avatar';
import { Badge } from '@workspace/ui/components/badge';
import { Separator } from '@workspace/ui/components/separator';
import { MessageSquare, Send, Lock, Globe } from 'lucide-react';
import { toast } from 'sonner';
import { formatRelativeTime } from '@workspace/lib/utils';
import { UserRole } from '@workspace/database';

interface Note {
  id: string;
  content: string;
  type: string;
  isInternal: boolean;
  createdAt: string;
  author: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
    role: UserRole;
  };
}

interface NotesSectionProps {
  reportId: string;
  userRole: UserRole;
  canAddNotes: boolean;
}

export function NotesSection({ reportId, userRole, canAddNotes }: NotesSectionProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchNotes();
  }, [reportId]);

  const fetchNotes = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/reports/${reportId}/notes`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch notes');
      }

      const data = await response.json();
      setNotes(data.data || []);
    } catch (error) {
      console.error('Fetch notes error:', error);
      toast.error('Failed to load notes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) {
      toast.error('Please enter a note');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/reports/${reportId}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newNote.trim(),
          type: 'COMMENT',
          isInternal: true,
        }),
        credentials: 'include',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to add note');
      }

      toast.success('Note added successfully');
      setNewNote('');
      fetchNotes();
    } catch (error: any) {
      console.error('Add note error:', error);
      toast.error(error.message || 'Failed to add note');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleBadgeColor = (role: UserRole) => {
    const colors: Record<UserRole, string> = {
      [UserRole.ADMIN]: 'bg-purple-100 text-purple-800',
      [UserRole.ANALYST]: 'bg-blue-100 text-blue-800',
      [UserRole.OFFICER]: 'bg-green-100 text-green-800',
      [UserRole.PROSECUTOR]: 'bg-orange-100 text-orange-800',
      [UserRole.CITIZEN]: 'bg-gray-100 text-gray-800',
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Investigation Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Loading notes...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Investigation Notes
        </CardTitle>
        <CardDescription>
          {userRole === UserRole.CITIZEN
            ? 'Internal investigation notes are not visible to citizens'
            : 'Internal notes for the investigation team'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Note Form - Only for authorized users */}
        {canAddNotes && (
          <>
            <div className="space-y-2">
              <Textarea
                placeholder="Add an investigation note..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                rows={3}
                className="resize-none"
              />
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Lock className="h-3 w-3" />
                  Internal note (not visible to citizens)
                </p>
                <Button
                  size="sm"
                  onClick={handleAddNote}
                  disabled={isSubmitting || !newNote.trim()}
                >
                  <Send className="mr-2 h-4 w-4" />
                  {isSubmitting ? 'Adding...' : 'Add Note'}
                </Button>
              </div>
            </div>
            <Separator />
          </>
        )}

        {/* Notes List */}
        {notes.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              {userRole === UserRole.CITIZEN
                ? 'No notes available'
                : 'No investigation notes yet'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {notes.map((note) => (
              <div
                key={note.id}
                className="flex gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={note.author.avatarUrl || undefined} />
                  <AvatarFallback className="text-xs">
                    {getInitials(note.author.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{note.author.name}</span>
                    <Badge
                      variant="secondary"
                      className={`text-xs ${getRoleBadgeColor(note.author.role)}`}
                    >
                      {note.author.role}
                    </Badge>
                    {note.isInternal && (
                      <Badge variant="outline" className="text-xs">
                        <Lock className="h-3 w-3 mr-1" />
                        Internal
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground ml-auto">
                      {formatRelativeTime(note.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-foreground whitespace-pre-wrap">
                    {note.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
