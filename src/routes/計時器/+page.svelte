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

	function resetAll() {
		timers = {};
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

<div class="timer-page">
	<div class="app-card timer-hero">
		<div>
			<div class="timer-hero-title">採集計時器</div>
			<div class="timer-hero-sub">💡 稀有材料 24h 刷新</div>
		</div>
		<a href="/" class="btn-invert">⬅️ 回首頁</a>
	</div>

	<div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
		<main class="lg:col-span-2">
			{#each Object.entries(groups) as [cat, items]}
				{#if items.length > 0}
					<section class="group-card app-card">
						<header class="group-card-header">
							<div class="group-card-title">{cat} 材料</div>
							<div class="group-card-sub">共 {items.length} 項</div>
						</header>

						<div class="group-grid">
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
					</section>
				{/if}
			{/each}
		</main>

		<aside class="lg:col-span-1">
			<div class="app-card p-4">
				<div class="card-title">計時器總覽</div>
				<div class="card-sub mt-2">總項目：{timerItems.length}</div>
				<div class="card-sub">
					進行中：{Object.values(timers).filter((t) => t > currentTime).length}
				</div>

				<div style="margin-top:1rem; display:flex; gap:0.5rem;">
					<button class="timer-btn btn-reset" onclick={resetAll}>全部重置</button>
				</div>
			</div>
		</aside>
	</div>

	<div style="height:2.5rem;"></div>
</div>

<style>
	/* rely on global .btn-invert in layout.css */

	.timer-page {
		max-width: 1200px;
		margin: 0 auto;
		padding: 1rem 1.25rem 0;
	}

	@media (min-width: 768px) {
		.timer-page {
			padding: 1.5rem 1.75rem 0;
		}
	}

	.timer-hero {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 1.25rem;
		margin-bottom: 1rem;
	}

	.timer-hero-title {
		font-size: 1.5rem;
		font-weight: 800;
		color: var(--text-primary);
		margin-bottom: 0.25rem;
	}

	.timer-hero-sub {
		color: var(--text-secondary);
		font-size: 0.95rem;
	}

	.group-card {
		padding: 0.75rem;
		margin-top: 1rem;
	}

	.group-card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 0.5rem 0 0.5rem;
	}

	.group-card-title {
		font-weight: 700;
		color: var(--text-primary);
	}
	.group-card-sub {
		color: var(--text-secondary);
		font-size: 0.95rem;
	}

	.group-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
		gap: 0.75rem;
		margin-top: 0.5rem;
	}

	.timer-card {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.65rem 0.75rem;
		background: var(--card-bg);
		border-radius: 0.75rem;
		border: 1px solid var(--card-border);
		box-shadow: 0 6px 18px -8px var(--card-shadow);
		gap: 1rem;
		transition:
			background 0.3s ease,
			border 0.3s ease;
	}

	.timer-card.cooldown {
		opacity: 0.98;
	}

	.timer-info {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.timer-name {
		font-weight: 700;
		color: var(--text-primary);
	}

	.timer-source {
		font-size: 0.85rem;
		color: var(--text-secondary);
	}

	.timer-time {
		font-size: 0.95rem;
		color: var(--accent-primary);
		font-weight: 700;
	}

	.timer-status {
		font-size: 0.95rem;
		color: var(--success-color);
		font-weight: 700;
	}

	/* button base */
	.timer-btn {
		padding: 6px 10px;
		border: none;
		border-radius: 8px;
		font-weight: 700;
		font-size: 13px;
		cursor: pointer;
		transition:
			transform 150ms ease,
			box-shadow 150ms ease,
			background 0.3s ease,
			color 0.3s ease;
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}

	/* reset button – neutral inverted hover */
	.btn-reset {
		background: var(--btn-bg);
		color: var(--btn-text);
		box-shadow: 0 4px 10px -6px rgba(0, 0, 0, 0.18);
	}

	.btn-reset:hover {
		color: var(--btn-hover-text);
		background: var(--btn-hover-bg);
		transform: translateY(-2px);
	}

	/* gather/collected button – accent */
	.btn-gather {
		background: color-mix(in srgb, var(--accent-cyan) 85%, var(--card-bg));
		color: white;
	}

	.btn-gather:hover {
		transform: translateY(-2px);
		filter: brightness(0.95);
	}

	@media (max-width: 640px) {
		.timer-card {
			padding: 0.5rem;
		}
		.timer-name {
			font-size: 0.95rem;
		}
		.timer-btn {
			padding: 6px 8px;
			font-size: 12px;
		}
	}
</style>
