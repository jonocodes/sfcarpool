/**
 * Formats a timestamp as relative time with time-bucketed granularity.
 * Returns both the formatted text and the interval for the next update.
 *
 * @param timestamp - Unix timestamp in milliseconds or Date object
 * @returns Object with formatted text and update interval in milliseconds
 *
 * @example
 * formatRelativeTime(Date.now() - 120000) // { text: "2 mins ago", updateIntervalMs: 60000 }
 */
export function formatRelativeTime(timestamp: number | Date): {
  text: string;
  updateIntervalMs: number;
} {
  const now = Date.now();
  const ts = typeof timestamp === 'number' ? timestamp : timestamp.getTime();
  const elapsedMs = now - ts;

  const SECOND = 1000;
  const MINUTE = 60 * SECOND;
  const HOUR = 60 * MINUTE;
  const DAY = 24 * HOUR;
  const WEEK = 7 * DAY;
  const MONTH = 30 * DAY; // Approximate
  const YEAR = 365 * DAY; // Approximate

  // Less than 1 minute
  if (elapsedMs < MINUTE) {
    return {
      text: "just now",
      updateIntervalMs: MINUTE, // Update in 1 minute
    };
  }

  // 1-5 minutes: Update every minute
  if (elapsedMs < 5 * MINUTE) {
    const mins = Math.floor(elapsedMs / MINUTE);
    return {
      text: `${mins} ${mins === 1 ? 'min' : 'mins'} ago`,
      updateIntervalMs: MINUTE,
    };
  }

  // 5-60 minutes: Update every 5 minutes
  if (elapsedMs < HOUR) {
    const mins = Math.floor(elapsedMs / MINUTE);
    return {
      text: `${mins} mins ago`,
      updateIntervalMs: 5 * MINUTE,
    };
  }

  // 1-24 hours: Update every hour
  if (elapsedMs < DAY) {
    const hours = Math.floor(elapsedMs / HOUR);
    return {
      text: `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`,
      updateIntervalMs: HOUR,
    };
  }

  // 1-7 days: Update every hour
  if (elapsedMs < WEEK) {
    const days = Math.floor(elapsedMs / DAY);
    return {
      text: `${days} ${days === 1 ? 'day' : 'days'} ago`,
      updateIntervalMs: HOUR,
    };
  }

  // 1-4 weeks: Update daily
  if (elapsedMs < 4 * WEEK) {
    const weeks = Math.floor(elapsedMs / WEEK);
    return {
      text: `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`,
      updateIntervalMs: DAY,
    };
  }

  // 1-12 months: Update daily
  if (elapsedMs < YEAR) {
    const months = Math.floor(elapsedMs / MONTH);
    return {
      text: `${months} ${months === 1 ? 'month' : 'months'} ago`,
      updateIntervalMs: DAY,
    };
  }

  // 1+ years: Update weekly
  const years = Math.floor(elapsedMs / YEAR);
  return {
    text: `${years} ${years === 1 ? 'year' : 'years'} ago`,
    updateIntervalMs: WEEK,
  };
}
