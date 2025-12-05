<script lang="ts">
  import type { ChecklistTask } from '$lib/types';

  let {
    item,
    checked = false,
    lifetime = 0,
    limit = 0,
    size = 'normal',
    onToggle
  } = $props<{
    item: ChecklistTask;
    checked?: boolean;
    lifetime?: number;
    limit?: number;
    size?: 'normal' | 'compact';
    onToggle: () => void;
  }>();

  const isCompact = $derived(size === 'compact');
</script>

<button
  class={`h-full bg-white border border-(--accent-primary)/20 rounded-xl flex cursor-pointer transition-all duration-200 text-left relative overflow-hidden select-none ${isCompact ? 'p-2 md:p-2.5 gap-1.5' : 'p-3 md:p-4 gap-3'} ${checked ? 'border-(--accent-primary) bg-(--accent-primary)/8' : 'hover:border-(--accent-primary)/50'}`}
  onclick={onToggle}
  title={item.text}
>
  <div class={`${isCompact ? 'w-5 h-5 text-base' : 'w-6 h-6 text-lg'} border border-(--accent-primary)/30 rounded-md flex items-center justify-center shrink-0 bg-(--accent-primary)/8 transition-all duration-200 relative z-10`}>
    <span class={`opacity-0 transition-opacity duration-150 text-(--accent-primary) font-bold ${isCompact ? 'text-base' : 'text-lg'} ${checked ? 'opacity-100' : ''}`}>✓</span>
  </div>
  <div class={`flex-1 flex flex-col relative z-10 ${isCompact ? 'gap-0.5' : 'gap-2'}`}>
    <div class={`font-semibold text-(--text-primary) transition-all duration-200 text-base ${checked ? 'line-through opacity-60' : ''}`}>
      {item.text}
    </div>
    <div class={`text-(--text-secondary) text-base`}>{item.sub}</div>
    {#if item.trackLifetime}
      <div class={`flex items-center ${isCompact ? 'gap-1.5 mt-1.5' : 'gap-3 mt-2'}`}>
        <div class="flex-1 h-1 bg-(--bg-tertiary) rounded-full overflow-hidden">
          <div
            class="h-full bg-linear-to-r from-(--accent-primary) to-(--accent-secondary) rounded-full transition-all duration-300"
            style={`width: ${Math.min(100, (lifetime / (limit || 1)) * 100)}%`}
          ></div>
        </div>
        <span class={`text-base text-(--accent-primary) font-bold whitespace-nowrap`}>{lifetime}/{limit}</span>
      </div>
    {/if}
  </div>
</button>
