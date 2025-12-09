<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { createChecklistLogic } from '$lib/utils/checklistLogic';
  import { showToast } from '$lib/utils/toast';
  import { hiddenTasks } from '$lib/stores';
  import { get } from 'svelte/store';
  import ConfirmModal from '$lib/components/ConfirmModal.svelte';

  let action = '';
  let message = '';
  let title = '確認操作';
  let id = '';
  let returnTo = '/';
  let clearHidden = false;
  let initialized = false;

  const logic = createChecklistLogic();

  $: url = $page.url;
  $: if (url && !initialized) {
    const params = url.searchParams;
    action = params.get('action') || '';
    id = params.get('id') || '';
    message = params.get('message') || '';
    title = params.get('title') || (action === 'resetAll' ? '全部重置' : '確認操作');
    returnTo = params.get('returnTo') || '/';
    clearHidden = params.get('clearHidden') === '1' || params.get('clearHidden') === 'true';
    initialized = true;
  }

  function onConfirm() {
    if (action === 'resetAll') {
      logic.resetAll({ clearHidden });
      showToast('已全部重置');
    } else if (action === 'hideItem' && id) {
      const prevHidden = get(hiddenTasks);
      if (!prevHidden.includes(id)) {
        hiddenTasks.set([...prevHidden, id]);
      }
      showToast('已隱藏項目');
    } else if (action === 'resetDaily') {
      logic.resetDaily();
      showToast('已重置每日項目');
    } else if (action === 'resetWeekly') {
      logic.resetWeekly();
      showToast('已重置每週項目');
    } else {
      showToast('已確認');
    }

    // 導回來源頁面
    goto(returnTo);
  }

  function onCancel() {
    goto(returnTo);
  }
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

<!-- Use the shared ConfirmModal so the page looks exactly like the modal confirmation -->
<ConfirmModal open={true} title={title} message={message || '你確定要執行此操作嗎？這個動作無法復原。'} confirmLabel="確認" cancelLabel="取消" on:confirm={onConfirm} on:cancel={onCancel}>
  {#if action === 'resetAll'}
    <div class="mt-3">
      <label class="flex items-center gap-2">
        <input type="checkbox" bind:checked={clearHidden} />
        <span class="text-(--text-secondary)">同時還原已隱藏項目</span>
      </label>
    </div>
  {:else if action === 'hideItem'}
    <div class="mt-3">
      <p class="text-xs text-(--text-muted)">此操作會將項目加入隱藏清單。可於「隱藏」頁面還原。</p>
    </div>
  {/if}
</ConfirmModal>

<!-- styling is handled by ConfirmModal / global styles -->
