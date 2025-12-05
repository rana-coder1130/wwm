import { writable } from 'svelte/store';
import { browser } from '$app/environment';

function createLocalStorage<T>(key: string, initialValue: T) {
	const storedValue = browser ? localStorage.getItem(key) : null;
	const data = storedValue ? JSON.parse(storedValue) : initialValue;

	const store = writable<T>(data);

	if (browser) {
		store.subscribe((value) => {
			localStorage.setItem(key, JSON.stringify(value));
		});
	}

	return store;
}

export const checklistState = createLocalStorage<{ daily: string[]; weekly: string[] }>(
	'yanyunChecklist',
	{ daily: [], weekly: [] }
);

export const countsState = createLocalStorage<Record<string, number>>('yanyunCounts', {});

export const lifetimeState = createLocalStorage<Record<string, number>>('yanyunLifetime', {});

export const hiddenTasks = createLocalStorage<string[]>('yanyunHidden', []);

export const baiyeSettings = createLocalStorage<{ days: number[]; time: string }>(
	'yanyunBaiye',
	{ days: [], time: '20:00' }
);

export const timerState = createLocalStorage<Record<string, number>>('yanyunTimers', {});

export type ToastItem = {
	id: number;
	text: string;
	actionLabel?: string;
	// onAction is intentionally any to allow passing functions; this store is used only in browser
	onAction?: any;
};

export const toasts = writable<ToastItem[]>([]);
