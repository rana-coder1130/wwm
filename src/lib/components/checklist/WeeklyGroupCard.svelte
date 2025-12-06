<script lang="ts">
	import type { ChecklistTask } from '$lib/types';
	import Checkbox from '$lib/components/checklist/Checkbox.svelte';

	let { item, activeIds, onToggle } = $props<{
		item: ChecklistTask;
		activeIds: string[];
		onToggle: (id: string) => void;
	}>();

	type GroupedSubList = { label: string; items: ChecklistTask[] };

	const groupedList = $derived(
		(() => {
			const map = new Map<string, GroupedSubList>();

			(item.subList || []).forEach((sub: ChecklistTask) => {
				const match = sub.text.match(/^【([^】]+)】\s*(.*)$/);
				const label = match?.[1] || '其他';
				const display = (match?.[2] || sub.text).trim();

				if (!map.has(label)) {
					map.set(label, { label, items: [] });
				}

				const entry = map.get(label);
				if (entry) {
					entry.items.push({ ...sub, text: display });
				}
			});

			return Array.from(map.entries()).map(([label, { items }]) => ({ label, items }));
		})()
	);
</script>

<div class="app-card h-full overflow-hidden transition-all duration-200">
	<div class="bg-(--accent-primary)/6 border-b border-(--accent-primary)/15 p-3 md:p-4">
		<div class="card-title m-0">{item.text}</div>
		<div class="card-sub mt-1">{item.sub}</div>
	</div>
	<div class="flex flex-col p-0 divide-y divide-(--accent-primary)/12">
		{#each groupedList as group}
			<div class="flex flex-col">
				<div class="card-section-title px-4 pt-3 pb-2">
					{group.label}
				</div>
				{#each group.items as sub (sub.id)}
					<button
						class={`bg-transparent border-0 py-2.5 px-4 flex items-center gap-2.5 cursor-pointer transition-all duration-200 text-(--text-secondary) text-left font-medium text-base hover:bg-(--accent-primary)/10 hover:text-(--text-primary) ${activeIds.includes(sub.id) ? 'text-(--accent-primary) bg-(--accent-primary)/12 font-bold' : ''}`}
						onclick={() => onToggle(sub.id)}
						title={sub.text}
					>
						<Checkbox checked={activeIds.includes(sub.id)} onToggle={() => onToggle(sub.id)} />
						<span>{sub.text}</span>
					</button>
				{/each}
			</div>
		{/each}
	</div>
</div>
