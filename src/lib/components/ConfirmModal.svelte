<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  export let open = false;
  export let title = '確認';
  export let message = '';
  export let confirmLabel = '確認';
  export let cancelLabel = '取消';
  

  const dispatch = createEventDispatcher();

  function onConfirm() {
    dispatch('confirm');
    open = false;
  }

  function onCancel() {
    dispatch('cancel');
    open = false;
  }

  // close on backdrop
  function backdropClick(e: MouseEvent) {
    if ((e.target as HTMLElement).dataset.layer === 'backdrop') onCancel();
  }
</script>

{#if open}
  <div class="fixed inset-0 z-50" role="dialog" aria-modal="true">
    <!-- 半透明 + 模糊背景 -->
    <div class="fixed inset-0 bg-black/40 backdrop-blur-sm" data-layer="backdrop" role="button" aria-label="關閉對話框" on:click={backdropClick} tabindex="0" on:keydown={(e) => e.key === 'Escape' && onCancel()}></div>

    <!-- centered content -->
    <div class="min-h-screen flex items-center justify-center p-4">
      <div class="lightbox-body anim-fade-up" role="document">
        <button class="lightbox-close" aria-label="關閉" on:click={onCancel}>✕</button>
        <h3 class="card-title">{title}</h3>
        {#if message}
          <p class="meta-source">{message}</p>
        {/if}

        <slot></slot>

        <div class="flex justify-end gap-3 mt-4">
          <button class="btn" on:click={onCancel}>{cancelLabel}</button>
          <button class="btn btn-reset" on:click={onConfirm} aria-pressed="false">{confirmLabel}</button>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .lightbox-body { min-width: 320px; }
  .meta-source { margin-top: 0.5rem; }
</style>
