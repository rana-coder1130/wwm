<script lang="ts">
	import type { ChecklistTask } from '$lib/types';

	let { title, children, actions } = $props<{
		title: string;
		children: any;
		actions?: any;
	}>();
</script>

<div
	class="bg-(--card-bg)/90 backdrop-blur-xl border border-(--card-border) rounded-2xl p-3 md:p-5 flex flex-col gap-3 shadow-sm transition-colors duration-300 anim-fade-up"
>
	<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
		<h2 class="text-xl font-bold m-0 text-(--text-primary) anim-slide-in-left">{title}</h2>
		<div>
			{#if actions}
				{@render actions()}
			{/if}
		</div>
	</div>

	{@render children()}
</div>
