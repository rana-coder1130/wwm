<script lang="ts">
	import type { SkinItem } from '$lib/types';

	let {
		item,
		onOpen,
		size = 'normal',
		tagClass = '',
		gender = 'male'
	} = $props<{
		item: SkinItem;
		onOpen?: (it: SkinItem) => void;
		size?: 'normal' | 'compact';
		tagClass?: string;
		gender?: 'male' | 'female';
	}>();

	const isCompact = $derived(size === 'compact');

	function resolveImage(g: 'male' | 'female') {
		if (g === 'male' && typeof item.imageMale === 'string' && item.imageMale.trim() !== '')
			return item.imageMale;
		if (g === 'female' && typeof item.imageFemale === 'string' && item.imageFemale.trim() !== '')
			return item.imageFemale;
		if (typeof item.image === 'string' && item.image.trim() !== '') return item.image;
		const hasAnyExplicit =
			(typeof item.imageMale === 'string' && item.imageMale.trim() !== '') ||
			(typeof item.imageFemale === 'string' && item.imageFemale.trim() !== '') ||
			(typeof item.image === 'string' && item.image.trim() !== '');
		if (!hasAnyExplicit) {
			return `/images/skins/${item.tag}/${item.id}-${g}.jpg`;
		}
		return '';
	}

	const maleImg = $derived(resolveImage('male'));
	const femaleImg = $derived(resolveImage('female'));

	function handleOpen() {
		onOpen?.(item);
	}
</script>

<div class={`item-card ${isCompact ? 'compact' : ''}`}>
	<div
		class="item-thumb"
		role="button"
		tabindex="0"
		aria-label={`查看 ${item.name}`}
		onclick={handleOpen}
		onkeydown={(e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				handleOpen();
			}
		}}
	>
		{#if maleImg && femaleImg}
			<div class="thumb-row">
				<img src={maleImg} alt={(item.alt ?? item.name) + '（男）'} class="thumb-img" />
				<img src={femaleImg} alt={(item.alt ?? item.name) + '（女）'} class="thumb-img" />
			</div>
		{:else if maleImg || femaleImg}
			<img src={maleImg || femaleImg} alt={item.alt ?? item.name} class="thumb-img" />
		{:else}
			<div class="thumb-label">{item.name.slice(0, 2)}</div>
			<div class="thumb-hint">圖片預留</div>
		{/if}
	</div>
	<div class="info-box">
		<div class="info-top">
			<div class="item-name">{item.name}</div>
			<span class={`item-tag ${tagClass}`}>{item.tag}</span>
		</div>
		<p class="item-source">來源：{item.source}</p>
	</div>
</div>

<style>
	.item-card {
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		gap: 0.6rem;
	}
	.item-card.compact {
		padding: 0.55rem 0.6rem 0.6rem;
	}
	.item-card.compact .item-thumb {
		aspect-ratio: 4 / 3;
		margin-bottom: 0.45rem;
	}
	.item-card.compact .item-name {
		font-size: 0.95rem;
		padding: 0.12rem 0.45rem;
	}
	.item-card.compact .thumb-label {
		font-size: 0.95rem;
	}
	.item-thumb {
		width: 100%;
		aspect-ratio: 4 / 3;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.35rem;
	}

	.thumb-row {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 0.35rem;
		width: 100%;
		height: 100%;
	}

	.thumb-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: 0.75rem;
		border: 1px solid var(--card-border);
	}

	.item-name {
		font-weight: 800;
		color: var(--text-primary);
		font-size: 1rem;
	}

	.info-box {
		border: 1px solid var(--card-border);
		border-radius: 0.75rem;
		padding: 0.55rem 0.65rem;
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		background: color-mix(in srgb, var(--card-bg) 90%, transparent);
	}

	.info-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
	}

	.item-tag {
		padding: 0.2rem 0.65rem;
		border-radius: 999px;
		font-size: 0.8rem;
		font-weight: 800;
		border: 1px solid var(--card-border);
	}

	/* `.item-card`, `.item-thumb`, etc reuse styles from page */
</style>
