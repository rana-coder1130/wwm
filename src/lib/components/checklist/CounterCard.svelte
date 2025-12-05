<script lang="ts">
  import type { ChecklistTask } from '$lib/types';

  let { item, count = 0, onIncrement, onToggle, onReset } = $props<{
    item: ChecklistTask;
    count?: number;
    onIncrement: () => void;
    onToggle: (idx: number) => void;
    onReset: () => void;
  }>();

  const handleKey = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onIncrement();
    }
  };
</script>

<div
  class="app-card h-full p-3 md:p-4 flex flex-col gap-3 transition-all duration-200 relative overflow-hidden ${count ? 'border-(--accent-primary)/50' : ''}"
  role="button"
  tabindex="0"
  onclick={onIncrement}
  onkeydown={handleKey}
  oncontextmenu={(e) => {
    e.preventDefault();
    onReset();
  }}
  title="點擊卡片 +1，右鍵重置"
>
  <div class="flex justify-between items-start gap-4 relative z-10">
    <div class="card-title flex-1">{item.text}</div>
    <div
      class={`text-xs font-bold px-2 py-1 rounded-full border transition-all duration-150 ${count
        ? 'bg-(--accent-primary)/12 text-(--accent-primary) border-(--accent-primary)/30'
        : 'bg-(--bg-tertiary) text-(--text-secondary) border-black/5'} ${count === (item.max ?? 0) ? 'ring-1 ring-(--accent-primary)/30' : ''}`}
    >
      {count}/{item.max}
    </div>
  </div>
  <div class="text-xs text-(--text-secondary) relative z-10">{item.sub}</div>
  <div class="text-[11px] text-(--text-secondary) relative z-10">點擊卡片 +1 ／ 右鍵重置</div>
  <div class="flex gap-2 flex-wrap relative z-10">
    {#each Array(item.max) as _, i}
      <button
        class={`w-9 h-9 border border-(--accent-primary)/20 bg-(--accent-primary)/8 text-(--text-secondary) rounded-md cursor-pointer font-semibold transition-all duration-150 text-sm hover:border-(--accent-primary)/50 hover:bg-(--accent-primary)/15 ${i < count ? 'bg-(--accent-primary) text-white border-(--accent-primary) font-bold' : ''}`}
        onclick={(e) => {
          e.stopPropagation();
          onToggle(i);
        }}
        title={`${i + 1}/${item.max}`}
      >
        {i + 1}
      </button>
    {/each}
    <button
      class="w-9 h-9 border border-(--text-tertiary)/30 bg-(--text-tertiary)/10 text-(--text-tertiary) rounded-md cursor-pointer font-semibold transition-all duration-150 text-sm ml-1 hover:border-(--text-tertiary) hover:bg-(--text-tertiary)/20 hover:text-(--text-secondary)"
      onclick={(e) => {
        e.stopPropagation();
        onReset();
      }}
      title="重置計數"
    >
      ↺
    </button>
  </div>
</div>
