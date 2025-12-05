# Copilot Instructions for WWM

- Stack: SvelteKit 2 + Svelte 5 (Runes) + TypeScript; Tailwind CSS v4 via `@tailwindcss/vite`; mdsvex enabled (`.svelte` + `.svx`).
- Dev commands: `npm run dev|build|preview|check|check:watch|format|lint` (ts/svelte type-checks are strict).
- Layout/routing: `src/routes/+layout.svelte` wires `Header` and `Sidebar` with `$state` toggles for search/menu and applies global `layout.css`; child routes render via `{@render children()}`.
- Styling: global theme tokens and shared styles (`app-card`, `btn-invert`, animations) live in `src/routes/layout.css`; Tailwind imported there (no `tailwind.config.js`). Keep new styles aligned with these tokens.
- Runes conventions: use `let { ... } = $props()` (no `export let`), `$state()` for mutable state, `$derived()`/`$derived.by` for computed, `$bindable` for two-way props, `$effect` for side effects, and `{@render children()}` for slots.
- State persistence: `src/lib/stores.ts` defines `createLocalStorage` wrapper around `writable` + `localStorage` (keys: `yanyunChecklist`, `yanyunCounts`, `yanyunLifetime`, `yanyunHidden`, `yanyunBaiye`, `yanyunTimers`); only run in browser using `$app/environment` guard.
- Checklist app (`/待辦清單`): data in `src/lib/data/checklist.ts` typed by `ChecklistTask`; logic centralized in `useChecklistLogic` (`src/lib/utils/checklistLogic.ts`) for toggles, counters, lifetime tracking, reset with `confirm`, and day-based visibility. UI composed from `TaskSection`, `TaskCard`, `CounterCard`, `WeeklyGroupCard`, `ProgressCard`, `PartyAlert`; lifetime bars render when `trackLifetime`/`limit` set. Derive visible tasks via `logic.getVisibleDailyTasks()` and store updates via injected callbacks.
- Timer (`/計時器`): items in `src/lib/data/timer.ts`; grouping by `cat` done locally; timers persisted in `timerState` and updated to `Date.now()+24h` on “已採集”; interval ticks every 60s. `formatTime` expects ms diff; reset removes key from store.
- Build planner (`/流派`): definitions in `src/lib/data/build.ts` (`buildStyles`, `gearData`, `affixData`); UI picks style and optional branch, derives `currentRec` via `$derived.by`; gear cards show recommendations from data file.
- Additional data: `resourceData` (`src/lib/data/resources.ts`) for shop/resource tips; `types.ts` holds shared interfaces (ChecklistTask, TimerItem, BuildStyle, GearData, ResourceItem).
- Navigation/search: `Header` uses `goto` to `/搜尋?q=...` and `$bindable` props; `Sidebar` slide-in menu driven by `menuActive` binding and static link lists.
- UX patterns: buttons often re-use `btn-invert`; cards use `app-card` with subtle shadows; avoid inline `export let` or legacy reactive statements.
- Assets/aliases: import media via `$lib/assets/*`; `$lib` resolves to `src/lib`.

When adding features, prefer extending data files + typed models, reuse `createLocalStorage` for persistence, and follow existing Runes + Tailwind utility style. Ask if unsure about domain-specific task logic.
