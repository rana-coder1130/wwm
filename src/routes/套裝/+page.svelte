<script lang="ts">
	import { gearData } from '$lib/data/build';
	import { onMount } from 'svelte';

	let selectedGear = $state<string | null>(null);

	onMount(() => {
		const hash = window.location.hash.slice(1);
		if (hash && gearData[hash]) {
			selectedGear = hash;
		}
	});

	function showGearDetail(name: string) {
		selectedGear = name;
		window.location.hash = name;
	}

	function closeModal() {
		selectedGear = null;
		window.location.hash = '';
	}
</script>

<svelte:head>
	<title>全套裝圖鑑 - 燕雲十六聲</title>
</svelte:head>

<div class="page-header">
	<a href="/" class="home-btn">⬅️ 回首頁</a>
	<div class="page-title">全套裝圖鑑</div>
</div>

<div style="display:flex; flex-direction:column; gap:0.625rem;">
	{#each Object.entries(gearData) as [name, gear]}
		<button class="item-card" onclick={() => showGearDetail(name)} style="cursor:pointer;">
			<div class="card-main">
				<div class="card-header">
					<div class="card-title">{name}</div>
					<span class="badge badge-type">{gear.type}</span>
				</div>
				<div style="font-size:0.75rem; color:#888;">📍 {gear.drop}</div>
			</div>
		</button>
	{/each}
</div>

<!-- Modal -->
{#if selectedGear && gearData[selectedGear]}
	{@const gear = gearData[selectedGear]}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="modal active" onclick={closeModal}>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="modal-content" onclick={(e) => e.stopPropagation()}>
			<div class="modal-header">
				<div class="modal-title">{selectedGear}</div>
				<button class="modal-close" onclick={closeModal}>×</button>
			</div>
			<div class="modal-body">
				<div style="margin-bottom:0.625rem;">
					<span class="badge badge-type">{gear.type}</span>
				</div>
				<div style="color:#666; font-size:0.8125rem; margin-bottom:0.9375rem;">
					📍 掉落：{gear.drop}
				</div>
				<div
					style="background:#f9f9f9; padding:0.625rem; border-radius:0.5rem; margin-bottom:0.625rem;"
				>
					<div style="font-weight:bold; color:#2c3e50; font-size:0.875rem;">2件套效果</div>
					<div style="font-size:0.8125rem; color:#555;">{gear.p2}</div>
				</div>
				<div style="background:#f9f9f9; padding:0.625rem; border-radius:0.5rem;">
					<div style="font-weight:bold; color:#2c3e50; font-size:0.875rem;">4件套效果</div>
					<div style="font-size:0.8125rem; color:#555;">{gear.p4}</div>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.home-btn {
		text-decoration: none;
	}

	.item-card {
		background: none;
		border: none;
		padding: 0;
		text-align: left;
		width: 100%;
	}

	.modal-close {
		background: none;
		border: none;
		color: inherit;
		font: inherit;
		cursor: pointer;
	}
</style>
