<script lang="ts">
	import { resourceData } from '$lib/data/resources';

	const items = resourceData.filter((item) => item.category === 'daily');
	
	let expandedItems = $state<Set<string>>(new Set());

	function toggleExpand(title: string) {
		if (expandedItems.has(title)) {
			expandedItems.delete(title);
		} else {
			expandedItems.add(title);
		}
		expandedItems = new Set(expandedItems);
	}

	// 日課數據結構
	const dailyTasks = [
		{
			id: 'signin',
			icon: '📅',
			title: '每日簽到',
			subtitle: '朝夕共賞活動',
			time: '全天',
			reward: '金縷衣、短陌錢',
			steps: ['1. 打開活動介面', '2. 點擊朝夕共賞', '3. 領取每日獎勵'],
			tips: '連續簽到有額外獎勵',
			priority: '必做'
		},
		{
			id: 'battlepass',
			icon: '🎯',
			title: '戰令任務',
			subtitle: '每日/每週任務',
			time: '全天',
			reward: '戰令經驗、獎勵',
			steps: ['1. 打開戰令介面', '2. 查看任務列表', '3. 完成所有任務'],
			tips: '每週任務經驗更多',
			priority: '必做'
		},
		{
			id: 'order',
			icon: '📜',
			title: '江湖號令',
			subtitle: '6次/每日',
			time: '全天',
			reward: '經驗、材料',
			steps: ['1. 打開江湖號令', '2. 選擇任務', '3. 完成6次'],
			tips: '優先選擇經驗高的任務',
			priority: '必做'
		},
		{
			id: 'shiyimo',
			icon: '❤️',
			title: '時一墨答題',
			subtitle: '心心相印',
			time: '全天',
			reward: '好感度、獎勵',
			steps: ['1. 找到時一墨', '2. 進行答題', '3. 提升好感度'],
			tips: '答對獎勵更多',
			priority: '推薦'
		},
		{
			id: 'pojun',
			icon: '⚔️',
			title: '破軍殺將',
			subtitle: '週三、週六',
			time: '20:30',
			reward: 'PVP獎勵',
			steps: ['1. 20:30準時參加', '2. 組隊作戰', '3. 擊殺對手'],
			tips: '團隊配合很重要',
			priority: '推薦'
		},
		{
			id: 'yijue',
			icon: '🥊',
			title: '一決高下',
			subtitle: '週四、週日',
			time: '20:30',
			reward: 'PVP獎勵',
			steps: ['1. 20:30準時參加', '2. 個人競技', '3. 爭奪排名'],
			tips: '練好技能很關鍵',
			priority: '推薦'
		},
		{
			id: 'stamina',
			icon: '💪',
			title: '消耗體力',
			subtitle: '450點/每日',
			time: '全天',
			reward: '製造材料',
			steps: ['1. 鍛造裝備', '2. 製作藥品', '3. 消耗體力'],
			tips: '體力會自動恢復',
			priority: '必做'
		},
		{
			id: 'focus',
			icon: '🧘',
			title: '消耗心力',
			subtitle: '副本/據點',
			time: '全天',
			reward: '裝備、心法',
			steps: ['1. 參加副本', '2. 攻打據點', '3. 領取獎勵'],
			tips: '9分鐘回1點',
			priority: '必做'
		}
	];

	const priorityColors: Record<string, string> = {
		'必做': '#ff6b35',
		'推薦': '#3498db',
		'選做': '#95a5a6'
	};
</script>

<svelte:head>
	<title>日課說明 - 燕雲十六聲</title>
</svelte:head>

<div class="daily-container">
	<!-- Header -->
	<div class="daily-header">
		<div class="header-top">
			<a href="/" class="home-btn">⬅️ 返回</a>
			<h1 class="page-title">日課說明</h1>
			<div style="width:40px;"></div>
		</div>
		
		<div class="daily-summary">
			<div class="summary-card">
				<div class="summary-icon">📋</div>
				<div class="summary-info">
					<div class="summary-number">{dailyTasks.length}</div>
					<div class="summary-label">日常任務</div>
				</div>
			</div>
			<div class="summary-card">
				<div class="summary-icon">⚡</div>
				<div class="summary-info">
					<div class="summary-number">{dailyTasks.filter(t => t.priority === '必做').length}</div>
					<div class="summary-label">必做項目</div>
				</div>
			</div>
			<div class="summary-card">
				<div class="summary-icon">⏰</div>
				<div class="summary-info">
					<div class="summary-number">{dailyTasks.filter(t => t.time !== '全天').length}</div>
					<div class="summary-label">定時活動</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Priority Legend -->
	<div class="priority-legend">
		<span class="legend-item" style="--color: {priorityColors['必做']}">
			<span class="legend-dot"></span> 必做
		</span>
		<span class="legend-item" style="--color: {priorityColors['推薦']}">
			<span class="legend-dot"></span> 推薦
		</span>
		<span class="legend-item" style="--color: {priorityColors['選做']}">
			<span class="legend-dot"></span> 選做
		</span>
	</div>

	<!-- Daily Tasks Grid -->
	<div class="tasks-section">
		<div class="section-title-bar">
			<h2 class="section-title">每日任務清單</h2>
			<div class="section-count">{dailyTasks.length} 項</div>
		</div>

		<div class="daily-grid">
			{#each dailyTasks as task}
				<div class="daily-card {expandedItems.has(task.id) ? 'expanded' : ''}">
					<button class="daily-card-header" onclick={() => toggleExpand(task.id)}>
						<div class="task-icon-wrapper" style="--priority-color: {priorityColors[task.priority]}">
							<span class="task-icon">{task.icon}</span>
						</div>
						<div class="task-info">
							<div class="task-title-row">
								<span class="task-title">{task.title}</span>
								<span class="priority-badge" style="background: {priorityColors[task.priority]}">{task.priority}</span>
							</div>
							<div class="task-subtitle">{task.subtitle}</div>
							<div class="task-meta">
								<span class="meta-item">⏰ {task.time}</span>
								<span class="meta-divider">•</span>
								<span class="meta-item">🎁 {task.reward}</span>
							</div>
						</div>
						<div class="expand-icon {expandedItems.has(task.id) ? 'expanded' : ''}">
							<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
								<polyline points="6 8 10 12 14 8"></polyline>
							</svg>
						</div>
					</button>

					{#if expandedItems.has(task.id)}
						<div class="daily-card-body">
							<div class="steps-section">
								<div class="steps-title">📝 完成步驟</div>
								<ol class="steps-list">
									{#each task.steps as step}
										<li>{step}</li>
									{/each}
								</ol>
							</div>
							{#if task.tips}
								<div class="tips-box">
									<span class="tips-icon">💡</span>
									<span>{task.tips}</span>
								</div>
							{/if}
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</div>

	<!-- Additional Resources -->
	{#if items.length > 0}
		<div class="resources-section">
			<div class="section-title-bar">
				<h2 class="section-title">相關資源</h2>
			</div>
			<div class="resources-grid">
				{#each items as item}
					{@const searchUrl = `https://www.google.com/search?tbm=isch&q=燕雲十六聲+${encodeURIComponent(item.title)}`}
					<div class="resource-card">
						<div class="resource-header">
							<span class="resource-title">{item.title}</span>
							{#if item.tag}
								<span class="resource-tag">{item.tag}</span>
							{/if}
						</div>
						{#if item.content}
							<div class="resource-content">{item.content}</div>
						{/if}
						{#if item.note}
							<div class="resource-note">💡 {item.note}</div>
						{/if}
						<a href={searchUrl} target="_blank" rel="noopener noreferrer" class="resource-link">
							🔍 查看圖片
						</a>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<div class="spacing"></div>
</div>

<style>
	.daily-container {
		display: flex;
		flex-direction: column;
		height: 100%;
		overflow-y: auto;
		padding: 1.5rem;
		gap: 2rem;
		max-width: 1200px;
		margin: 0 auto;
		width: 100%;
	}

	/* Header */
	.daily-header {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.header-top {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.home-btn {
		text-decoration: none;
		color: #ff6b35;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s ease;
		padding: 0.5rem 1rem;
		border-radius: 0.5rem;
		background: rgba(255, 107, 53, 0.1);

		&:hover {
			background: rgba(255, 107, 53, 0.2);
			transform: translateX(-4px);
		}
	}

	.page-title {
		font-size: 1.75rem;
		font-weight: 800;
		background: linear-gradient(135deg, #ff6b35, #ff8c52);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		margin: 0;
	}

	/* Summary Cards */
	.daily-summary {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		gap: 1rem;
	}

	.summary-card {
		background: rgba(31, 41, 55, 0.6);
		backdrop-filter: blur(10px);
		border: 1px solid var(--border-color);
		border-radius: 0.75rem;
		padding: 1rem;
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.summary-icon {
		font-size: 2rem;
		flex-shrink: 0;
	}

	.summary-info {
		flex: 1;
	}

	.summary-number {
		font-size: 1.5rem;
		font-weight: 700;
		color: #ff6b35;
		line-height: 1;
	}

	.summary-label {
		font-size: 0.75rem;
		color: #b8c5d6;
		margin-top: 0.25rem;
	}

	/* Priority Legend */
	.priority-legend {
		display: flex;
		gap: 1.5rem;
		padding: 1rem;
		background: rgba(31, 41, 55, 0.4);
		border-radius: 0.5rem;
		flex-wrap: wrap;
	}

	.legend-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.875rem;
		color: #b8c5d6;
		font-weight: 500;
	}

	.legend-dot {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background: var(--color);
		box-shadow: 0 0 8px var(--color);
	}

	/* Section */
	.tasks-section,
	.resources-section {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.section-title-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.section-title {
		font-size: 1.25rem;
		font-weight: 700;
		margin: 0;
		color: #ffffff;
	}

	.section-count {
		font-size: 0.875rem;
		color: #b8c5d6;
		font-weight: 600;
		padding: 0.25rem 0.75rem;
		background: rgba(255, 107, 53, 0.15);
		border-radius: 1rem;
	}

	/* Daily Grid */
	.daily-grid {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.daily-card {
		background: rgba(31, 41, 55, 0.8);
		backdrop-filter: blur(10px);
		border: 2px solid #3d4d5c;
		border-radius: 0.75rem;
		overflow: hidden;
		transition: all 0.3s cubic-bezier(0.2, 0.6, 0.3, 1);

		&:hover {
			border-color: #ff6b35;
			box-shadow: 0 0 20px rgba(255, 107, 53, 0.2);
		}

		&.expanded {
			border-color: #ff6b35;
		}
	}

	.daily-card-header {
		width: 100%;
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1rem;
		background: none;
		border: none;
		text-align: left;
		cursor: pointer;
		transition: all 0.2s ease;
		color: inherit;
		font: inherit;

		&:hover {
			background: rgba(255, 107, 53, 0.05);
		}

		&:active {
			background: rgba(255, 107, 53, 0.1);
		}
	}

	.task-icon-wrapper {
		width: 60px;
		height: 60px;
		border-radius: 0.75rem;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(255, 107, 53, 0.1);
		border: 2px solid var(--priority-color);
		flex-shrink: 0;
		box-shadow: 0 0 15px rgba(255, 107, 53, 0.2);
	}

	.task-icon {
		font-size: 1.75rem;
	}

	.task-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.task-title-row {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.task-title {
		font-size: 1.125rem;
		font-weight: 700;
		color: #ffffff;
	}

	.priority-badge {
		font-size: 0.75rem;
		font-weight: 600;
		color: white;
		padding: 0.25rem 0.625rem;
		border-radius: 0.25rem;
		white-space: nowrap;
	}

	.task-subtitle {
		font-size: 0.875rem;
		color: #b8c5d6;
	}

	.task-meta {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.8125rem;
		color: #a0aec0;
		flex-wrap: wrap;
	}

	.meta-item {
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}

	.meta-divider {
		color: #5a6b7a;
	}

	.expand-icon {
		width: 24px;
		height: 24px;
		color: #b8c5d6;
		transition: transform 0.3s ease;
		flex-shrink: 0;

		&.expanded {
			transform: rotate(180deg);
		}
	}

	/* Daily Card Body */
	.daily-card-body {
		padding: 0 1rem 1rem 1rem;
		animation: slideDown 0.3s ease;
	}

	@keyframes slideDown {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.steps-section {
		background: rgba(255, 107, 53, 0.05);
		border: 1px solid rgba(255, 107, 53, 0.2);
		border-radius: 0.5rem;
		padding: 1rem;
		margin-bottom: 1rem;
	}

	.steps-title {
		font-weight: 600;
		color: #ff6b35;
		margin-bottom: 0.75rem;
		font-size: 0.9375rem;
	}

	.steps-list {
		margin: 0;
		padding-left: 1.25rem;
		color: #b8c5d6;
		font-size: 0.875rem;
		line-height: 1.8;
	}

	.steps-list li {
		margin-bottom: 0.5rem;

		&:last-child {
			margin-bottom: 0;
		}
	}

	.tips-box {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1rem;
		background: rgba(52, 152, 219, 0.1);
		border: 1px solid rgba(52, 152, 219, 0.3);
		border-radius: 0.5rem;
		color: #b8c5d6;
		font-size: 0.875rem;
	}

	.tips-icon {
		font-size: 1.125rem;
		flex-shrink: 0;
	}

	/* Resources Grid */
	.resources-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 1rem;
	}

	.resource-card {
		background: rgba(31, 41, 55, 0.6);
		backdrop-filter: blur(10px);
		border: 2px solid #3d4d5c;
		border-radius: 0.75rem;
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		transition: all 0.3s ease;

		&:hover {
			border-color: #ff6b35;
			box-shadow: 0 0 20px rgba(255, 107, 53, 0.2);
		}
	}

	.resource-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 0.5rem;
	}

	.resource-title {
		font-weight: 600;
		color: #ffffff;
		flex: 1;
	}

	.resource-tag {
		font-size: 0.75rem;
		font-weight: 600;
		color: white;
		padding: 0.25rem 0.625rem;
		border-radius: 0.25rem;
		background: #3498db;
		white-space: nowrap;
	}

	.resource-content {
		font-size: 0.875rem;
		color: #b8c5d6;
		line-height: 1.6;
		white-space: pre-line;
	}

	.resource-note {
		font-size: 0.8125rem;
		color: #a0aec0;
		background: rgba(255, 107, 53, 0.1);
		padding: 0.5rem 0.75rem;
		border-radius: 0.375rem;
		border-left: 3px solid #ff6b35;
	}

	.resource-link {
		text-decoration: none;
		color: #ff6b35;
		font-weight: 600;
		font-size: 0.875rem;
		transition: all 0.2s ease;
		align-self: flex-start;

		&:hover {
			color: #ff8c52;
			transform: translateX(4px);
		}
	}

	.spacing {
		height: 2rem;
	}

	/* Responsive */
	@media (max-width: 768px) {
		.daily-container {
			padding: 1rem;
			gap: 1.5rem;
		}

		.page-title {
			font-size: 1.5rem;
		}

		.daily-summary {
			grid-template-columns: 1fr;
		}

		.priority-legend {
			gap: 1rem;
		}

		.resources-grid {
			grid-template-columns: 1fr;
		}

		.task-icon-wrapper {
			width: 50px;
			height: 50px;
		}

		.task-icon {
			font-size: 1.5rem;
		}

		.task-title {
			font-size: 1rem;
		}
	}
</style>
