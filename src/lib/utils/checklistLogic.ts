import { checklistData } from '$lib/data/checklist';
import type { ChecklistTask } from '$lib/types';
import { get } from 'svelte/store';
import { checklistState, countsState, lifetimeState, hiddenTasks } from '$lib/stores';

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
					setTimeout(() => {
						if (
							confirm(
								`【${taskDef.text}】已完成 ${taskDef.limit} 次。\n是否要永久隱藏此項目，讓清單更乾淨？`
							)
						) {
							const prevHidden = get(hiddenTasks);
							hiddenTasks.set([...prevHidden, id]);
						}
					}, 200);
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
		return checklistData.weekly.filter((t) => t.type !== 'group' || t.subList?.some((s) => state.weekly.includes(s.id)));
	}

	return {
		toggleTask,
		toggleCounter,
		incrementCounter,
		resetCounter,
		resetAll,
		isTaskVisible,
		getVisibleDailyTasks,
		getVisibleWeeklyTasks
	};
}
