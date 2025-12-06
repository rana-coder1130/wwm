import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { getCurrentUserId, getNamespacedKey } from './utils/userManager';

function createLocalStorage<T>(key: string, initialValue: T) {
	// 如果是瀏覽器環境，加入使用者命名空間
	const finalKey = browser ? getNamespacedKey(getCurrentUserId() || 'default', key) : key;
	const storedValue = browser ? localStorage.getItem(finalKey) : null;
	const data = storedValue ? JSON.parse(storedValue) : initialValue;

	const store = writable<T>(data);

	if (browser) {
		// 訂閱更新並保存到 localStorage
		const unsubscribe = store.subscribe((value) => {
			const currentKey = getNamespacedKey(getCurrentUserId() || 'default', key);
			localStorage.setItem(currentKey, JSON.stringify(value));
		});

		// 監聽使用者切換事件，重新載入該使用者的數據
		const handleUserSwitch = () => {
			const newKey = getNamespacedKey(getCurrentUserId() || 'default', key);
			const newValue = localStorage.getItem(newKey);
			store.set(newValue ? JSON.parse(newValue) : initialValue);
		};

		window.addEventListener('userSwitched', handleUserSwitch);
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

export const baiyeSettings = createLocalStorage<{ days: number[]; time: string }>('yanyunBaiye', {
	days: [],
	time: '20:00'
});

export const timerState = createLocalStorage<Record<string, number>>('yanyunTimers', {});

export const darkMode = createLocalStorage<boolean>('yanyunDarkMode', false);

export const skinGender = createLocalStorage<'male' | 'female'>('yanyunSkinGender', 'male');

export type ToastItem = {
	id: number;
	text: string;
	actionLabel?: string;
	// onAction is intentionally any to allow passing functions; this store is used only in browser
	onAction?: any;
};

export const toasts = writable<ToastItem[]>([]);
