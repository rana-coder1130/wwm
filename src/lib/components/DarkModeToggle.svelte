<script lang="ts">
	import { darkMode } from '$lib/stores';

	function toggle() {
		darkMode.set(!$darkMode);
	}
</script>

<!-- Accessible button for toggling dark mode -->
<button
	class={`dm-toggle ${$darkMode ? 'dark' : 'light'} flex items-center justify-center w-10 h-10 leading-10 p-0 rounded-xl transition-colors duration-300`}
	aria-pressed={$darkMode}
	aria-label={$darkMode ? '關閉暗色模式' : '開啟暗色模式'}
	onclick={toggle}
>
	{#if $darkMode}
		<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
			<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
		</svg>
		<span class="sr-only">暗色</span>
	{:else}
		<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
			<circle cx="12" cy="12" r="4"></circle>
			<path
				d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
			/>
		</svg>
		<span class="sr-only">亮色</span>
	{/if}
</button>

<style>
	.dm-toggle {
		border: 1px solid var(--card-border);
		background: var(--card-bg);
		color: var(--text-primary);
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}
	.dm-toggle.dark {
		background: linear-gradient(90deg, #1f2937, #111827);
		color: var(--text-primary);
	}
	.dm-toggle.light {
		background: linear-gradient(90deg, #fff, #f3f4f6);
		color: #111827;
	}

	.dm-toggle:focus {
		outline: none;
		box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.12);
	}
</style>
