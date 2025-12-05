<script lang="ts">
	import { resourceData } from '$lib/data/resources';

	const items = resourceData.filter((item) => item.category === 'resource');
</script>

<svelte:head>
	<title>採集大全 - 燕雲十六聲</title>
</svelte:head>

<div class="page-header">
	<a href="/" class="home-btn">⬅️ 回首頁</a>
	<div class="page-title">採集大全</div>
</div>

{#each items as item}
	{@const searchUrl = `https://www.google.com/search?tbm=isch&q=燕雲十六聲+${encodeURIComponent(item.title)}`}
	<div class="item-card border-resource">
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

<style>
	.home-btn {
		text-decoration: none;
	}
</style>
