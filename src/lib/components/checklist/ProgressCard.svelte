<script lang="ts">
	let { label, current, total } = $props<{
		label: string;
		current: number;
		total: number;
	}>();

	const percentage = $derived(total === 0 ? 0 : Math.round((current / total) * 100));
</script>

<div
	class="bg-(--card-bg)/90 backdrop-blur-xl border border-(--card-border) rounded-xl p-4 flex flex-col gap-3 transition-colors duration-300"
>
	<div class="text-sm text-(--text-secondary) font-semibold">{label}</div>
	<div class="h-1.5 bg-(--bg-tertiary) rounded-full overflow-hidden">
		<div
			class="h-full bg-linear-to-r from-(--accent-primary) to-(--accent-secondary) rounded-full transition-all duration-300"
			style="width: {percentage}%"
		></div>
	</div>
	<div class="text-xs text-(--text-secondary) text-right font-medium">
		{current}/{total}
	</div>
</div>
