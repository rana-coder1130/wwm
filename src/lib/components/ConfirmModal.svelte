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
  <div class="lightbox" data-layer="backdrop" on:click={backdropClick} on:keydown={(e) => e.key === 'Escape' && onCancel()} role="dialog" aria-modal="true" tabindex="0">
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
{/if}

<style>
  .lightbox-body { min-width: 320px; }
  .meta-source { margin-top: 0.5rem; }
</style>
