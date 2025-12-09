export function getNextDailyReset(hour = 5): Date {
    const now = new Date();
    const next = new Date(now);
    next.setHours(hour, 0, 0, 0);
    if (next.getTime() <= now.getTime()) next.setDate(next.getDate() + 1);
    return next;
}

export function getNextWeeklyReset(hour = 5): Date {
    const now = new Date();
    // compute next Monday at given hour
    const next = new Date(now);
    const day = next.getDay(); // 0 = Sun
    const daysUntilMon = (8 - day) % 7; // 0..6
    next.setDate(next.getDate() + daysUntilMon);
    next.setHours(hour, 0, 0, 0);
    if (next.getTime() <= now.getTime()) next.setDate(next.getDate() + 7);
    return next;
}

export function formatDurationMs(ms: number): string {
    if (ms <= 0) return '00:00:00';
    const total = Math.floor(ms / 1000);
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function formatNextResetLabel(d: Date, includeWeekday = false): string {
    try {
        const opts: Intl.DateTimeFormatOptions = {
            hour: '2-digit',
            minute: '2-digit'
        };
        if (includeWeekday) opts.weekday = 'short';
        return new Intl.DateTimeFormat(undefined, opts).format(d);
    } catch (e) {
        // fallback
        const hh = String(d.getHours()).padStart(2, '0');
        const mm = String(d.getMinutes()).padStart(2, '0');
        return `${hh}:${mm}`;
    }
}

/**
 * Get next occurrence for an annual event (month: 1-12, day: 1-31).
 * If the date this year is already past the given time, returns the date next year.
 */
export function getNextAnnual(month: number, day: number, hour = 0, minute = 0): Date {
    const now = new Date();
    const year = now.getFullYear();
    let candidate = new Date(year, month - 1, day, hour, minute, 0, 0);
    if (candidate.getTime() <= now.getTime()) {
        candidate = new Date(year + 1, month - 1, day, hour, minute, 0, 0);
    }
    return candidate;
}

/**
 * Get a fixed datetime (year, month 1-12, day, hour, minute). If the given
 * datetime is in the past, returns the exact Date (caller decides behaviour).
 */
export function getFixedDateTime(year: number, month: number, day: number, hour = 0, minute = 0): Date {
    return new Date(year, month - 1, day, hour, minute, 0, 0);
}

/**
 * Get next occurrence for a weekly event on given weekday (0=Sun..6=Sat)
 * at hour:minute. If today at that time is still in the future, returns today.
 */
export function getNextWeeklyForWeekday(weekday: number, hour = 5, minute = 0): Date {
    const now = new Date();
    const candidate = new Date(now);
    const day = candidate.getDay();
    const daysUntil = (weekday - day + 7) % 7;
    candidate.setDate(candidate.getDate() + daysUntil);
    candidate.setHours(hour, minute, 0, 0);
    if (candidate.getTime() <= now.getTime()) {
        // already passed today -> next week
        candidate.setDate(candidate.getDate() + 7);
    }
    return candidate;
}
