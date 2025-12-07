# Local storage mini-DB (Expense Tracker)

This project includes a tiny `localStorage`-backed service used by the example expense tracker UI.

- Location: `src/services/localDb.ts`
- Types: `src/types/expense.ts`

It exposes async CRUD methods similar to a remote API:

- `getAll(): Promise<Expense[]>`
- `getById(id: string): Promise<Expense | null>`
- `create(input: NewExpense): Promise<Expense>`
- `update(id: string, patch: Partial<Expense>): Promise<Expense | null>`
- `delete(id: string): Promise<boolean>`
- `clear(): Promise<void>`

Swapping to a real API later is simple: create a module with the same exported method names that calls `fetch`/GraphQL/your client instead of `localStorage`, then update imports in the app (for example swap `import localDb from './services/localDb'` to `import api from './services/api'`).

Quick dev notes:

1. Start dev server:

```bash
npm install
npm run dev
```

2. The example UI lives in `src/App.tsx` and demonstrates adding, editing, and deleting expenses.

3. Tailwind setup

To enable the Tailwind-based UI, install dev dependencies and restart the dev server:

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm run dev
```

I already added `tailwind.config.cjs` and `postcss.config.cjs`, and the app uses Tailwind utility classes in `src/App.tsx` and `src/index.css`.
