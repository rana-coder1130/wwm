<script lang="ts">
	import { checklistData } from '$lib/data/checklist';
	import type { ChecklistTask } from '$lib/types';
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
	import ProgressCard from '$lib/components/checklist/ProgressCard.svelte';
	import PartyAlert from '$lib/components/checklist/PartyAlert.svelte';
	import TaskSection from '$lib/components/checklist/TaskSection.svelte';
	import { createChecklistLogic } from '$lib/utils/checklistLogic';

	const today = new Date().getDay();

	const dailyGroups = [
		{ key: 'core', title: '每日必做' },
		{ key: 'optional', title: '每日選做' },
		{ key: 'social', title: '社交/多人' },
		{ key: 'micro', title: '積少成多' },
		{ key: 'timed', title: '限時活動' }
	];


	const logic = createChecklistLogic();

	function handleResetAll() {
		if (
			!confirm(
				'確定要全部重置嗎？這會清除每日/每週已勾選狀態、計數器與追蹤次數。'
			)
		) {
			return;
		}

		const clearHidden = confirm('是否同時清除已隱藏項目？（會還原所有被隱藏的任務）');
		logic.resetAll({ clearHidden });
		// 小小延遲讓 UI 反應在 localStorage 更新後更平滑
		setTimeout(() => {
			location.reload();
		}, 50);
	}

	const groupedDaily: Array<{ key: string; title: string; items: ChecklistTask[] }> = $derived.by(() =>
		dailyGroups.map((group) => ({
			...group,
			items: checklistData.daily.filter(
				(item) => (item.category || 'core') === group.key && logic.isTaskVisible(item)
			)
		}))
	);


	const isPartyDay = $baiyeSettings.days.includes(today);

	const visibleDailyTasks = $derived(() => logic.getVisibleDailyTasks());
	const dailyProgress = $derived({
		current: $checklistState.daily.length,
		total: visibleDailyTasks.length
	});
	const weeklyProgress = $derived({
		current: $checklistState.weekly.length,
		total: checklistData.weekly.reduce((acc, t) =>
			acc + (t.type === 'group' && t.subList ? t.subList.length : 1),
			0
		)
	});
	</script>

	<svelte:head>
		<title>待辦清單 - 燕雲十六聲</title>
	</svelte:head>

	<div class="flex flex-col h-full overflow-y-auto p-6 gap-8 max-w-7xl mx-auto w-full">
		<!-- Header -->
		<div class="flex flex-col gap-6">
			<div class="flex justify-between items-center">
				<a href="/" class="btn-invert">⬅️ 返回</a>
				<h1
					class="text-3xl font-extrabold bg-linear-to-r from-(--accent-primary) to-[#c8453f] bg-clip-text text-transparent m-0"
				>
					待辦清單
				</h1>
				<div>
					<button class="btn-invert" onclick={handleResetAll}>全部重置</button>
				</div>
			</div>

		<!-- Progress Summary -->
		<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
			<ProgressCard label="每日進度" current={dailyProgress.current} total={dailyProgress.total} />
			<ProgressCard
				label="每週進度"
				current={weeklyProgress.current}
				total={weeklyProgress.total}
			/>
		</div>

		<!-- Daily guide now lives inside daily section below -->
	</div>

	<!-- Party Alert -->
	{#if isPartyDay}
		<PartyAlert
			time={$baiyeSettings.time}
			isChecked={$checklistState.daily.includes('d_baiye')}
			onToggle={() => logic.toggleTask('daily', 'd_baiye')}
		/>
	{/if}

	<!-- Daily Tasks Section -->
	<TaskSection title="每日必做">
		{#snippet children()}
			<div class="flex flex-col gap-6">
				{#each groupedDaily as group}
					{#if group.items.length}
						<div class="flex flex-col gap-3">
							<div class="card-section-title px-0 pt-0">{group.title}</div>
							<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-[1fr] gap-3 md:gap-4">
								{#each group.items as item}
									{#if item.type === 'counter'}
									<CounterCard
										item={item}
										count={$countsState[item.id] || 0}
										onIncrement={() => logic.incrementCounter(item.id, item.max ?? 1)}
										onToggle={(i) => logic.toggleCounter(item.id, i)}
										onReset={() => logic.resetCounter(item.id)}
									/>
									{:else}
									<TaskCard
										item={item}
										checked={$checklistState.daily.includes(item.id)}
										lifetime={$lifetimeState[item.id] || 0}
										limit={item.limit || 0}
										onToggle={() => logic.toggleTask('daily', item.id)}
									/>
									{/if}
								{/each}
							</div>
						</div>
					{/if}
				{/each}
			</div>
		{/snippet}
	</TaskSection>

	<!-- Weekly Tasks Section -->
	<TaskSection title="每週必做">
		{#snippet children()}
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
				<!-- 左側：商店必買清單 (群組卡) -->
				<div class="grid grid-cols-1 auto-rows-[1fr] gap-3 md:gap-4">
					{#each checklistData.weekly.filter((i) => i.type === 'group') as item}
						<WeeklyGroupCard
							item={item}
							activeIds={$checklistState.weekly}
							onToggle={(id) => logic.toggleTask('weekly', id)}
						/>
					{/each}
				</div>

				<!-- 右側：其他每週項目 -->
				<div class="grid grid-cols-1 sm:grid-cols-2 auto-rows-[1fr] gap-3 md:gap-4">
					{#each checklistData.weekly.filter((i) => i.type !== 'group') as item}
						<TaskCard
							item={item}
							checked={$checklistState.weekly.includes(item.id)}
							size="compact"
							onToggle={() => logic.toggleTask('weekly', item.id)}
						/>
					{/each}
				</div>
			</div>
		{/snippet}
	</TaskSection>

	<div class="h-8"></div>
</div>

<!-- debug panel removed in refactor -->
