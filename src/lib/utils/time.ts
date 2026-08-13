export type Countdown = {
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
  expired: boolean;
};

export function remainingMs(iso: string): number {
  return Math.max(0, new Date(iso).getTime() - Date.now());
}

export function fromNow(ms: number): string {
  return new Date(Date.now() + ms).toISOString();
}

export function toCountdown(iso: string): Countdown {
  const totalMs = remainingMs(iso);
  return {
    totalMs,
    hours: Math.floor(totalMs / 3_600_000),
    minutes: Math.floor((totalMs % 3_600_000) / 60_000),
    seconds: Math.floor((totalMs % 60_000) / 1_000),
    expired: totalMs <= 0,
  };
}

export function formatCountdown(c: Countdown): string {
  if (c.hours > 0) return `${c.hours}h ${c.minutes}m left today`;
  if (c.minutes > 0) return `${c.minutes}m left today`;
  return "Less than a minute left";
}

export function formatUnlocksIn(iso: string): string {
  const { totalMs, hours } = toCountdown(iso);
  if (totalMs <= 0) return "unlocks now";
  if (hours > 0) return `unlocks in ${hours}h`;
  const mins = Math.ceil(totalMs / 60_000);
  return `unlocks in ${mins}m`;
}