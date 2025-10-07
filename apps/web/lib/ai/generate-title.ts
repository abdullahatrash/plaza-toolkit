/**
 * Generate a concise chat title from the first user message
 * Truncates to max 60 characters and adds ellipsis if needed
 */
export function generateChatTitle(firstMessage: string): string {
  // Clean up the message
  const cleaned = firstMessage.trim();

  // Default title if empty
  if (!cleaned) {
    return "New Chat";
  }

  // Truncate to 60 characters
  const maxLength = 60;
  if (cleaned.length <= maxLength) {
    return cleaned;
  }

  // Find a good break point (space) before maxLength
  const truncated = cleaned.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");

  if (lastSpace > maxLength * 0.6) {
    // If there's a space in the last 40% of the string, use it
    return truncated.substring(0, lastSpace) + "...";
  }

  // Otherwise just hard truncate
  return truncated + "...";
}
