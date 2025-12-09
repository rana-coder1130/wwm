import { checklistData } from '$lib/data/checklist';
import type { ChecklistTask } from '$lib/types';
import { get } from 'svelte/store';
import { checklistState, countsState, lifetimeState, hiddenTasks, checklistMeta } from '$lib/stores';
import { goto } from '$app/navigation';
import { browser } from '$app/environment';

export function createChecklistLogic() {
	function today() {
		return new Date().getDay();
	}

	function isTaskVisible(task: ChecklistTask): boolean {
		const hidden = get(hiddenTasks);
		const t = today();
		if (hidden.includes(task.id)) return false;
		if (task.days && !task.days.includes(t)) return false;
		return true;
	}

	function toggleTask(type: 'daily' | 'weekly', id: string) {
		const state = get(checklistState);
		const counts = get(countsState);
		const lifetime = get(lifetimeState);

		const list = state[type];
		const isCurrentlyChecked = list.includes(id);

		const nextList = isCurrentlyChecked ? list.filter((item) => item !== id) : [...list, id];

		let nextLifetime = lifetime;

		if (!isCurrentlyChecked && type === 'daily') {
			const taskDef = checklistData.daily.find((t) => t.id === id);
			if (taskDef?.trackLifetime) {
				nextLifetime = { ...lifetime, [id]: (lifetime[id] || 0) + 1 };

				if (nextLifetime[id] >= (taskDef.limit || 0)) {
					// 不自動隱藏：導到確認頁面讓使用者決定是否隱藏
					if (browser) {
						const msg = `【${taskDef.text}】已完成 ${taskDef.limit} 次。是否要永久隱藏此項目？`;
						const returnTo = (window && window.location && window.location.pathname) || '/';
						goto(
							`/確認?action=hideItem&id=${encodeURIComponent(id)}&message=${encodeURIComponent(msg)}&returnTo=${encodeURIComponent(returnTo)}`
						);
					}
				}
			}
		}

		const nextState = { ...state, [type]: nextList };
		checklistState.set(nextState);
		lifetimeState.set(nextLifetime);
	}

	// resetTasks removed: reset functionality disabled per user request

	/**
	 * 全部重置
	 * options.clearHidden: 是否一併清除已隱藏的項目（預設 false）
	 */
	function resetAll(options?: { clearHidden?: boolean }) {
		const clearHidden = options?.clearHidden ?? false;
		// 清空勾選狀態
		checklistState.set({ daily: [], weekly: [] });
		// 清空計數器
		countsState.set({});
		// 清空 lifetime 記錄
		lifetimeState.set({});
		// 可選：清空隱藏清單
		if (clearHidden) {
			hiddenTasks.set([]);
		}
	}

	function resetDaily() {
		// 只清除每日勾選與每日型 counters
		const state = get(checklistState);
		checklistState.set({ ...state, daily: [] });

		// reset daily counters
		const counters = checklistData.daily.filter((t) => t.type === 'counter').map((t) => t.id);
		const counts = get(countsState);
		let nextCounts = { ...counts };
		let changed = false;
		for (const id of counters) {
			if ((nextCounts[id] || 0) !== 0) {
				nextCounts[id] = 0;
				changed = true;
			}
		}
		if (changed) countsState.set(nextCounts);
	}

	function resetWeekly() {
		// 只清除每週勾選
		const state = get(checklistState);
		checklistState.set({ ...state, weekly: [] });
	}

	function toggleCounter(id: string, idx: number) {
		const counts = get(countsState);
		const current = counts[id] || 0;
		const target = idx + 1;
		const nextCounts = { ...counts, [id]: current === target ? 0 : target };
		countsState.set(nextCounts);
	}

	function incrementCounter(id: string, max: number) {
		const counts = get(countsState);
		const current = counts[id] || 0;
		const nextCounts = { ...counts, [id]: current < max ? current + 1 : 0 };
		countsState.set(nextCounts);
	}

	function resetCounter(id: string) {
		const counts = get(countsState);
		const nextCounts = { ...counts, [id]: 0 };
		countsState.set(nextCounts);
	}

	function getVisibleDailyTasks() {
		return checklistData.daily.filter(isTaskVisible);
	}

	function getVisibleWeeklyTasks() {
		const state = get(checklistState);
		return checklistData.weekly.filter(
			(t) => t.type !== 'group' || t.subList?.some((s) => state.weekly.includes(s.id))
		);
	}

	// --- Auto-reset logic: 每日 05:00、每週一 05:00 ---

	function atHourOfDate(d: Date, hour = 5) {
		const t = new Date(d);
		t.setHours(hour, 0, 0, 0);
		return t;
	}

	function mondayAtHour(d: Date, hour = 5) {
		const t = new Date(d);
		const day = t.getDay(); // 0 = Sun, 1 = Mon
		// distance to Monday
		const offset = (day + 6) % 7; // 0 when Monday
		t.setDate(t.getDate() - offset);
		t.setHours(hour, 0, 0, 0);
		return t;
	}

	function performDailyResetIfNeeded(meta: { lastDailyReset: number; lastWeeklyReset: number }) {
		const now = new Date();
		const todayAt5 = atHourOfDate(now, 5).getTime();

		if (now.getTime() >= todayAt5 && (meta.lastDailyReset || 0) < todayAt5) {
			// 清除每日勾選
			const state = get(checklistState);
			checklistState.set({ ...state, daily: [] });

			// 重置每日型的 counters（如果有）
			const counters = checklistData.daily.filter((t) => t.type === 'counter').map((t) => t.id);
			const counts = get(countsState);
			let nextCounts = { ...counts };
			let changed = false;
			for (const id of counters) {
				if ((nextCounts[id] || 0) !== 0) {
					nextCounts[id] = 0;
					changed = true;
				}
			}
			if (changed) countsState.set(nextCounts);

			// 更新 meta
			checklistMeta.update((m) => ({ ...m, lastDailyReset: todayAt5 }));
		}
	}

	function performWeeklyResetIfNeeded(meta: { lastDailyReset: number; lastWeeklyReset: number }) {
		const now = new Date();
		const monday5 = mondayAtHour(now, 5).getTime();

		if (now.getTime() >= monday5 && (meta.lastWeeklyReset || 0) < monday5) {
			// 清除每週勾選
			const state = get(checklistState);
			checklistState.set({ ...state, weekly: [] });

			// 更新 meta
			checklistMeta.update((m) => ({ ...m, lastWeeklyReset: monday5 }));
		}
	}

	// 初始化且僅於瀏覽器端執行一次的定時檢查
	if (browser) {
		// 防止多次呼叫 createChecklistLogic 時重複註冊
		if (!(window as any).__yanyun_checklist_auto_reset_initialized) {
			(window as any).__yanyun_checklist_auto_reset_initialized = true;

			// 立即檢查一次，然後每分鐘檢查
			const runCheck = () => {
				const meta = get(checklistMeta);
				performDailyResetIfNeeded(meta);
				performWeeklyResetIfNeeded(meta);
			};

			runCheck();
			const id = setInterval(runCheck, 60 * 1000);

			// 保留在 window 上，以便在需要時清理（開發環境熱重載友好）
			(window as any).__yanyun_checklist_auto_reset_interval = id;
		}
	}

	return {
		toggleTask,
		toggleCounter,
		incrementCounter,
		resetCounter,
		resetAll,
		resetDaily,
		resetWeekly,
		isTaskVisible,
		getVisibleDailyTasks,
		getVisibleWeeklyTasks
	};
}
