export function calculateExpirationDate(option: string, customDate?: string): string | null {
  if (option === 'none' || !option) return null;
  
  const now = new Date();
  switch (option) {
    case '1h':
      now.setHours(now.getHours() + 1);
      return now.toISOString();
    case '6h':
      now.setHours(now.getHours() + 6);
      return now.toISOString();
    case '12h':
      now.setHours(now.getHours() + 12);
      return now.toISOString();
    case '1d':
      now.setDate(now.getDate() + 1);
      return now.toISOString();
    case '3d':
      now.setDate(now.getDate() + 3);
      return now.toISOString();
    case '7d':
      now.setDate(now.getDate() + 7);
      return now.toISOString();
    case 'custom':
      return customDate ? new Date(customDate).toISOString() : null;
    default:
      return null;
  }
}

export function formatDate(isoString: string | null | undefined): string {
  if (!isoString) return 'Never';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return 'Invalid date';
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return 'Invalid date';
  }
}

export function isPastDate(isoString: string | null | undefined): boolean {
  if (!isoString) return false;
  return new Date(isoString).getTime() < Date.now();
}
