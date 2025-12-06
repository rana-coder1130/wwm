<script lang="ts">
	import { toasts } from '$lib/stores';
	import { removeToast } from '$lib/utils/toast';
</script>

<div class="fixed top-4 right-4 flex flex-col gap-2 z-50">
	{#each $toasts as t (t.id)}
		<div class="app-card p-3 flex items-center gap-3">
			<div class="flex-1 text-sm">{t.text}</div>
			{#if t.actionLabel}
				<button
					class="btn-invert"
					type="button"
					onclick={() => {
						t.onAction && t.onAction();
						removeToast(t.id);
					}}
				>
					{t.actionLabel}
				</button>
			{/if}
		</div>
	{/each}
</div>
