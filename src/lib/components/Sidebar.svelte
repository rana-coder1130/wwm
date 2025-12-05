<script lang="ts">
	let { active = $bindable(false) } = $props();

	const menuItems = [
		{ icon: '🏠', label: '首頁儀表板', href: '/' },
		{ icon: '📝', label: '待辦清單 (Checklist)', href: '/待辦清單' },
		{ icon: '⏱️', label: '採集計時器', href: '/計時器' }
	];

	const toolItems = [
		{ icon: '⚔️', label: '流派配置器', href: '/流派' }
	];

	const dailyItems: Array<{ icon: string; label: string; href: string }> = [];

	function closeMenu() {
		active = false;
	}
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div 
	class="fixed inset-0 bg-black/50 z-99 transition-opacity duration-300 {active ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}"
	onclick={closeMenu}
></div>

<nav class="fixed inset-y-0 left-0 w-[260px] bg-white/98 backdrop-blur-xl z-100 border-r border-(--border-color) overflow-y-auto transition-transform duration-300 {active ? 'translate-x-0' : '-translate-x-full'}">
	<div class="p-5 border-b border-(--border-color)">
		<div class="text-xl font-bold">攻略導航</div>
		<div class="text-xs opacity-90 mt-1">V25.9 導航優化版</div>
	</div>
	
	<div class="py-4 flex flex-col gap-2">
		{#each menuItems as item}
			<a 
				href={item.href} 
				class="flex items-center gap-3.5 py-3.5 px-5 text-(--text-secondary) no-underline transition-all duration-300 border-l-[3px] border-transparent font-medium hover:text-(--text-primary) hover:bg-[rgba(212,48,47,0.06)] hover:border-(--accent-primary) hover:pl-6 [&.active]:text-(--accent-primary) [&.active]:bg-[rgba(212,48,47,0.1)] [&.active]:border-(--accent-primary) [&.active]:font-bold"
				onclick={closeMenu}
			>
				{item.icon} {item.label}
			</a>
		{/each}

		<div class="px-5 py-2 text-xs font-bold text-(--text-tertiary) uppercase tracking-wider mt-2">
			工具與查詢
		</div>
		{#each toolItems as item}
			<a 
				href={item.href} 
				class="flex items-center gap-3.5 py-3.5 px-5 text-(--text-secondary) no-underline transition-all duration-300 border-l-[3px] border-transparent font-medium hover:text-(--text-primary) hover:bg-[rgba(212,48,47,0.06)] hover:border-(--accent-primary) hover:pl-6 [&.active]:text-(--accent-primary) [&.active]:bg-[rgba(212,48,47,0.1)] [&.active]:border-(--accent-primary) [&.active]:font-bold"
				onclick={closeMenu}
			>
				{item.icon} {item.label}
			</a>
		{/each}

		{#if dailyItems.length}
			<div class="px-5 py-2 text-xs font-bold text-(--text-tertiary) uppercase tracking-wider mt-2">
				日常與資源
			</div>
			{#each dailyItems as item}
				<a 
					href={item.href} 
					class="flex items-center gap-3.5 py-3.5 px-5 text-(--text-secondary) no-underline transition-all duration-300 border-l-[3px] border-transparent font-medium hover:text-(--text-primary) hover:bg-[rgba(212,48,47,0.06)] hover:border-(--accent-primary) hover:pl-6 [&.active]:text-(--accent-primary) [&.active]:bg-[rgba(212,48,47,0.1)] [&.active]:border-(--accent-primary) [&.active]:font-bold"
					onclick={closeMenu}
				>
					{item.icon} {item.label}
				</a>
			{/each}
		{/if}
	</div>
</nav>
