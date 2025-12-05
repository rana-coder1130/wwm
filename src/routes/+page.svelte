<script lang="ts">
	const features = [
		{ href: '/待辦清單', icon: '📝', title: '待辦清單', desc: '盤點每日/每週重點' },
		{ href: '/計時器', icon: '⏱️', title: '採集計時', desc: '追蹤採集冷卻與刷新' },
		{ href: '/流派', icon: '⚔️', title: '流派配置', desc: '整理武學與畢業搭配' }
	];

	const badges = ['離線保存'];
</script>

<svelte:head>
	<title>燕雲十六聲 - 遊戲助手</title>
</svelte:head>

<div class="flex flex-col h-full overflow-y-auto bg-[radial-gradient(circle_at_12%_18%,rgba(212,48,47,0.05),transparent_24%),radial-gradient(circle_at_82%_6%,rgba(212,165,71,0.08),transparent_22%),#f8f9fb]">
	<section class="py-12 px-6">
		<div class="max-w-6xl mx-auto rounded-3xl overflow-hidden bg-linear-to-br from-(--accent-primary) via-(--accent-secondary)/92 to-(--accent-cyan)/88 text-white p-10 shadow-[0_20px_50px_-25px_rgba(0,0,0,0.35)]">
			<div class="flex flex-wrap gap-2 mb-5">
				{#each badges as badge}
					<span class="px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] rounded-full bg-white/15 border border-white/20 backdrop-blur-sm">
						{badge}
					</span>
				{/each}
			</div>
			<h1 class="text-4xl md:text-5xl font-extrabold leading-tight mb-3">燕雲十六聲</h1>
			<div class="flex flex-wrap gap-3">
			</div>
		</div>
	</section>

	<section class="pb-14 px-6">
		<div class="max-w-6xl mx-auto">
			<div class="flex items-center justify-between gap-3 mb-6">
				<h2 class="text-2xl font-extrabold text-(--text-primary) m-0">快速入口</h2>
			</div>
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{#each features as feature (feature.href)}
					<a
						href={feature.href}
						class="group relative overflow-hidden rounded-2xl bg-white border border-black/8 p-6 flex flex-col gap-3 shadow-[0_12px_30px_-22px_rgba(0,0,0,0.35)] transition-all duration-250 hover:-translate-y-2 hover:shadow-lg no-underline text-(--text-primary)"
					>
						<div class="absolute inset-0 bg-linear-to-br from-(--accent-primary)/6 via-transparent to-(--accent-secondary)/6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
						<div class="flex items-center justify-between">
							<div class="text-3xl">{feature.icon}</div>
							<span class="text-xs font-semibold px-3 py-1 rounded-full bg-(--accent-primary)/10 text-(--accent-primary)">入口</span>
						</div>
						<div>
							<h3 class="text-lg font-bold mb-1">{feature.title}</h3>
							<p class="text-sm text-(--text-secondary) m-0">{feature.desc}</p>
						</div>
						<div class="flex items-center gap-2 text-(--accent-primary) font-semibold text-sm">
							<span>打開</span>
							<span aria-hidden="true">→</span>
						</div>
					</a>
				{/each}
			</div>
		</div>
	</section>

	<footer class="bg-(--bg-secondary)/95 border-t border-black/8 py-12 text-center">
		<div class="max-w-2xl mx-auto px-4">
			<p class="text-sm text-(--text-secondary) mb-2">資料來源自燕雲十六聲，工具持續更新中。</p>
			<p class="text-base text-(--accent-primary) font-bold italic m-0">祝各位俠士闖蕩江湖順利！</p>
		</div>
	</footer>
</div>

