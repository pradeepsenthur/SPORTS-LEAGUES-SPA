# AI and Design Notes

## AI tool usage

- Started with **Copilot plan mode** to define scope, UX flow, and component boundaries before writing code.
- Used that plan to scaffold the project and iterate in small steps (API integration, filtering, modal, caching, tests).
- **GitHub Copilot CLI** was used for scaffolding, TypeScript migration, component extraction, and iterative refactors.
- AI assistance was used for API service structure, cache strategy, accessibility improvements, and test setup (Jest).
- Copilot guidance was used to keep **React best practices**: component-based architecture, custom hooks for state logic, memoization where useful, and semantic accessible UI patterns.
- Agentic assistance was also used for **UI/a11y compliance refinements** (focus-visible states, modal focus trap, Esc-close behavior, and live error announcements).
- Final behavior and requirements alignment (fields, filters, pagination, modal flow) were manually reviewed during implementation.

## Project setup and structure

- **Initialization:** Vite React project, then migrated to TypeScript for stronger contracts and safer refactors.
- **Folder structure:**
  - `src/components/` reusable UI components (cards, filters, modal, pagination, etc.)
  - `src/hooks/` custom hook for leagues state/filter/pagination logic
  - `src/services/` API and cache layers (separated from UI)
  - `src/types.ts` shared API/domain types
  - `tests/` Jest unit tests for services
- This structure was chosen to keep UI, state, and data access concerns clearly separated.

## Design decisions

- **Framework:** React + Vite + TypeScript for fast setup with strong type safety on API and component contracts.
- **Data handling:** League data is loaded once (cache/mock/API), then filtered client-side for fast interaction.
- **Caching:** Hybrid cache (`in-memory -> localStorage`) with TTL to reduce repeat calls while preserving quick reloads.
- **Filtering UX:** Search by `strLeague` and filter by `strSport`, with pagination reset on filter changes.
- **Performance:** Fixed pagination (20 items/page) to avoid rendering a very large DOM at once.
- **League click behavior:** The entire league card is a semantic `button` that opens a modal and fetches season badge data by league ID.
- **Modal UX:** Badge area reserves space and includes skeleton/fallback to avoid layout jumps; supports `Esc` to close.
- **Responsiveness:** Grid and controls use flexible layouts (`auto-fit/auto-fill`) for mobile, tablet and desktop support.
