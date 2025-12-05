<script lang="ts">
	import { baiyeSettings } from '$lib/stores';

	let settings = $state($baiyeSettings);
	const daysMap = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];

	function toggleDay(dayIndex: number) {
		const idx = settings.days.indexOf(dayIndex);
		if (idx > -1) {
			settings.days.splice(idx, 1);
		} else {
			if (settings.days.length >= 2) settings.days.shift();
			settings.days.push(dayIndex);
		}
		settings = { ...settings };
	}

	function saveSettings() {
		baiyeSettings.set(settings);
		alert('設定已保存！');
	}
</script>

<svelte:head>
	<title>百業設定 - 燕雲十六聲</title>
</svelte:head>

<div class="page-header">
	<a href="/" class="home-btn">⬅️ 回首頁</a>
	<div class="page-title">百業設定</div>
</div>

<div class="baiye-container">
	<fieldset class="setting-group">
		<legend class="setting-label">1. 選擇派對日期 (可選2天)</legend>
		<div class="day-grid">
			{#each daysMap as day, i}
				<button
					class="day-btn {settings.days.includes(i) ? 'active' : ''}"
					onclick={() => toggleDay(i)}
				>
					{day}
				</button>
			{/each}
		</div>
	</fieldset>

	<div class="setting-group">
		<label class="setting-label" for="time-input">2. 設定派對時間</label>
		<input id="time-input" type="time" class="time-input" bind:value={settings.time} />
	</div>

	<button class="save-btn" onclick={saveSettings}>保存設定</button>
</div>

<style>
	.home-btn {
		text-decoration: none;
	}

	.day-btn,
	.save-btn {
		cursor: pointer;
	}
</style>
