import { get } from 'svelte/store';
import { toasts } from '$lib/stores';

let _id = 1;

export function showToast(text: string, actionLabel?: string, onAction?: () => void, duration = 5000) {
    const id = _id++;
    const item = { id, text, actionLabel, onAction };
    const prev = get(toasts);
    toasts.set([...prev, item]);

    if (duration > 0) {
        setTimeout(() => {
            removeToast(id);
        }, duration);
    }

    return id;
}

export function removeToast(id: number) {
    const prev = get(toasts);
    toasts.set(prev.filter((t) => t.id !== id));
}
