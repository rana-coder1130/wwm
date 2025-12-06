<script lang="ts">
	import { buildStyles } from '$lib/data/build';

	let currentStyle = $state('鳴金虹');
	let currentBranch = $state<string | null>(null);

	$effect(() => {
		const style = buildStyles[currentStyle];
		if (style.branches) {
			currentBranch = Object.keys(style.branches)[0];
		} else {
			currentBranch = null;
		}
	});

	function selectStyle(name: string) {
		currentStyle = name;
	}

	function selectBranch(name: string) {
		currentBranch = name;
	}

	const currentRec = $derived.by(() => {
		const style = buildStyles[currentStyle];
		return style.branches && currentBranch ? style.branches[currentBranch] : style.rec || [];
	});
</script>

<svelte:head>
	<title>流派配置器 - 燕雲十六聲</title>
</svelte:head>

<div class="page-header">
	<a href="/" class="btn-invert">⬅️ 回首頁</a>
	<div class="page-title">流派配置器</div>
</div>

<div class="build-container">
	<div class="section-header">
		<div class="section-title">選擇流派 (Style)</div>
	</div>
	<div class="style-grid">
		{#each Object.keys(buildStyles) as styleName}
			<button
				class="style-btn {currentStyle === styleName ? 'active' : ''}"
				onclick={() => selectStyle(styleName)}
			>
				{styleName}
			</button>
		{/each}
	</div>

	{#if buildStyles[currentStyle].branches}
		<div class="branch-section show">
			<div class="branch-title">🔔 分支選擇：</div>
			<div class="branch-btns">
				{#each Object.keys(buildStyles[currentStyle].branches || {}) as branchName}
					<button
						class="branch-btn {currentBranch === branchName ? 'active' : ''}"
						onclick={() => selectBranch(branchName)}
					>
						{branchName}
					</button>
				{/each}
			</div>
		</div>
	{/if}

	<div class="inner-way-section">
		<div class="section-header">
			<div class="section-title">心法選擇</div>
			<div class="section-sub">推薦藍色心法</div>
		</div>
		<div class="inner-way-grid">
			{#each currentRec as innerWay}
				<div class="iw-card active">{innerWay}</div>
			{/each}
		</div>
	</div>

	<div class="gear-section">
		<div class="section-header">
			<div class="section-title">推薦套裝</div>
		</div>
		<div class="gear-grid">
			{#if buildStyles[currentStyle].gear.length > 0}
				{#each buildStyles[currentStyle].gear as gearName}
					<div class="gear-card" aria-label="推薦套裝">🛡️ {gearName}</div>
				{/each}
			{:else}
				<div style="color:var(--text-tertiary);font-size:0.8125rem;">無特定推薦</div>
			{/if}
		</div>
	</div>

	<div class="note-box" style="margin-top:0.9375rem;">💡 提示：此為畢業級配置。</div>
</div>

<style>
	.page-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1.5rem;
		max-width: 80rem;
		margin: 0 auto;
	}

	.page-title {
		font-size: 1.875rem;
		font-weight: 800;
		background: linear-gradient(to right, var(--accent-primary), #c8453f);
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
	}

	.build-container {
		max-width: 80rem;
		margin: 0 auto;
		padding: 0 1.5rem 3rem;
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	.section-title {
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--text-primary);
	}

	.section-sub {
		font-size: 0.875rem;
		color: var(--text-secondary);
	}

	.style-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
		gap: 0.75rem;
	}

	.style-btn {
		padding: 0.75rem 1rem;
		background: var(--card-bg);
		border: 2px solid var(--card-border);
		border-radius: 0.75rem;
		font-weight: 600;
		color: var(--text-primary);
		transition: all 0.2s ease;
		cursor: pointer;
	}

	.style-btn:hover {
		border-color: var(--accent-primary);
		background: color-mix(in srgb, var(--accent-primary) 8%, var(--card-bg));
		transform: translateY(-2px);
	}

	.style-btn.active {
		background: var(--accent-primary);
		color: white;
		border-color: var(--accent-primary);
		box-shadow: 0 4px 12px rgba(212, 48, 47, 0.3);
	}

	.branch-section {
		background: var(--card-bg);
		border: 1px solid var(--card-border);
		border-radius: 1rem;
		padding: 1.25rem;
		display: none;
	}

	.branch-section.show {
		display: block;
	}

	.branch-title {
		font-size: 0.875rem;
		font-weight: 700;
		color: var(--text-secondary);
		margin-bottom: 0.625rem;
	}

	.branch-btns {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.branch-btn {
		padding: 0.5rem 1rem;
		background: var(--bg-tertiary);
		border: 1px solid var(--border-color);
		border-radius: 0.5rem;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-primary);
		transition: all 0.2s ease;
		cursor: pointer;
	}

	.branch-btn:hover {
		background: color-mix(in srgb, var(--accent-secondary) 15%, var(--bg-tertiary));
		border-color: var(--accent-secondary);
	}

	.branch-btn.active {
		background: var(--accent-secondary);
		color: white;
		border-color: var(--accent-secondary);
	}

	.inner-way-section,
	.gear-section {
		display: flex;
		flex-direction: column;
	}

	.inner-way-grid,
	.gear-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
		gap: 0.75rem;
	}

	.iw-card {
		padding: 1rem;
		background: var(--card-bg);
		border: 2px solid var(--card-border);
		border-radius: 0.75rem;
		text-align: center;
		font-weight: 600;
		color: var(--text-secondary);
		transition: all 0.2s ease;
	}

	.iw-card.active {
		border-color: var(--accent-cyan);
		background: color-mix(in srgb, var(--accent-cyan) 12%, var(--card-bg));
		color: var(--accent-cyan);
	}

	.gear-card {
		padding: 1rem;
		background: var(--card-bg);
		border: 2px solid var(--card-border);
		border-radius: 0.75rem;
		text-align: center;
		font-weight: 600;
		color: var(--text-primary);
		transition: all 0.2s ease;
		text-decoration: none;
	}

	.gear-card:hover {
		border-color: var(--accent-primary);
		transform: translateY(-2px);
		box-shadow: 0 4px 12px var(--card-shadow);
	}

	.note-box {
		background: color-mix(in srgb, var(--accent-secondary) 10%, var(--card-bg));
		border: 1px solid color-mix(in srgb, var(--accent-secondary) 30%, transparent);
		border-radius: 0.75rem;
		padding: 1rem;
		font-size: 0.875rem;
		color: var(--text-primary);
		text-align: center;
	}

	@media (max-width: 640px) {
		.page-header {
			padding: 1rem;
		}

		.page-title {
			font-size: 1.5rem;
		}

		.build-container {
			padding: 0 1rem 2rem;
		}

		.style-grid,
		.inner-way-grid,
		.gear-grid {
			grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
		}
	}
</style>
