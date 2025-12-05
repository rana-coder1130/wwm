<script lang="ts">
	import type { ChecklistTask } from '$lib/types';

	let { title, children } = $props<{
		title: string;
		children: any;
	}>();
</script>

<div
	class="bg-white/90 backdrop-blur-xl border border-black/8 rounded-2xl p-3 md:p-5 flex flex-col gap-3 shadow-sm"
>
	<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
		<h2 class="text-xl font-bold m-0 text-(--text-primary)">{title}</h2>
				<div class="w-0"></div>
	</div>

	{@render children()}
</div>

