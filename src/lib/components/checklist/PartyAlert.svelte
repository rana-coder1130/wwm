<script lang="ts">
	let { time, onToggle, isChecked } = $props<{
		time: string;
		onToggle: () => void;
		isChecked: boolean;
	}>();
</script>

<div
	class="bg-linear-to-r from-(--accent-primary)/20 to-(--accent-secondary)/15 backdrop-blur-xl border border-(--accent-primary)/30 rounded-xl p-4 flex items-center gap-4 animate-pulse"
>
	<span class="text-4xl shrink-0">🎉</span>
	<div class="flex-1">
		<div class="font-bold text-(--accent-primary)">百業派對日</div>
		<div class="text-sm text-(--text-secondary) mt-1 font-medium">時間：{time}</div>
	</div>
	<button
		class="w-10 h-10 bg-(--accent-primary)/20 border border-(--accent-primary) rounded-lg flex items-center justify-center cursor-pointer transition-all duration-300 shrink-0 font-bold text-transparent hover:bg-(--accent-primary)/30 hover:scale-110 hover:shadow-lg hover:shadow-(--accent-primary)/30 active:scale-95 {isChecked
			? 'bg-(--accent-primary) text-white shadow-lg shadow-(--accent-primary)/50'
			: ''}"
		onclick={onToggle}
		title="參加派對"
	>
		<span class="{isChecked ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200"
			>✓</span
		>
	</button>
</div>
