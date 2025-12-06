<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Toast from '$lib/components/Toast.svelte';
	import { darkMode } from '$lib/stores';
	import { browser } from '$app/environment';
	import { getCurrentUserId, addUser, getAllUsers } from '$lib/utils/userManager';

	let { children } = $props();

	let searchActive = $state(false);
	let menuActive = $state(false);

	// 初始化使用者系統
	if (browser) {
		// 如果沒有使用者且沒有當前使用者，建立預設使用者
		if (getAllUsers().length === 0 && !getCurrentUserId()) {
			addUser('玩家1');
		}
	}

	$effect(() => {
		if (browser) {
			const root = document.documentElement;
			if ($darkMode) {
				root.classList.add('dark');
			} else {
				root.classList.remove('dark');
			}
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="flex flex-col w-full h-full overflow-hidden">
	<Header bind:searchActive bind:menuActive />
	<Sidebar bind:active={menuActive} />

	<Toast />

	<main id="main" class="flex-1 overflow-y-auto overflow-x-hidden">
		{@render children()}
	</main>
</div>
