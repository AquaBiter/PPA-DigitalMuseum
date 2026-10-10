/**
 * Utility functions for parsing and formatting YouTube embed URLs
 */

/**
 * Extracts the 11-character YouTube video ID from various link formats:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube.com/shorts/VIDEO_ID
 * - https://www.youtube.com/live/VIDEO_ID
 * - <iframe src="https://www.youtube.com/embed/VIDEO_ID" ...>
 * - or raw 11-char ID
 */
export function extractYouTubeId(rawUrl: string): string | null {
  if (!rawUrl) return null;
  const input = rawUrl.trim();

  // If already an 11-character alphanumeric/dash/underscore string
  if (/^[a-zA-Z0-9_-]{11}$/.test(input)) {
    return input;
  }

  // Handle embedded iframe snippets
  const iframeMatch = input.match(/src=["'](.*?)["']/i);
  const target = iframeMatch ? iframeMatch[1] : input;

  const patterns = [
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|shorts\/|live\/|watch\?v=|watch\?.+?&v=))([\w-]{11})/,
    /(?:youtube-nocookie\.com\/embed\/)([\w-]{11})/,
  ];

  for (const regex of patterns) {
    const match = target.match(regex);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Converts any valid YouTube URL or video ID into standard iframe embed format:
 * https://www.youtube.com/embed/VIDEO_ID
 */
export function formatToYouTubeEmbed(rawUrl: string): string {
  if (!rawUrl) return '';
  const trimmed = rawUrl.trim();
  const id = extractYouTubeId(trimmed);
  if (id) {
    return `https://www.youtube.com/embed/${id}`;
  }
  return trimmed;
}

/**
 * Parses multiple YouTube URLs from multi-line or delimited text.
 * Each line or entry can be a URL, an embed URL, or "Title | URL" or "URL"
 */
export function parseMultipleYouTubeUrls(text: string): { url: string; title?: string }[] {
  if (!text) return [];

  // Split by newlines or commas/semicolons
  const lines = text.split(/[\r\n,;]+/);
  const results: { url: string; title?: string }[] = [];

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    // Check if line is in format "Title | URL" or "URL - Title"
    if (trimmed.includes('|')) {
      const parts = trimmed.split('|');
      const title = parts[0].trim();
      const urlPart = parts.slice(1).join('|').trim();
      const embedUrl = formatToYouTubeEmbed(urlPart);
      if (embedUrl) {
        results.push({ url: embedUrl, title: title || undefined });
        return;
      }
    }

    const embedUrl = formatToYouTubeEmbed(trimmed);
    if (embedUrl) {
      results.push({ url: embedUrl });
    }
  });

  return results;
}
