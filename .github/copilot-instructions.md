# Copilot Instructions for WWM

## Project Overview

This is a **SvelteKit** project using **Svelte 5** with **Runes API**, **TypeScript**, and **Tailwind CSS v4**. The project is scaffolded from the official `sv` CLI tool and configured with mdsvex for markdown-in-Svelte support.

## Stack & Key Dependencies

- **Framework**: SvelteKit 2.x with file-based routing
- **UI**: Svelte 5 (uses runes like `$props()`, `$state()`, `$derived()`)
- **Styling**: Tailwind CSS 4.x via `@tailwindcss/vite` plugin
- **Content**: mdsvex for `.svx` files (markdown components)
- **TypeScript**: Strict mode enabled
- **Build**: Vite 7.x

## Development Commands

```bash
npm run dev              # Start dev server
npm run build            # Production build
npm run preview          # Preview production build
npm run check            # TypeScript + Svelte type checking
npm run check:watch      # Type checking in watch mode
npm run format           # Format with Prettier
npm run lint             # Check formatting
```

## Project Structure

```
src/
  routes/           # File-based routing (SvelteKit conventions)
    +page.svelte    # Route pages
    +layout.svelte  # Layout wrapper
    layout.css      # Global Tailwind imports
  lib/              # Shared code (aliased as $lib)
    assets/         # Static assets imported in code
  app.html          # Root HTML template
```

## Important Conventions

### Svelte 5 Runes (Not Options API)

This project uses **Svelte 5**, which means:
- Use `let { propName } = $props()` for component props (NOT `export let`)
- Use `$state()` for reactive variables (NOT plain `let`)
- Use `$derived()` for computed values (NOT reactive statements)
- Use `{@render children()}` for slot rendering

Example from `+layout.svelte`:
```svelte
<script lang="ts">
  let { children } = $props();
</script>
{@render children()}
```

### Styling with Tailwind CSS 4

- Import Tailwind in `src/routes/layout.css` using `@import 'tailwindcss'`
- Use `@plugin` directive for Tailwind plugins (see `layout.css`)
- Tailwind is configured via Vite plugin in `vite.config.ts` (NOT `tailwind.config.js`)
- Use utility classes directly in components

### File-based Routing

- `+page.svelte` = route component
- `+layout.svelte` = layout wrapper
- `+page.server.ts` = server-side data loading
- `+page.ts` = universal data loading
- File extensions: `.svelte` and `.svx` (mdsvex)

### mdsvex Support

The project supports `.svx` files (markdown with Svelte components):
- Configured in `svelte.config.js` with both preprocessors: `vitePreprocess()` and `mdsvex()`
- Valid extensions: `.svelte` and `.svx`

### Module Aliases

- `$lib` → `src/lib` (configured by SvelteKit)
- Import assets from `$lib/assets/` for Vite processing

## Type Checking

- TypeScript strict mode enabled
- Extends generated `.svelte-kit/tsconfig.json`
- Run `npm run check` before committing
- Path aliases handled by SvelteKit's configuration

## Common Patterns

When creating new routes, follow SvelteKit's `+` file naming convention. When writing components, use Svelte 5's runes API exclusively—avoid legacy syntax.
