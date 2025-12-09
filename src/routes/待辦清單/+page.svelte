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
	import { showToast } from '$lib/utils/toast';
	import ConfirmModal from '$lib/components/ConfirmModal.svelte';
	import SettingsModal from '$lib/components/SettingsModal.svelte';
	import { countdownSettings } from '$lib/stores';

	const today = new Date().getDay();

	const dailyGroups = [
		{ key: 'core', title: '每日必做' },
		{ key: 'optional', title: '每日選做' },
		{ key: 'social', title: '社交/多人' },
		{ key: 'micro', title: '積少成多' },
		{ key: 'timed', title: '限時活動' }
	];

	const logic = createChecklistLogic();

	// modal-driven confirm flow
	let modalOpen = $state(false);
	let pendingReset: 'daily' | 'weekly' | 'all' | null = $state(null);
	let modalTitle = $state('');
	let modalMessage = $state('');
	let clearHidden = $state(false);

	// Countdown timers: use shared util for next reset calculation and formatting
	import {
		getNextDailyReset,
		getNextWeeklyReset,
		formatDurationMs,
		formatNextResetLabel,
		getNextAnnual,
		getFixedDateTime,
		getNextWeeklyForWeekday
	} from '$lib/utils/resetCountdown';

	let dailyCountdown = $state('00:00:00');
	let weeklyCountdown = $state('00:00:00');
	let dailyNextLabel = $state('05:00');
	let weeklyNextLabel = $state('週一 05:00');
	// Additional event countdowns
	let battlePassCountdown = $state('00:00:00');
	let battlePassLabel = $state('12/12 05:00');
	let hemingCountdown = $state('00:00:00');
	let hemingLabel = $state('12/12 05:00');
	let seasonalShopCountdown = $state('00:00:00');
	let seasonalShopLabel = $state('2026/02/05 18:30');
	let fridayMarketCountdown = $state('00:00:00');
	let fridayMarketLabel = $state('週五 05:00');

	let settingsOpen = $state(false);

	if (typeof window !== 'undefined') {
		// enforce fixed hours (5) and ensure battle pass countdown is shown per user request
		// This runs on page load and will set the persisted settings to the requested values.
		try {
			countdownSettings.update((s) => ({
				...s,
				dailyHour: 5,
				weeklyHour: 5,
				showBattlePass: true
			}));
		} catch (e) {
			// ignore
		}

		if (!(window as any).__yanyun_checklist_countdown_id) {
			const update = () => {
				const now = Date.now();
				const s = $countdownSettings;

				// daily / weekly using configurable hours
				let nextDaily = getNextDailyReset(s.dailyHour ?? 5).getTime();
				if (nextDaily <= now) nextDaily = getNextDailyReset(s.dailyHour ?? 5).getTime();
				let nextWeekly = getNextWeeklyReset(s.weeklyHour ?? 5).getTime();
				if (nextWeekly <= now) nextWeekly = getNextWeeklyReset(s.weeklyHour ?? 5).getTime();

				dailyCountdown = formatDurationMs(nextDaily - now);
				weeklyCountdown = formatDurationMs(nextWeekly - now);
				dailyNextLabel = formatNextResetLabel(new Date(nextDaily), false);
				weeklyNextLabel = formatNextResetLabel(new Date(nextWeekly), true);

				// Battle pass & Heming: annual on Dec 12 at configured visibility
				if (s.showBattlePass) {
					const nextBattle = getNextAnnual(12, 12, 5, 0).getTime();
					battlePassCountdown = formatDurationMs(nextBattle - now);
					battlePassLabel = formatNextResetLabel(new Date(nextBattle), true);
				}

				if (s.showHeming) {
					const nextHeming = getNextAnnual(12, 12, 5, 0).getTime();
					hemingCountdown = formatDurationMs(nextHeming - now);
					hemingLabel = formatNextResetLabel(new Date(nextHeming), true);
				}

				// Seasonal shop: fixed datetime 2026-02-05 18:30
				if (s.showSeasonalShop) {
					const seasonal = getFixedDateTime(2026, 2, 5, 18, 30).getTime();
					seasonalShopCountdown = formatDurationMs(seasonal - now);
					seasonalShopLabel = formatNextResetLabel(new Date(seasonal), true);
				}

				// Friday market: weekly Friday at configured hour
				if (s.showFridayMarket) {
					const nextFriday = getNextWeeklyForWeekday(5, s.weeklyHour ?? 5, 0).getTime();
					fridayMarketCountdown = formatDurationMs(nextFriday - now);
					fridayMarketLabel = formatNextResetLabel(new Date(nextFriday), true);
				}
			};

			update();
			const id = setInterval(update, 1000);
			(window as any).__yanyun_checklist_countdown_id = id;
		}
	}

	function requestResetDaily() {
		pendingReset = 'daily';
		modalTitle = '重置每日項目';
		modalMessage = '確定要重置「每日」項目嗎？這會清除每日已勾選狀態與每日計數器。';
		clearHidden = false;
		modalOpen = true;
	}

	function requestResetWeekly() {
		pendingReset = 'weekly';
		modalTitle = '重置每週項目';
		modalMessage = '確定要重置「每週」項目嗎？這會清除每週已勾選狀態。';
		clearHidden = false;
		modalOpen = true;
	}

	function requestResetAll() {
		pendingReset = 'all';
		modalTitle = '全部重置';
		modalMessage =
			'確定要全部重置嗎？這會清除每日/每週已勾選狀態、計數器與追蹤次數。\n選擇下方選項可同時還原已隱藏項目。';
		clearHidden = false;
		modalOpen = true;
	}

	function onModalConfirm() {
		if (pendingReset === 'daily') {
			logic.resetDaily();
			showToast('已重置每日項目');
		} else if (pendingReset === 'weekly') {
			logic.resetWeekly();
			showToast('已重置每週項目');
		} else if (pendingReset === 'all') {
			logic.resetAll({ clearHidden });
			showToast('已全部重置');
		}

		pendingReset = null;
		modalOpen = false;
	}

	function onModalCancel() {
		pendingReset = null;
		modalOpen = false;
	}

	const groupedDaily: Array<{ key: string; title: string; items: ChecklistTask[] }> = $derived.by(
		() => {
			// read $hiddenTasks to ensure this derived re-runs when hidden list changes
			const _h = $hiddenTasks;
			return dailyGroups.map((group) => ({
				...group,
				items: checklistData.daily.filter(
					(item) => (item.category || 'core') === group.key && logic.isTaskVisible(item)
				)
			}));
		}
	);

	const isPartyDay = $baiyeSettings.days.includes(today);

	const visibleDailyTasks = $derived.by(() => {
		// reference $hiddenTasks so this derived updates when items are hidden/unhidden
		const _h = $hiddenTasks;
		return logic.getVisibleDailyTasks();
	});
	const dailyProgress = $derived({
		current: $checklistState.daily.length,
		total: visibleDailyTasks.length
	});
	const weeklyProgress = $derived({
		current: $checklistState.weekly.length,
		total: checklistData.weekly.reduce(
			(acc, t) => acc + (t.type === 'group' && t.subList ? t.subList.length : 1),
			0
		)
	});
</script>

<svelte:head>
	<title>待辦清單 - 燕雲十六聲</title>
</svelte:head>

<div class="flex flex-col h-full overflow-y-auto no-scrollbar p-6 gap-8 max-w-7xl mx-auto w-full">
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
				<button class="btn btn-reset" onclick={requestResetAll}>全部重置</button>
			</div>
		</div>

		<!-- Timers (styled card placed under header) -->
		<div class="app-card p-4">
			<div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
				<div class="flex items-center gap-4 md:min-w-[200px]">
					<div
						class="w-10 h-10 rounded-lg bg-linear-to-br from-(--accent-primary) to-[#c8453f] flex items-center justify-center text-white"
					>
						⏱
					</div>
					<div>
						<div class="text-sm font-semibold">倒數計時</div>
						<div class="text-xs text-(--text-muted)">活動日期</div>
					</div>
				</div>
				<div
					class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 flex-1 w-full min-w-0"
				>
					<div class="flex flex-col items-start sm:items-end p-2 min-w-0">
						<div class="text-xs text-(--text-muted)">下次每日</div>
						<div class="tabular-nums text-lg font-semibold text-(--accent-primary)">
							{dailyCountdown}
						</div>
						<div class="text-xs text-(--text-muted)">({dailyNextLabel})</div>
					</div>
					<div class="flex flex-col items-start sm:items-end p-2 min-w-0">
						<div class="text-xs text-(--text-muted)">下次每週</div>
						<div class="tabular-nums text-lg font-semibold text-(--accent-primary)">
							{weeklyCountdown}
						</div>
						<div class="text-xs text-(--text-muted)">({weeklyNextLabel})</div>
					</div>
					{#if $countdownSettings.showBattlePass}
						<div class="flex flex-col items-start sm:items-end p-2 min-w-0">
							<div class="text-xs text-(--text-muted)">戰令</div>
							<div class="tabular-nums text-lg font-semibold text-(--accent-primary)">
								{battlePassCountdown}
							</div>
							<div class="text-xs text-(--text-muted)">({battlePassLabel})</div>
						</div>
					{/if}
					{#if $countdownSettings.showHeming}
						<div class="flex flex-col items-start sm:items-end p-2 min-w-0">
							<div class="text-xs text-(--text-muted)">和鳴</div>
							<div class="tabular-nums text-lg font-semibold text-(--accent-primary)">
								{hemingCountdown}
							</div>
							<div class="text-xs text-(--text-muted)">({hemingLabel})</div>
						</div>
					{/if}
					{#if $countdownSettings.showSeasonalShop}
						<div class="flex flex-col items-start sm:items-end p-2 min-w-0">
							<div class="text-xs text-(--text-muted)">免肝商店 (賽季)</div>
							<div class="tabular-nums text-lg font-semibold text-(--accent-primary)">
								{seasonalShopCountdown}
							</div>
							<div class="text-xs text-(--text-muted)">({seasonalShopLabel})</div>
						</div>
					{/if}
					{#if $countdownSettings.showFridayMarket}
						<div class="flex flex-col items-start sm:items-end p-2 min-w-0">
							<div class="text-xs text-(--text-muted)">市買司（週五）</div>
							<div class="tabular-nums text-lg font-semibold text-(--accent-primary)">
								{fridayMarketCountdown}
							</div>
							<div class="text-xs text-(--text-muted)">({fridayMarketLabel})</div>
						</div>
					{/if}
				</div>
				<!-- settings button -->
				<div class="ml-4">
					<button class="btn btn-invert" onclick={() => (settingsOpen = true)}>設定</button>
				</div>
			</div>
		</div>

		<SettingsModal bind:open={settingsOpen} />

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
	<TaskSection title="每日任務">
		{#snippet actions()}
			<div class="flex items-center">
				<button class="btn btn-reset btn-press" aria-label="重置每日" onclick={requestResetDaily}
					>重置每日</button
				>
			</div>
		{/snippet}
		{#snippet children()}
			<div class="flex flex-col gap-6">
				{#each groupedDaily as group}
					{#if group.items.length}
						<div class="flex flex-col gap-3">
							<div class="card-section-title px-0 pt-0">{group.title}</div>
							<div
								class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-[1fr] gap-3 md:gap-4"
							>
								{#each group.items as item}
									{#if item.type === 'counter'}
										<CounterCard
											{item}
											count={$countsState[item.id] || 0}
											onIncrement={() => logic.incrementCounter(item.id, item.max ?? 1)}
											onToggle={(i) => logic.toggleCounter(item.id, i)}
											onReset={() => logic.resetCounter(item.id)}
										/>
									{:else}
										<TaskCard
											{item}
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
	<TaskSection title="每週任務">
		{#snippet actions()}
			<div class="flex items-center">
				<button class="btn btn-reset btn-press" aria-label="重置每週" onclick={requestResetWeekly}
					>重置每週</button
				>
			</div>
		{/snippet}
		{#snippet children()}
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
				<!-- 左側：商店必買清單 (群組卡) -->
				<div class="grid grid-cols-1 auto-rows-[1fr] gap-3 md:gap-4">
					{#each checklistData.weekly.filter((i) => i.type === 'group') as item}
						<WeeklyGroupCard
							{item}
							activeIds={$checklistState.weekly}
							onToggle={(id) => logic.toggleTask('weekly', id)}
						/>
					{/each}
				</div>

				<!-- 右側：其他每週項目 -->
				<div class="grid grid-cols-1 sm:grid-cols-2 auto-rows-[1fr] gap-3 md:gap-4">
					{#each checklistData.weekly.filter((i) => i.type !== 'group') as item}
						<TaskCard
							{item}
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

	<ConfirmModal
		bind:open={modalOpen}
		title={modalTitle}
		message={modalMessage}
		confirmLabel="確認"
		cancelLabel="取消"
		on:confirm={onModalConfirm}
		on:cancel={onModalCancel}
	>
		{#if pendingReset === 'all'}
			<div class="mt-3">
				<label class="flex items-center gap-2">
					<input type="checkbox" bind:checked={clearHidden} />
					<span class="text-(--text-secondary)">同時還原已隱藏項目</span>
				</label>
			</div>
		{/if}
	</ConfirmModal>
</div>

<!-- debug panel removed in refactor -->
