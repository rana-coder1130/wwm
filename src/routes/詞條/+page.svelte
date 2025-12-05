<script lang="ts">
	import { affixData } from '$lib/data/build';

	let currentTab = $state<'initial' | 'transfer' | 'rare'>('initial');
</script>

<svelte:head>
	<title>詞條庫 - 燕雲十六聲</title>
</svelte:head>

<div class="page-header">
	<a href="/" class="home-btn">⬅️ 回首頁</a>
	<div class="page-title">詞條庫</div>
</div>

<div class="affix-container">
	<div class="tuning-header">
		<button
			class="tuning-tab {currentTab === 'initial' ? 'active' : ''}"
			onclick={() => (currentTab = 'initial')}
		>
			初始詞條
		</button>
		<button
			class="tuning-tab {currentTab === 'transfer' ? 'active' : ''}"
			onclick={() => (currentTab = 'transfer')}
		>
			轉律庫
		</button>
		<button
			class="tuning-tab {currentTab === 'rare' ? 'active' : ''}"
			onclick={() => (currentTab = 'rare')}
		>
			稀有詞條
		</button>
	</div>

	{#if currentTab === 'initial'}
		<div class="affix-list">
			{#each affixData.initial as item}
				<div class="affix-card">
					<div class="affix-title">🥋 {item.part}</div>
					<div class="affix-row">
						{#each item.priority || [] as priority, index}
							<span class="tag tag-t{index}">{priority}</span>
							{#if index < (item.priority?.length || 0) - 1}
								<span class="prio-arrow" style="color:#ccc;margin:0 0.25rem">></span>
							{/if}
						{/each}
					</div>
				</div>
			{/each}
		</div>
	{:else if currentTab === 'rare'}
		<div class="affix-list">
			{#each affixData.rare as item}
				<div class="affix-card">
					<div class="affix-title">✨ {item.part}</div>
					<div class="rare-desc">{item.effect}</div>
				</div>
			{/each}
		</div>
		<div class="note-box" style="margin-top:0.9375rem;">💡 稀有詞條只會出現在特定位置。</div>
	{:else}
		<div style="text-align:center; padding:2.5rem; color:#999;">
			{affixData.transfer}
		</div>
	{/if}
</div>

<style>
	.home-btn {
		text-decoration: none;
	}

	.tuning-tab {
		background: none;
		border: none;
		font: inherit;
		cursor: pointer;
	}
</style>
