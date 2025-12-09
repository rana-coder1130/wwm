<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { countdownSettings, darkMode } from '$lib/stores';
	import { get } from 'svelte/store';

	export let open = false;
	const dispatch = createEventDispatcher();

	let local = { ...get(countdownSettings) };

    

	$: if (open) {
		// refresh local copy when opened
		local = { ...get(countdownSettings) };
	}

	function save() {
		countdownSettings.set({ ...local });
		dispatch('save');
		open = false;
	}

	function cancel() {
		open = false;
		dispatch('cancel');
	}
</script>

<div class="fixed inset-0 flex items-center justify-center z-50" aria-hidden={!open} style:display={open ? 'flex' : 'none'} class:dark={$darkMode}>
	<div class="fixed inset-0 bg-black/30 backdrop-blur-sm" role="button" tabindex="0" on:click={cancel} on:keydown={(e) => e.key === 'Escape' && cancel()} data-layer="backdrop"></div>

	<div class="app-card max-w-lg mx-auto mt-0 w-[min(720px,95%)] p-6 z-10">
		<h2 class="card-title">倒數設定</h2>

		<p class="meta-source mt-2">在此選擇要顯示的倒數項目；儲存後會立即套用。</p>

			<div class="grid grid-cols-1 gap-3 my-4">
			<label class="flex items-center gap-2">
				<input type="checkbox" bind:checked={local.showBattlePass} />
				<span class="text-sm font-medium text-(--text-primary) dark:text-white">顯示戰令倒數</span>
			</label>
			<label class="flex items-center gap-2">
				<input type="checkbox" bind:checked={local.showHeming} />
				<span class="text-sm font-medium text-(--text-primary) dark:text-white">顯示和鳴倒數</span>
			</label>
			<label class="flex items-center gap-2">
				<input type="checkbox" bind:checked={local.showSeasonalShop} />
				<span class="text-sm font-medium text-(--text-primary) dark:text-white">顯示免肝商店倒數</span>
			</label>
				<label class="flex items-center gap-2">
					<input type="checkbox" bind:checked={local.showFridayMarket} />
					<span class="text-sm font-medium text-(--text-primary) dark:text-white">顯示市買司</span>
				</label>
		</div>

		<div class="flex justify-end gap-3 mt-6">
			<button class="btn" on:click={cancel}>取消</button>
			<button class="btn btn-reset" on:click={save}>儲存</button>
		</div>
	</div>
</div>
