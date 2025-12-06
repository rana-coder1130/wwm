<script lang="ts">
	import { goto } from '$app/navigation';
	import DarkModeToggle from './DarkModeToggle.svelte';
	import UserMenu from './UserMenu.svelte';
	import IconMenu from './icons/IconMenu.svelte';
	import IconSearch from './icons/IconSearch.svelte';

	let { searchActive = $bindable(false), menuActive = $bindable(false) } = $props();
	let searchInput = $state('');

	function toggleSearch() {
		searchActive = !searchActive;
		if (!searchActive) searchInput = '';
	}

	function handleSearch(e: Event) {
		e.preventDefault();
		if (searchInput.trim()) {
			goto(`/搜尋?q=${encodeURIComponent(searchInput)}`);
			searchActive = false;
			searchInput = '';
		}
	}
</script>

<header
	class="bg-(--bg-primary)/95 backdrop-blur-xl border-b border-(--border-color) h-14 flex items-center justify-between px-4 z-50 shrink-0 shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-colors duration-300"
>
	<div class="flex items-center gap-4">
		<button
			class="flex items-center justify-center leading-10 w-10 h-10 rounded-xl border-0 bg-transparent cursor-pointer transition-all duration-300 hover:bg-[rgba(212,48,47,0.08)] active:scale-95 text-2xl text-(--text-primary)"
			onclick={() => (menuActive = !menuActive)}
			aria-label="開啟選單"
		>
			<IconMenu className="w-6 h-6" />
		</button>
		<a
			href="/"
			class="text-lg font-black bg-linear-to-br from-[#d4302f] to-[#d4a547] bg-clip-text text-transparent tracking-tight cursor-pointer transition-all duration-300 hover:brightness-110 no-underline"
		>
			燕雲十六聲
		</a>
	</div>
	<div class="flex items-center gap-2">
		<UserMenu />
		<DarkModeToggle />
		<button
			class="flex items-center justify-center leading-10 w-10 h-10 rounded-xl border-0 bg-transparent cursor-pointer transition-all duration-300 hover:bg-[rgba(212,48,47,0.08)] active:scale-95 text-xl text-(--text-secondary)"
			onclick={toggleSearch}
			aria-label="搜尋"
		>
			<IconSearch className="w-5 h-5" />
		</button>
	</div>
</header>

<div
	class="fixed inset-x-0 top-0 h-14 bg-(--bg-primary)/98 backdrop-blur-xl flex items-center px-4 z-60 border-b border-(--border-color) transition-all duration-300 {searchActive
		? 'translate-y-0'
		: '-translate-y-full'}"
>
	<form onsubmit={handleSearch} class="flex w-full items-center">
		<input
			type="text"
			class="flex-1 py-2.5 px-4 rounded-2xl border border-(--border-color) text-base bg-(--bg-tertiary) text-(--text-primary) outline-none transition-all duration-300 placeholder:text-(--text-tertiary) focus:bg-(--bg-secondary) focus:border-(--accent-primary) focus:shadow-[0_0_0_3px_rgba(212,48,47,0.15)]"
			bind:value={searchInput}
			placeholder="搜尋攻略... (例: 龍骨, 不肝商店)"
		/>
		<button
			type="button"
			class="ml-3.5 text-(--accent-primary) font-bold cursor-pointer text-sm transition-all duration-300 bg-transparent border-0 py-2 active:scale-90"
			onclick={toggleSearch}
		>
			取消
		</button>
	</form>
</div>
