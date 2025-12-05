<script lang="ts">
	import { page } from '$app/stores';
	import { resourceData } from '$lib/data/resources';

	const query = $derived($page.url.searchParams.get('q') || '');
	const results = $derived(
		query
			? resourceData.filter(
					(item) =>
						item.title.toLowerCase().includes(query.toLowerCase()) ||
						item.content.toLowerCase().includes(query.toLowerCase())
				)
			: []
	);
</script>

<svelte:head>
	<title>搜尋結果：{query} - 燕雲十六聲</title>
</svelte:head>

<div class="page-header">
	<a href="/" class="home-btn">⬅️ 回首頁</a>
	<div class="page-title">搜尋：{query}</div>
</div>

{#if results.length === 0}
	<div style="text-align:center; padding:2.5rem; color:#999;">
		<div style="font-size:3rem; margin-bottom:1rem;">🔍</div>
		<div style="font-size:1.125rem; font-weight:bold; margin-bottom:0.5rem;">找不到相關內容</div>
		<div style="font-size:0.875rem;">請嘗試其他關鍵字</div>
	</div>
{:else}
	<div style="margin-bottom:1rem; padding:0.75rem; background:#f0f2f5; border-radius:0.5rem;">
		找到 <strong>{results.length}</strong> 個結果
	</div>

	{#each results as item}
		{@const searchUrl = `https://www.google.com/search?tbm=isch&q=燕雲十六聲+${encodeURIComponent(item.title)}`}
		<div class="item-card border-{item.category}">
			<div class="card-main">
				<div class="card-header">
					<div class="card-title">{item.title}</div>
					<div class="badges">
						{#if item.tag}
							<span class="badge badge-type">{item.tag}</span>
						{/if}
					</div>
				</div>
				<div class="card-content">
					{#if item.content}
						<div>{item.content}</div>
					{/if}
					{#if item.location}
						<div class="info-row">
							<span class="info-label">地點</span>
							<span class="info-val">{item.location}</span>
						</div>
					{/if}
				</div>
			</div>
			{#if item.note}
				<div class="note-box">💡 {item.note}</div>
			{/if}
			<div class="action-bar">
				<a href={searchUrl} target="_blank" rel="noopener noreferrer" class="img-link">
					🔍 搜圖
				</a>
			</div>
		</div>
	{/each}
{/if}

<style>
	.home-btn {
		text-decoration: none;
	}
</style>
