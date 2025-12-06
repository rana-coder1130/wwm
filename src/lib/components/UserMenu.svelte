<script lang="ts">
	import { onMount } from 'svelte';
	import type { User } from '$lib/utils/userManager';
	import {
		getAllUsers,
		getCurrentUser,
		addUser,
		deleteUser,
		switchUser,
		renameUser
	} from '$lib/utils/userManager';

	let isOpen = $state(false);
	let users: User[] = $state([]);
	let currentUser: User | null = $state(null);
	let newUserName = $state('');
	let editingUserId: string | null = $state(null);
	let editingName = $state('');
	let showConfirmDelete: string | null = $state(null);

	onMount(() => {
		refreshUsers();

		const handleUserSwitch = () => refreshUsers();
		const handleUserRenamed = () => refreshUsers();

		window.addEventListener('userSwitched', handleUserSwitch);
		window.addEventListener('userRenamed', handleUserRenamed);

		return () => {
			window.removeEventListener('userSwitched', handleUserSwitch);
			window.removeEventListener('userRenamed', handleUserRenamed);
		};
	});

	function refreshUsers() {
		users = getAllUsers();
		currentUser = getCurrentUser();
	}

	function handleAddUser() {
		if (newUserName.trim()) {
			try {
				addUser(newUserName.trim());
				newUserName = '';
				refreshUsers();
			} catch (e) {
				alert(e instanceof Error ? e.message : '新增使用者失敗');
			}
		}
	}

	function handleSwitchUser(userId: string) {
		switchUser(userId);
		refreshUsers();
	}

	function handleDeleteUser(userId: string) {
		deleteUser(userId);
		refreshUsers();
		showConfirmDelete = null;
	}

	function handleEditUser(userId: string) {
		const user = users.find((u) => u.id === userId);
		if (user) {
			editingUserId = userId;
			editingName = user.name;
		}
	}

	function handleSaveEdit() {
		if (editingUserId && editingName.trim()) {
			try {
				renameUser(editingUserId, editingName.trim());
				editingUserId = null;
				editingName = '';
				refreshUsers();
			} catch (e) {
				alert(e instanceof Error ? e.message : '編輯失敗');
			}
		}
	}

	function handleCancelEdit() {
		editingUserId = null;
		editingName = '';
	}
</script>

<!-- 使用者選單按鈕 -->
<button
	class="flex items-center justify-center w-10 h-10 rounded-xl border-0 bg-transparent cursor-pointer transition-all duration-300 hover:bg-[rgba(212,48,47,0.08)] active:scale-95 text-lg text-(--text-primary)"
	onclick={() => (isOpen = !isOpen)}
	title="切換使用者"
>
	👤
</button>

<!-- 使用者選單面板 -->
{#if isOpen}
	<!-- 背景遮罩 -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="fixed inset-0 z-40 bg-black/30" onclick={() => (isOpen = false)}></div>

	<!-- 選單面板 -->
	<div
		class="absolute right-0 top-full mt-2 w-72 bg-(--card-bg) border border-(--card-border) rounded-xl shadow-lg z-50 p-4 flex flex-col gap-3"
	>
		<div class="flex items-center justify-between mb-2">
			<div class="text-sm font-bold text-(--text-primary)">使用者管理</div>
			<button
				class="text-lg text-(--text-secondary) hover:text-(--text-primary) bg-transparent border-0 cursor-pointer"
				onclick={() => (isOpen = false)}
			>
				✕
			</button>
		</div>

		<!-- 現有使用者清單 -->
		<div class="flex flex-col gap-2 max-h-48 overflow-y-auto">
			{#each users as user (user.id)}
				<div
					class="p-2 rounded-lg flex items-center justify-between gap-2 transition-colors {currentUser?.id ===
					user.id
						? 'bg-(--accent-primary)/10 border border-(--accent-primary)'
						: 'bg-(--bg-tertiary) border border-transparent hover:bg-(--bg-secondary)'}"
				>
					<button
						class="flex-1 text-left text-sm font-semibold text-(--text-primary) bg-transparent border-0 cursor-pointer hover:underline"
						onclick={() => handleSwitchUser(user.id)}
					>
						{#if editingUserId === user.id}
							<input
								type="text"
								class="w-full px-2 py-1 rounded bg-(--bg-tertiary) border border-(--border-color) text-(--text-primary) text-sm"
								bind:value={editingName}
								onkeydown={(e) => {
									if (e.key === 'Enter') handleSaveEdit();
									if (e.key === 'Escape') handleCancelEdit();
								}}
							/>
						{:else}
							{user.name}
							{#if currentUser?.id === user.id}
								<span class="text-xs text-(--text-secondary) ml-1">(目前)</span>
							{/if}
						{/if}
					</button>

					{#if editingUserId === user.id}
						<button
							class="px-2 py-1 text-xs font-semibold bg-(--accent-primary) text-white rounded cursor-pointer border-0 hover:brightness-110"
							onclick={handleSaveEdit}
						>
							✓
						</button>
						<button
							class="px-2 py-1 text-xs font-semibold bg-(--text-secondary) text-white rounded cursor-pointer border-0 hover:brightness-110"
							onclick={handleCancelEdit}
						>
							✕
						</button>
					{:else}
						<button
							class="px-2 py-1 text-xs text-(--text-secondary) bg-transparent border border-(--border-color) rounded cursor-pointer hover:text-(--text-primary)"
							onclick={() => handleEditUser(user.id)}
							title="編輯名稱"
						>
							✏️
						</button>
						<button
							class="px-2 py-1 text-xs text-(--text-secondary) bg-transparent border border-(--border-color) rounded cursor-pointer hover:text-(--accent-primary)"
							onclick={() => (showConfirmDelete = user.id)}
							title="刪除使用者"
						>
							🗑️
						</button>

						{#if showConfirmDelete === user.id}
							<div
								class="absolute right-2 top-full mt-1 bg-(--card-bg) border border-(--card-border) rounded-lg p-2 shadow-lg z-50"
							>
								<div class="text-xs text-(--text-secondary) mb-2">確定刪除?</div>
								<div class="flex gap-1">
									<button
										class="flex-1 px-2 py-1 text-xs bg-(--accent-primary) text-white rounded cursor-pointer border-0 hover:brightness-110"
										onclick={() => handleDeleteUser(user.id)}
									>
										是
									</button>
									<button
										class="flex-1 px-2 py-1 text-xs bg-(--text-secondary) text-white rounded cursor-pointer border-0 hover:brightness-110"
										onclick={() => (showConfirmDelete = null)}
									>
										否
									</button>
								</div>
							</div>
						{/if}
					{/if}
				</div>
			{/each}
		</div>

		<!-- 新增使用者 -->
		<div class="border-t border-(--border-color) pt-3 flex flex-col gap-2">
			<input
				type="text"
				placeholder="輸入新使用者名稱..."
				class="w-full px-3 py-2 rounded-lg bg-(--bg-tertiary) border border-(--border-color) text-(--text-primary) text-sm placeholder:text-(--text-tertiary) focus:outline-none focus:border-(--accent-primary)"
				bind:value={newUserName}
				onkeydown={(e) => e.key === 'Enter' && handleAddUser()}
			/>
			<button
				class="w-full px-3 py-2 rounded-lg bg-(--accent-primary) text-white font-semibold text-sm cursor-pointer border-0 hover:brightness-110 transition-all"
				onclick={handleAddUser}
			>
				+ 新增使用者
			</button>
		</div>
	</div>
{/if}

<style>
	:global([data-user-menu-anchor]) {
		position: relative;
	}
</style>
