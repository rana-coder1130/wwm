/**
 * 使用者管理工具
 * 支援多使用者在同台電腦上保存獨立數據
 */

export interface User {
	id: string;
	name: string;
	createdAt: number;
}

const USERS_KEY = 'yanyunUsers';
const CURRENT_USER_KEY = 'yanyunCurrentUser';

/**
 * 取得所有使用者清單
 */
export function getAllUsers(): User[] {
	if (typeof localStorage === 'undefined') return [];
	const data = localStorage.getItem(USERS_KEY);
	return data ? JSON.parse(data) : [];
}

/**
 * 取得當前使用者 ID
 */
export function getCurrentUserId(): string | null {
	if (typeof localStorage === 'undefined') return null;
	return localStorage.getItem(CURRENT_USER_KEY);
}

/**
 * 取得當前使用者物件
 */
export function getCurrentUser(): User | null {
	const userId = getCurrentUserId();
	if (!userId) return null;
	const users = getAllUsers();
	return users.find((u) => u.id === userId) || null;
}

/**
 * 新增使用者
 */
export function addUser(name: string): User {
	if (typeof localStorage === 'undefined') throw new Error('localStorage unavailable');

	const users = getAllUsers();

	// 檢查名稱重複
	if (users.some((u) => u.name === name)) {
		throw new Error(`使用者 "${name}" 已存在`);
	}

	const newUser: User = {
		id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
		name,
		createdAt: Date.now()
	};

	users.push(newUser);
	localStorage.setItem(USERS_KEY, JSON.stringify(users));

	// 如果沒有當前使用者，自動設定為新建立的使用者
	if (!getCurrentUserId()) {
		switchUser(newUser.id);
	}

	return newUser;
}

/**
 * 刪除使用者及其所有數據
 */
export function deleteUser(userId: string): void {
	if (typeof localStorage === 'undefined') return;

	const users = getAllUsers();
	const updatedUsers = users.filter((u) => u.id !== userId);
	localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));

	// 清除該使用者的所有數據
	const keys = Object.keys(localStorage);
	const prefix = `${userId}:`;
	keys.forEach((key) => {
		if (key.startsWith(prefix)) {
			localStorage.removeItem(key);
		}
	});

	// 如果刪除的是當前使用者，切換至其他使用者
	if (getCurrentUserId() === userId) {
		if (updatedUsers.length > 0) {
			switchUser(updatedUsers[0].id);
		} else {
			localStorage.removeItem(CURRENT_USER_KEY);
		}
	}
}

/**
 * 切換當前使用者
 */
export function switchUser(userId: string): void {
	if (typeof localStorage === 'undefined') return;

	const users = getAllUsers();
	if (!users.some((u) => u.id === userId)) {
		throw new Error(`使用者 ID "${userId}" 不存在`);
	}

	localStorage.setItem(CURRENT_USER_KEY, userId);

	// 派送自訂事件以通知應用程式切換了使用者
	window.dispatchEvent(new CustomEvent('userSwitched', { detail: { userId } }));
}

/**
 * 編輯使用者名稱
 */
export function renameUser(userId: string, newName: string): void {
	if (typeof localStorage === 'undefined') return;

	const users = getAllUsers();
	const user = users.find((u) => u.id === userId);

	if (!user) throw new Error(`使用者 ID "${userId}" 不存在`);
	if (users.some((u) => u.id !== userId && u.name === newName)) {
		throw new Error(`使用者 "${newName}" 已存在`);
	}

	user.name = newName;
	localStorage.setItem(USERS_KEY, JSON.stringify(users));

	// 派送事件通知名稱變更
	window.dispatchEvent(new CustomEvent('userRenamed', { detail: { userId, newName } }));
}

/**
 * 為某個使用者取得命名空間的 localStorage key
 * 範例：userId=user_123，key=checklist → user_123:checklist
 */
export function getNamespacedKey(userId: string, key: string): string {
	return `${userId}:${key}`;
}
