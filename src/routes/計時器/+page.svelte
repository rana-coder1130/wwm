<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { timerItems } from '$lib/data/timer';
	import { timerState } from '$lib/stores';

	let timers = $state($timerState);
	let intervalId: number | null = null;
	let currentTime = $state(Date.now());

	const groups: Record<string, typeof timerItems> = {
		奇術: [],
		疊音: [],
		天工: []
	};

	timerItems.forEach((item) => {
		if (groups[item.cat]) groups[item.cat].push(item);
	});

	function startTimer(id: string) {
		timers[id] = Date.now() + 24 * 60 * 60 * 1000;
		timerState.set(timers);
	}

	function resetTimer(id: string) {
		delete timers[id];
		timerState.set(timers);
	}

	function formatTime(ms: number): string {
		if (ms <= 0) return '可採集';
		const h = Math.floor(ms / 3600000);
		const m = Math.floor((ms % 3600000) / 60000);
		return `剩餘 ${h} 小時 ${m} 分鐘`;
	}

	onMount(() => {
		intervalId = setInterval(() => {
			currentTime = Date.now();
		}, 60000) as unknown as number;
	});

	onDestroy(() => {
		if (intervalId) clearInterval(intervalId);
	});
</script>

<svelte:head>
	<title>採集計時器 - 燕雲十六聲</title>
</svelte:head>

<div class="page-header">
	<a href="/" class="home-btn">⬅️ 回首頁</a>
	<div class="page-title">採集計時器</div>
</div>

<div class="note-box" style="margin-bottom:0.9375rem;">💡 稀有材料 24h 刷新。</div>

{#each Object.entries(groups) as [cat, items]}
	{#if items.length > 0}
		<div class="timer-group">
			<div class="timer-group-title">{cat}材料</div>
			{#each items as item}
				{@const target = timers[item.id]}
				{@const isCooling = target && target > currentTime}
				<div class="timer-card {isCooling ? 'cooldown' : 'ready'}">
					<div class="timer-info">
						<div class="timer-name">{item.name}</div>
						<span class="timer-source">來源: {item.source}</span>
						{#if isCooling}
							<div class="timer-time">{formatTime(target - currentTime)}</div>
						{:else if target}
							<div class="timer-status">✅ 可採集</div>
						{/if}
					</div>
					<div>
						{#if isCooling}
							<button class="timer-btn btn-reset" onclick={() => resetTimer(item.id)}>
								重置
							</button>
						{:else}
							<button class="timer-btn btn-gather" onclick={() => startTimer(item.id)}>
								已採集
							</button>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	{/if}
{/each}

<div style="height:2.5rem;"></div>

<style>
	.home-btn {
		text-decoration: none;
	}

	.timer-btn {
		cursor: pointer;
	}
</style>
