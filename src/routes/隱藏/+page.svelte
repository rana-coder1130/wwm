<script lang="ts">
	import { checklistData } from '$lib/data/checklist';
	import { hiddenTasks } from '$lib/stores';
	import { get } from 'svelte/store';
	import ConfirmModal from '$lib/components/ConfirmModal.svelte';
	import { showToast } from '$lib/utils/toast';
	import { goto } from '$app/navigation';

	let confirmAll = false;

	// derived lists for display
	type HiddenDef = { id: string; text: string; sub?: string; kind: string; parent?: string };

	function getHiddenDefs(): HiddenDef[] {
		const hidden = get(hiddenTasks) || [];
		const defs = hidden
			.map((id) => {
				const d = checklistData.daily.find((t) => t.id === id);
				if (d) return { id: d.id, text: d.text, sub: d.sub, kind: 'daily' } as HiddenDef;
				const w = checklistData.weekly.find((t) => t.id === id);
				if (w) return { id: w.id, text: w.text, sub: w.sub, kind: 'weekly' } as HiddenDef;
				// try weekly groups
				for (const g of checklistData.weekly.filter((i) => i.type === 'group')) {
					const sub = g.subList?.find((s) => s.id === id);
					if (sub)
						return {
							id: sub.id,
							text: sub.text,
							sub: sub.sub,
							kind: 'weekly',
							parent: g.text
						} as HiddenDef;
				}
				return { id, text: id, sub: '', kind: 'unknown' } as HiddenDef;
			})
			.filter(Boolean) as HiddenDef[];
		return defs;
	}

	function unhideOne(id: string) {
		const cur = get(hiddenTasks) || [];
		hiddenTasks.set(cur.filter((h) => h !== id));
		showToast('已還原項目');
	}

	function confirmRestoreAll() {
		confirmAll = true;
	}

	function onConfirmAll() {
		hiddenTasks.set([]);
		showToast('已還原所有隱藏項目');
		confirmAll = false;
	}

	function onCancelAll() {
		confirmAll = false;
	}
</script>

<svelte:head>
	<title>隱藏項目 - 燕雲十六聲</title>
</svelte:head>

<div class="app-card max-w-3xl mx-auto p-6">
	<div class="flex items-center justify-between">
		<h2 class="card-title">隱藏的項目</h2>
		<div class="flex items-center gap-2">
			<a href="/待辦清單" class="btn-invert">回到待辦清單</a>
			<button class="btn btn-reset" on:click={confirmRestoreAll} aria-label="還原全部隱藏項目"
				>還原全部</button
			>
		</div>
	</div>

	{#if (get(hiddenTasks) || []).length === 0}
		<div class="mt-6 text-(--text-muted)">目前沒有已隱藏的項目。</div>
	{:else}
		<div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
			{#each getHiddenDefs() as item}
				<div class="app-card p-3 flex items-start justify-between">
					<div>
						<div class="font-medium">{item.text}</div>
						{#if item.sub}
							<div class="text-xs text-(--text-muted)">{item.sub}</div>
						{/if}
						{#if item.parent}
							<div class="text-xs text-(--text-muted)">來源：{item.parent}</div>
						{/if}
					</div>
					<div class="flex items-center gap-2">
						<button class="btn" on:click={() => unhideOne(item.id)}>還原</button>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<ConfirmModal
	open={confirmAll}
	title="還原所有隱藏項目"
	message="確定要將所有已隱藏項目還原嗎？"
	confirmLabel="還原"
	cancelLabel="取消"
	on:confirm={onConfirmAll}
	on:cancel={onCancelAll}
/>
