<script lang="ts">
	import { skinCollections } from '$lib/data/skins';
	import { tick } from 'svelte';
	import type { SkinItem } from '$lib/types';
	import SkinCard from '$lib/components/skins/SkinCard.svelte';

	let current = $state(skinCollections[0]?.title ?? '');
	let focusItem = $state<SkinItem | null>(null);
	let lastFocused: HTMLElement | null = null;
	let closeBtn = $state<HTMLElement | null>(null);
	const currentGroup = $derived(skinCollections.find((g) => g.title === current));
	let query = $state('');
	let compactView = $state(false);
	const viewGender: 'male' | 'female' = 'male';
	const filteredItems = $derived(
		currentGroup
			? currentGroup.items.filter((i) => i.name.toLowerCase().includes(query.toLowerCase()))
			: []
	);

	const tagStyles: Record<string, string> = {
		直購: 'bg-(--accent-primary)/12 text-(--accent-primary)',
		戰令: 'bg-(--accent-secondary)/14 text-(--accent-secondary)',
		和鳴: 'bg-(--accent-cyan)/14 text-(--accent-cyan)'
	};
	function openLightbox(item: SkinItem) {
		lastFocused = document.activeElement as HTMLElement | null;
		focusItem = item;
		tick().then(() => closeBtn?.focus());
	}

	function closeLightbox() {
		focusItem = null;
		tick().then(() => lastFocused?.focus());
	}

	function resolveImageForItem(item: SkinItem, gender: 'male' | 'female') {
		if (!item) return null;
		if (gender === 'male' && typeof item.imageMale === 'string' && item.imageMale.trim() !== '')
			return item.imageMale;
		if (
			gender === 'female' &&
			typeof item.imageFemale === 'string' &&
			item.imageFemale.trim() !== ''
		)
			return item.imageFemale;
		if (typeof item.image === 'string' && item.image.trim() !== '') return item.image;
		const hasAnyExplicit =
			(typeof item.imageMale === 'string' && item.imageMale.trim() !== '') ||
			(typeof item.imageFemale === 'string' && item.imageFemale.trim() !== '') ||
			(typeof item.image === 'string' && item.image.trim() !== '');
		if (!hasAnyExplicit) {
			return `/images/skins/${item.tag}/${item.id}-${gender}.jpg`;
		}
		return null;
	}
</script>

<svelte:window on:keydown={(e) => e.key === 'Escape' && closeLightbox()} />

<svelte:head>
	<title>外觀圖鑑 - 燕雲十六聲</title>
</svelte:head>

<div class="page">
	<section class="hero app-card">
		<div>
			<p class="hero-kicker">COSMETIC CATALOG</p>
			<h1 class="hero-title">外觀圖鑑</h1>
			<p class="hero-sub">收錄限時、戰令、奇貨與坐騎外觀。</p>
		</div>
		<a href="/" class="btn-invert">⬅️ 回首頁</a>
	</section>

	<section class="catalog">
		<aside class="catalog-nav app-card">
			<h3 class="nav-title">分類</h3>
			<div class="nav-list">
				{#each skinCollections as group (group.title)}
					<button
						class={`category-btn ${current === group.title ? 'active' : ''}`}
						onclick={() => (current = group.title)}
						aria-current={current === group.title}
					>
						<div>
							<div class="category-name">{group.title}</div>
							<p class="category-desc">{group.desc}</p>
						</div>
						<span class="badge mini">{group.items.length}</span>
					</button>
				{/each}
			</div>
		</aside>

		<div class="catalog-content">
			{#if currentGroup}
				<article class="collection-card app-card">
					<header class="collection-header">
						<div>
							<p class="collection-tag">{currentGroup.title}</p>
							<h2 class="collection-title">{currentGroup.desc}</h2>
						</div>
						<div class="collection-header-actions">
							<div class="header-meta">
								<span class="badge">{currentGroup.items.length} 件</span>
								<button
									class={`btn small ${compactView ? 'active' : ''}`}
									onclick={() => (compactView = !compactView)}
									aria-pressed={compactView}
								>
									小圖
								</button>
							</div>
							<input
								class="search-input"
								placeholder="搜尋外觀名稱"
								bind:value={query}
								aria-label="搜尋外觀"
							/>
						</div>
					</header>
					<div class={`items-grid ${compactView ? 'compact' : ''}`}>
						{#if filteredItems.length === 0}
							<div class="no-results app-card">沒有符合的外觀</div>
						{:else}
							{#each filteredItems as item (item.id)}
								<SkinCard
									{item}
									onOpen={(i) => openLightbox(i)}
									tagClass={tagStyles[item.tag] ?? 'bg-(--bg-tertiary) text-(--text-secondary)'}
									size={compactView ? 'compact' : 'normal'}
								/>
							{/each}
						{/if}
					</div>
				</article>
			{/if}
		</div>
	</section>

	{#if focusItem}
		<div
			class="lightbox"
			role="dialog"
			aria-modal="true"
			aria-label={`${focusItem.name} 預覽`}
			tabindex="0"
			onclick={(e) => {
				if (e.target === e.currentTarget) closeLightbox();
			}}
			onkeydown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					closeLightbox();
				}
			}}
		>
			<div class="lightbox-body app-card" role="document">
				<button
					class="lightbox-close"
					type="button"
					aria-label="關閉預覽"
					onclick={closeLightbox}
					bind:this={closeBtn}
				>
					✕
				</button>
				<div class="lightbox-thumb" aria-label={`${focusItem.name} 預覽`}>
					{#if resolveImageForItem(focusItem, viewGender)}
						<img
							src={resolveImageForItem(focusItem, viewGender)}
							alt={focusItem.alt ?? focusItem.name}
							class="thumb-img"
						/>
					{:else}
						<div class="thumb-label">{focusItem.name.slice(0, 2)}</div>
						<div class="thumb-hint">圖片預留</div>
					{/if}
				</div>
				<div class="lightbox-meta">
					<h3>{focusItem.name}</h3>
					<p class="meta-source">來源：{focusItem.source}</p>
					<span
						class={`item-tag ${tagStyles[focusItem.tag] ?? 'bg-(--bg-tertiary) text-(--text-secondary)'}`}
						>{focusItem.tag}</span
					>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.page {
		max-width: 1080px;
		margin: 0 auto;
		padding: 1.5rem 1rem 2.5rem;
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.hero {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		padding: 1.5rem;
	}

	.hero-kicker {
		margin: 0;
		font-size: 0.75rem;
		letter-spacing: 0.14em;
		font-weight: 800;
		color: var(--accent-primary);
	}

	.hero-title {
		margin: 0.35rem 0 0.35rem;
		font-size: 2rem;
		font-weight: 900;
		color: var(--text-primary);
	}

	.hero-sub {
		margin: 0;
		color: var(--text-secondary);
		font-size: 0.98rem;
	}

	.catalog {
		display: grid;
		grid-template-columns: 320px 1fr;
		gap: 1rem;
		align-items: start;
	}

	.catalog-nav {
		padding: 1rem;
		position: sticky;
		top: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.nav-title {
		margin: 0;
		font-size: 0.95rem;
		color: var(--text-secondary);
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.nav-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.category-btn {
		width: 100%;
		border: 1px solid var(--card-border);
		border-radius: 0.85rem;
		padding: 0.75rem 0.85rem;
		background: var(--card-bg);
		color: var(--text-primary);
		display: flex;
		justify-content: space-between;
		align-items: center;
		text-align: left;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.category-btn:hover {
		border-color: var(--accent-primary);
		transform: translateX(2px);
	}

	.category-btn.active {
		border-color: var(--accent-primary);
		box-shadow: 0 6px 18px -12px var(--card-shadow);
	}

	.category-name {
		font-weight: 800;
		font-size: 1rem;
		margin: 0;
	}

	.category-desc {
		margin: 0.2rem 0 0;
		font-size: 0.9rem;
		color: var(--text-secondary);
	}

	.catalog-content {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.collection-card {
		padding: 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 0.9rem;
	}

	.collection-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 0.75rem;
		flex-wrap: wrap;
	}

	.collection-header-actions {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		flex-wrap: wrap;
		justify-content: flex-end;
		width: 100%;
	}

	.header-meta {
		display: flex;
		align-items: center;
		gap: 0.6rem;
	}

	.collection-tag {
		margin: 0;
		font-size: 0.85rem;
		font-weight: 800;
		letter-spacing: 0.08em;
		color: var(--accent-secondary);
	}

	.collection-title {
		margin: 0.2rem 0 0;
		font-size: 1.15rem;
		color: var(--text-primary);
		font-weight: 800;
	}

	.badge {
		padding: 0.35rem 0.7rem;
		border-radius: 999px;
		background: color-mix(in srgb, var(--accent-primary) 12%, var(--card-bg));
		border: 1px solid var(--card-border);
		color: var(--text-primary);
		font-size: 0.85rem;
		font-weight: 700;
	}

	.items-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
		gap: 0.75rem;
	}
	.items-grid.compact {
		grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
		gap: 0.65rem;
	}

	.collection-actions {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		margin-bottom: 0.6rem;
	}

	.search-input {
		padding: 0.45rem 0.6rem;
		border-radius: 0.65rem;
		border: 1px solid var(--card-border);
		background: var(--card-bg);
		color: var(--text-primary);
		min-width: 220px;
		font-size: 0.95rem;
	}

	.no-results {
		padding: 1rem;
		text-align: center;
		color: var(--text-secondary);
	}

	/* Shared item & lightbox styles moved to `src/routes/layout.css` */

	@media (max-width: 960px) {
		.catalog {
			grid-template-columns: 1fr;
		}

		.catalog-nav {
			position: static;
		}
	}

	@media (max-width: 640px) {
		.hero {
			flex-direction: column;
			align-items: flex-start;
		}

		.hero-title {
			font-size: 1.6rem;
		}

		.collection-card {
			padding: 1rem;
		}

		.items-grid {
			grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
		}

		.category-btn {
			align-items: flex-start;
		}
	}
</style>
