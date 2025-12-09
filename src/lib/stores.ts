import { writable, get } from 'svelte/store';
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

export const checklistMeta = createLocalStorage<{ lastDailyReset: number; lastWeeklyReset: number }>(
	'yanyunChecklistMeta',
	{ lastDailyReset: 0, lastWeeklyReset: 0 }
);

export type ToastItem = {
	id: number;
	text: string;
	actionLabel?: string;
	// onAction is intentionally any to allow passing functions; this store is used only in browser
	onAction?: any;
};

export const toasts = writable<ToastItem[]>([]);

// ID migration map: 用於在更改 item id 後把使用者現有的 store 資料遷移到新 id。
// 當需要重命名 checklist item id 時，在此加入對應： 'old_id': 'new_id'
const ID_MIGRATIONS: Record<string, string> = {
	// 'd_old_example': 'd_new_example',
};

if (browser && Object.keys(ID_MIGRATIONS).length > 0) {
	try {
		const counts = get(countsState);
		const lifetime = get(lifetimeState);
		const hidden = get(hiddenTasks);
		const timers = get(timerState);
		const checklist = get(checklistState);

		let changed = false;

		for (const [oldId, newId] of Object.entries(ID_MIGRATIONS)) {
			if (oldId === newId) continue;

			if (counts && Object.prototype.hasOwnProperty.call(counts, oldId) && !Object.prototype.hasOwnProperty.call(counts, newId)) {
				counts[newId] = counts[oldId];
				delete counts[oldId];
				changed = true;
			}

			if (lifetime && Object.prototype.hasOwnProperty.call(lifetime, oldId) && !Object.prototype.hasOwnProperty.call(lifetime, newId)) {
				lifetime[newId] = lifetime[oldId];
				delete lifetime[oldId];
				changed = true;
			}

			if (timers && Object.prototype.hasOwnProperty.call(timers, oldId) && !Object.prototype.hasOwnProperty.call(timers, newId)) {
				timers[newId] = timers[oldId];
				delete timers[oldId];
				changed = true;
			}

			if (Array.isArray(hidden)) {
				const idx = hidden.indexOf(oldId);
				if (idx !== -1) {
					if (hidden.indexOf(newId) === -1) {
						hidden[idx] = newId;
					} else {
						hidden.splice(idx, 1);
					}
					changed = true;
				}
			}

			if (checklist) {
				['daily', 'weekly'].forEach((key) => {
					const arr = (checklist as any)[key] as string[];
					const i = arr.indexOf(oldId);
					if (i !== -1) {
						if (arr.indexOf(newId) === -1) {
							arr[i] = newId;
						} else {
							arr.splice(i, 1);
						}
						changed = true;
					}
				});
			}
		}

		if (changed) {
			countsState.set(counts);
			lifetimeState.set(lifetime);
			timerState.set(timers);
			hiddenTasks.set(hidden);
			checklistState.set(checklist);
		}
	} catch (e) {
		// migration 不應阻塞應用，失敗時只在 console 報錯
		// eslint-disable-next-line no-console
		console.error('checklist id migration failed', e);
	}
}
