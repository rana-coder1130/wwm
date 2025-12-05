<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();

	let searchActive = $state(false);
	let menuActive = $state(false);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="flex flex-col w-full h-full overflow-hidden">
	<Header bind:searchActive bind:menuActive />
	<Sidebar bind:active={menuActive} />

	<main id="main" class="flex-1 overflow-y-auto overflow-x-hidden">
		{@render children()}
	</main>
</div>