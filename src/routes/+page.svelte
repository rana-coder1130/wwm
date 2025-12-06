<script lang="ts">
	const features = [
		{ href: '/待辦清單', icon: '📝', title: '待辦清單', desc: '盤點每日/每週重點' },
		{ href: '/計時器', icon: '⏱️', title: '採集計時', desc: '追蹤採集冷卻與刷新' },
		{ href: '/流派', icon: '⚔️', title: '流派配置', desc: '整理武學與畢業搭配' },
		{ href: '/外觀', icon: '🎨', title: '外觀圖鑑', desc: '彙總外觀取得途徑' }
	];
</script>

<svelte:head>
	<title>燕雲十六聲 - 遊戲助手</title>
</svelte:head>

<div
	class="flex flex-col h-full overflow-y-auto"
	style="background:
		radial-gradient(circle at 12% 18%, color-mix(in srgb, var(--accent-primary) 12%, transparent), transparent 24%),
		radial-gradient(circle at 82% 6%, color-mix(in srgb, var(--accent-secondary) 14%, transparent), transparent 22%),
		linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 50%, var(--bg-tertiary) 100%);"
>
	<section class="pb-14 px-6 pt-12">
		<div class="max-w-6xl mx-auto">
			<div class="flex items-center justify-between gap-3 mb-6">
				<h2 class="text-2xl font-extrabold text-(--text-primary) m-0">快速入口</h2>
			</div>
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{#each features as feature (feature.href)}
					<a
						href={feature.href}
						class="group relative overflow-hidden rounded-2xl bg-(--card-bg) border border-(--card-border) p-6 flex flex-col gap-3 shadow-[0_12px_30px_-22px_var(--card-shadow)] transition-all duration-250 hover:-translate-y-2 hover:shadow-lg no-underline text-(--text-primary)"
					>
						<div
							class="absolute inset-0 bg-linear-to-br from-(--accent-primary)/6 via-transparent to-(--accent-secondary)/6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
						></div>
						<div class="flex items-center justify-between">
							<div class="text-3xl">{feature.icon}</div>
							<span
								class="text-xs font-semibold px-3 py-1 rounded-full bg-(--accent-primary)/10 text-(--accent-primary)"
								>入口</span
							>
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
