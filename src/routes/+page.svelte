<script lang="ts">
	const features = [
		{ href: '/待辦清單', icon: '📝', title: '待辦清單', desc: '含商店必買' },
		{ href: '/百業', icon: '⚙️', title: '百業設定', desc: '派對提醒' },
		{ href: '/計時器', icon: '⏱️', title: '採集計時', desc: '24H材料' },
		{ href: '/流派', icon: '⚔️', title: '流派配置', desc: '畢業推薦' },
		{ href: '/套裝', icon: '🛡️', title: '全套裝圖鑑', desc: '來源/效果' },
		{ href: '/商店', icon: '💰', title: '必買清單', desc: '不肝/鬼市' },
		{ href: '/資源', icon: '🌿', title: '採集大全', desc: '藥材/素材' },
		{ href: '/日課', icon: '📅', title: '日課指南', desc: '必做事項' }
	];

	const infos = [
		{ icon: '⚡', title: '快速查詢', desc: '一鍵查看所有遊戲信息' },
		{ icon: '🎯', title: '精準推薦', desc: '根據版本更新及時調整' },
		{ icon: '💾', title: '本地保存', desc: '所有數據離線可用' },
		{ icon: '🌐', title: '實時更新', desc: '無需安裝應用程序' }
	];
</script>

<svelte:head>
	<title>燕雲十六聲 - 遊戲助手</title>
</svelte:head>

<div class="flex flex-col h-full overflow-y-auto">
	<!-- Features Section -->
	<section class="py-16 flex-1">
		<div class="max-w-7xl mx-auto px-8">
			<h2 class="text-3xl font-extrabold text-(--text-primary) mb-8">功能導覽</h2>
			
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
				{#each features as feature (feature.href)}
					<a 
						href={feature.href} 
						class="group bg-white/90 backdrop-blur-xl border border-black/8 rounded-2xl p-8 flex flex-col items-center text-center gap-4 transition-all duration-300 ease-out relative overflow-hidden shadow-sm hover:border-(--accent-primary)/30 hover:bg-white hover:-translate-y-2 hover:shadow-lg active:-translate-y-1 no-underline text-inherit"
					>
						<div class="absolute inset-0 bg-linear-to-br from-(--accent-primary)/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
						<div class="text-5xl transition-transform duration-300 ease-out group-hover:scale-110 group-hover:-rotate-6">
							{feature.icon}
						</div>
						<h3 class="text-lg font-bold text-(--text-primary) m-0 transition-colors duration-300 group-hover:text-(--accent-primary)">
							{feature.title}
						</h3>
						<p class="text-sm text-(--text-secondary) m-0">
							{feature.desc}
						</p>
					</a>
				{/each}
			</div>
		</div>
	</section>

	<!-- Info Section -->
	<section class="bg-linear-to-br from-(--accent-primary)/3 to-(--accent-secondary)/2 border-y border-(--accent-primary)/10 py-16">
		<div class="max-w-7xl mx-auto px-8">
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
				{#each infos as info (info.title)}
					<div class="bg-white/80 border border-black/8 rounded-2xl p-8 text-center shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
						<div class="text-4xl mb-4">{info.icon}</div>
						<h3 class="text-lg font-bold text-(--text-primary) mb-2">{info.title}</h3>
						<p class="text-sm text-(--text-secondary) m-0">{info.desc}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Footer -->
	<footer class="bg-(--bg-secondary)/90 border-t border-black/8 py-12 text-center">
		<div class="max-w-2xl mx-auto px-4">
			<p class="text-sm text-(--text-secondary) mb-2">資料來源自燕雲十六聲</p>
			<p class="text-base text-(--accent-primary) font-bold italic m-0">祝各位俠士闖蕩江湖順利！</p>
		</div>
	</footer>
</div>

