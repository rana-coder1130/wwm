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
				<div style="color:#999;font-size:0.8125rem;">無特定推薦</div>
			{/if}
		</div>
	</div>

	<div class="note-box" style="margin-top:0.9375rem;">💡 提示：此為畢業級配置。</div>
</div>

<style>
	.btn-invert,
	.gear-card {
		text-decoration: none;
	}

	.style-btn,
	.branch-btn {
		cursor: pointer;
	}

	.branch-title {
		font-size: 0.875rem;
		font-weight: 700;
		color: #555;
		margin-bottom: 0.625rem;
	}
</style>
