# 燕雲十六聲遊戲助手

集中整理每日待辦、採集計時與流派配置的輔助工具，支援亮暗色主題與離線保存。

## 功能

- 快速入口：首頁卡片導向待辦清單、採集計時器與流派配置器。
- 暗色/亮色切換：`Header` 內建動畫開關，`html.dark` 搭配 CSS 變數應用至全站。
- 待辦清單：日/週任務分區、隱藏/重置、進度條、終身紀錄與計數器。
- 採集計時器：依門派分組，24h 冷卻計時，狀態顯示及一鍵重置。
- 流派配置器：依風格/分支呈現武學與裝備推薦，樣式自適應卡片網格。
- 離線儲存：所有狀態透過 `localStorage` 持久化（檢查 `src/lib/stores.ts`）。

## 技術棧

- SvelteKit 2 + Svelte 5 (Runes) + TypeScript
- Tailwind CSS v4 via `@tailwindcss/vite`（全域樣式與主題變數集中於 `src/routes/layout.css`）
- mdsvex 已啟用，可使用 `.svx`
- Prettier + `prettier-plugin-svelte` + `prettier-plugin-tailwindcss`

## 開發指令

```sh
npm install
npm run dev        # 本地開發伺服器
npm run build      # 產生正式版
npm run preview    # 預覽正式版
npm run check      # svelte-check（嚴格型別）
npm run check:watch
npm run format     # Prettier 自動排版
npm run lint       # Prettier 檢查
```

## 專案結構重點

- `src/routes/+layout.svelte`：共用 Header / Sidebar / Toast，套用主題與版型。
- `src/routes/layout.css`：主題色票、卡片/按鈕共用樣式，支援亮暗模式切換。
- `src/routes/+page.svelte`：首頁快捷卡片與頁尾。
- `src/routes/待辦清單/+page.svelte`：待辦清單 UI 與重置入口。
- `src/routes/計時器/+page.svelte`：採集計時器分組、狀態計算與按鈕樣式。
- `src/routes/流派/+page.svelte`：流派/分支選擇、內功與裝備卡片。
- `src/lib/components/*`：Header、Sidebar、Checklist 卡片元件等。
- `src/lib/data/*`：待辦 (`checklist.ts`)、計時 (`timer.ts`)、流派配置 (`build.ts`) 資料來源。
- `src/lib/stores.ts`：`createLocalStorage` 包裝，包含 `darkMode`、計時器、待辦等狀態。

## 樣式與主題

- 亮暗主題依 `:root` / `:root.dark` 變數驅動，開關來自 Header 的 toggle。
- 通用卡片類 `app-card`、反轉按鈕類 `btn-invert` 於 `layout.css` 定義；新增頁面時建議沿用。
- 自訂漸層背景請使用 `var(--bg-primary/secondary/tertiary)` 以維持主題一致性。

## 資料維護提示

- 待辦：編輯 `src/lib/data/checklist.ts`（型別 `ChecklistTask`），對應邏輯在 `src/lib/utils/checklistLogic.ts`。
- 計時：調整 `src/lib/data/timer.ts`，24h 刷新邏輯封裝在同頁的 `startTimer/resetTimer`。
- 流派：更新 `src/lib/data/build.ts` 內的 `buildStyles`、`gearData`、`affixData`。

- 外觀圖鑑：更新 `src/lib/data/skins.ts`（型別 `SkinItem`）。新增項目時建議帶上 `image` 與 `alt` 欄位，格式範例如下：

```ts
{
	id: 'new-skin',
	name: '新外觀名稱',
	tag: '直購' | '戰令' | '和鳴',
	source: '取得來源',
	image: '/images/skins/new-skin.jpg',
	alt: '新外觀名稱 縮圖',
}
```

把圖片放到 `static/images/skins/`（或你喜歡的資料夾），並以 `image` 指向相對路徑即可。建議放到分類底下，範例如下：

如果你要上傳男女兩種變體，請用 `imageMale` / `imageFemale` 欄位或使用命名慣例：

```
static/images/skins/直購/wu-jian-wu-xiang-male.jpg
static/images/skins/直購/wu-jian-wu-xiang-female.jpg
```

前端會優先使用 `imageMale` / `imageFemale`，若未設定會 fallback 到 `image`，或嘗試使用 `{id}-{gender}.jpg` 的慣例路徑。

```
static/images/skins/
├─ 直購/
│  ├─ wu-jian-wu-xiang.jpg
│  └─ amber-veil.jpg
├─ 戰令/
│  ├─ crimson-order.jpg
│  └─ jade-rider.jpg
├─ 和鳴/
│  ├─ flame-crest.jpg
│  └─ frost-song.jpg
└─ 其他/
```

然後在 `src/lib/data/skins.ts` 的 `image` 字段使用對應分類路徑，例如：

```ts
image: '/images/skins/直購/wu-jian-wu-xiang.jpg';
```

前端會自動在列表與放大預覽顯示圖片，若沒有提供 `image` 則會顯示預留占位。

使用 `mkSkin` 範例：

````ts
import { mkSkin } from '$lib/utils/skinHelpers';

export const skinCollections = [
	{
		title: '直購',
		items: [
						mkSkin({
								name: '人間仙',
								tag: '直購',
								source: '商店',
								imageMale: '/images/skins/直購/人間仙_男.png'
						})
				]
		}
];

簡化批次寫法（帶圖片）：
```ts
import { mkSkins } from '$lib/utils/skinHelpers';

items: [
	...mkSkins([
		['無間無相', '直購', '商城直購', '/images/skins/直購/wu-jian-wu-xiang-male.jpg'],
		['烏紗紅漪', '直購', '商城直購', '/images/skins/直購/wusha-hongyi-male.jpg', '/images/skins/直購/wusha-hongyi-female.jpg'],
		'蓬萊翎'
	])
]
````

    	]
    }

];

```

## 部署

使用預設 `adapter-auto`，如需特定平台請依目標安裝對應 Adapter 後執行 `npm run build`。
```
