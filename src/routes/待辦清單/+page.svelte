<script lang="ts">
	import { checklistData } from '$lib/data/checklist';
	import {
		checklistState,
		countsState,
		lifetimeState,
		hiddenTasks,
		baiyeSettings
	} from '$lib/stores';
	import CounterCard from '$lib/components/checklist/CounterCard.svelte';
	import TaskCard from '$lib/components/checklist/TaskCard.svelte';
	import WeeklyGroupCard from '$lib/components/checklist/WeeklyGroupCard.svelte';
	import type { ChecklistTask } from '$lib/types';

	let state = $checklistState;
	let counts = $countsState;
	let lifetime = $lifetimeState;
	let hidden = $hiddenTasks;
	let baiye = $baiyeSettings;

	const today = new Date().getDay();
	const isPartyDay = baiye.days.includes(today);

	function toggleTask(type: 'daily' | 'weekly', id: string) {
		const list = state[type];
		const isCurrentlyChecked = list.includes(id);

		const nextList = isCurrentlyChecked
			? list.filter((item: string) => item !== id)
			: [...list, id];

		let nextLifetime = lifetime;

		if (!isCurrentlyChecked && type === 'daily') {
			const taskDef = checklistData.daily.find((t: ChecklistTask) => t.id === id);
			if (taskDef?.trackLifetime) {
				nextLifetime = { ...lifetime, [id]: (lifetime[id] || 0) + 1 };

				if (nextLifetime[id] >= (taskDef.limit || 0)) {
					setTimeout(() => {
						if (
							confirm(
								`【${taskDef.text}】已完成 ${taskDef.limit} 次。\n是否要永久隱藏此項目，讓清單更乾淨？`
							)
						)
							{
								hiddenTasks.set([...hidden, id]);
							}
					}, 200);
				}
			}
		}

		const nextState = { ...state, [type]: nextList };
		state = nextState;
		lifetime = nextLifetime;
		checklistState.set(nextState);
		lifetimeState.set(nextLifetime);
	}

	function resetTasks(type: 'daily' | 'weekly') {
		if (confirm('確定重置？')) {
			const nextState = { ...state, [type]: [] };
			const nextCounts = type === 'daily' ? { ...counts, d_orders: 0 } : counts;
			state = nextState;
			counts = nextCounts;
			checklistState.set(nextState);
			countsState.set(nextCounts);
		}
	}

	function toggleCounter(id: string, idx: number) {
		const current = counts[id] || 0;
		const target = idx + 1;
		const nextCounts = { ...counts, [id]: current === target ? 0 : target };
		counts = nextCounts;
		countsState.set(nextCounts);
	}

	function incrementCounter(id: string, max: number) {
		const current = counts[id] || 0;
		const nextCounts = { ...counts, [id]: current < max ? current + 1 : 0 };
		counts = nextCounts;
		countsState.set(nextCounts);
	}

	function resetCounter(id: string) {
		const nextCounts = { ...counts, [id]: 0 };
		counts = nextCounts;
		countsState.set(nextCounts);
	}

	function isTaskVisible(task: ChecklistTask): boolean {
		if (hidden.includes(task.id)) return false;
		if (task.days && !task.days.includes(today)) return false;
		return true;
	}
	</script>

	<svelte:head>
		<title>待辦清單 - 燕雲十六聲</title>
	</svelte:head>

	<div class="flex flex-col h-full overflow-y-auto p-6 gap-8 max-w-7xl mx-auto w-full">
		<!-- Header -->
		<div class="flex flex-col gap-6">
			<div class="flex justify-between items-center">
				<a
					href="/"
					class="no-underline text-(--accent-primary) font-semibold cursor-pointer transition-all duration-200 py-2 px-4 rounded-lg bg-(--accent-primary)/15 hover:bg-(--accent-primary)/25 hover:-translate-x-1"
				>
					⬅️ 返回
				</a>
				<h1
					class="text-3xl font-extrabold bg-linear-to-r from-(--accent-primary) to-[#c8453f] bg-clip-text text-transparent m-0"
				>
					待辦清單
				</h1>
				<div class="w-10"></div>
			</div>

			<!-- Progress Summary -->
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div
					class="bg-white/90 backdrop-blur-xl border border-black/8 rounded-xl p-4 flex flex-col gap-3"
				>
					<div class="text-sm text-(--text-secondary) font-semibold">每日進度</div>
					<div class="h-1.5 bg-(--bg-tertiary) rounded-full overflow-hidden">
						<div
							class="h-full bg-linear-to-r from-(--accent-primary) to-(--accent-secondary) rounded-full transition-all duration-300"
							style="width: {Math.round(
								(state.daily.length / checklistData.daily.filter((t) => isTaskVisible(t)).length) * 100
							)}%"
						></div>
					</div>
					<div class="text-xs text-(--text-secondary) text-right font-medium">
						{state.daily.length}/{checklistData.daily.filter((t) => isTaskVisible(t)).length}
					</div>
				</div>
				<div
					class="bg-white/90 backdrop-blur-xl border border-black/8 rounded-xl p-4 flex flex-col gap-3"
				>
					<div class="text-sm text-(--text-secondary) font-semibold">每週進度</div>
					<div class="h-1.5 bg-(--bg-tertiary) rounded-full overflow-hidden">
						<div
							class="h-full bg-linear-to-r from-(--accent-primary) to-(--accent-secondary) rounded-full transition-all duration-300"
							style="width: {Math.round(
								(state.weekly.length /
									checklistData.weekly.filter(
										(t) => t.type !== 'group' || t.subList?.some((s) => state.weekly.includes(s.id))
									).length) * 100
							)}%"
						></div>
					</div>
					<div class="text-xs text-(--text-secondary) text-right font-medium">
						{state.weekly.length}/{checklistData.weekly.filter((t) => t.type !== 'group').length}
					</div>
				</div>
			</div>
		</div>

		<!-- Party Alert -->
		{#if isPartyDay}
			<div
				class="bg-linear-to-r from-(--accent-primary)/20 to-(--accent-secondary)/15 backdrop-blur-xl border border-(--accent-primary)/30 rounded-xl p-4 flex items-center gap-4 animate-pulse"
			>
				<span class="text-4xl shrink-0">🎉</span>
				<div class="flex-1">
					<div class="font-bold text-(--accent-primary)">百業派對日</div>
					<div class="text-sm text-(--text-secondary) mt-1 font-medium">時間：{baiye.time}</div>
				</div>
				<button
					class="w-10 h-10 bg-(--accent-primary)/20 border border-(--accent-primary) rounded-lg flex items-center justify-center cursor-pointer transition-all duration-300 shrink-0 font-bold text-transparent hover:bg-(--accent-primary)/30 hover:scale-110 hover:shadow-lg hover:shadow-(--accent-primary)/30 active:scale-95 {state.daily.includes(
						'd_baiye'
					)
						? 'bg-(--accent-primary) text-white shadow-lg shadow-(--accent-primary)/50'
						: ''}"
					onclick={() => toggleTask('daily', 'd_baiye')}
					title="參加派對"
				>
					<span
						class="{state.daily.includes('d_baiye')
							? 'opacity-100'
							: 'opacity-0'} transition-opacity duration-200">✓</span
					>
				</button>
			</div>
		{/if}

		<!-- Daily Tasks Section -->
		<div class="bg-white/90 backdrop-blur-xl border border-black/8 rounded-2xl p-3 md:p-5 flex flex-col gap-3 shadow-sm">
			<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
				<h2 class="text-xl font-bold m-0 text-(--text-primary)">每日必做</h2>
				<button
					class="bg-(--accent-primary)/15 border border-(--accent-primary)/30 text-(--accent-primary) py-2 px-4 rounded-lg cursor-pointer text-sm font-bold transition-all duration-300 hover:bg-(--accent-primary)/25 hover:border-(--accent-primary) hover:shadow-md hover:shadow-(--accent-primary)/20 hover:scale-105 active:scale-95"
					onclick={() => resetTasks('daily')}
					title="重置所有任務"
				>
					🔄 重置
				</button>
			</div>

			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-[1fr] gap-3 md:gap-4">
				{#each checklistData.daily as item}
					{#if isTaskVisible(item)}
						{#if item.type === 'counter'}
							<CounterCard
								item={item}
								count={counts[item.id] || 0}
								onIncrement={() => incrementCounter(item.id, item.max ?? 1)}
								onToggle={(i) => toggleCounter(item.id, i)}
								onReset={() => resetCounter(item.id)}
							/>
						{:else}
							<TaskCard
								item={item}
								checked={state.daily.includes(item.id)}
								lifetime={lifetime[item.id] || 0}
								limit={item.limit || 0}
								onToggle={() => toggleTask('daily', item.id)}
							/>
						{/if}
					{/if}
				{/each}
			</div>
		</div>

		<!-- Weekly Tasks Section -->
		<div class="bg-white/90 backdrop-blur-xl border border-black/8 rounded-2xl p-3 md:p-5 flex flex-col gap-3 shadow-sm">
			<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
				<h2 class="text-xl font-bold m-0 text-(--text-primary)">每週必做</h2>
				<button
					class="bg-(--accent-primary)/15 border border-(--accent-primary)/30 text-(--accent-primary) py-2 px-4 rounded-lg cursor-pointer text-sm font-bold transition-all duration-300 hover:bg-(--accent-primary)/25 hover:border-(--accent-primary) hover:shadow-md hover:shadow-(--accent-primary)/20 hover:scale-105 active:scale-95"
					onclick={() => resetTasks('weekly')}
					title="重置所有任務"
				>
					🔄 重置
				</button>
			</div>

			<div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
				<div class="grid grid-cols-1 auto-rows-[1fr] gap-3 md:gap-4">
					{#each checklistData.weekly as item}
						{#if item.type === 'group'}
							<WeeklyGroupCard item={item} activeIds={state.weekly} onToggle={(id) => toggleTask('weekly', id)} />
						{/if}
					{/each}
				</div>

				<div class="grid grid-cols-1 sm:grid-cols-2 auto-rows-[1fr] gap-3 md:gap-4">
					{#each checklistData.weekly.filter((i) => i.type !== 'group') as item}
						<TaskCard
							item={item}
							checked={state.weekly.includes(item.id)}
							size="compact"
							onToggle={() => toggleTask('weekly', item.id)}
						/>
					{/each}
				</div>
			</div>
		</div>

		<div class="h-8"></div>
	</div>
