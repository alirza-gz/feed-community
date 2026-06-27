# Feed Community

An extensible MVP for a community Q&A product. Users can browse, search, filter, and sort questions; load more results as they scroll; open a question with its answers and related questions; and create a new question. The application uses Next.js App Router, TanStack Query, Zod, and Zustand.

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:3000/questions`.

```bash
npm run lint
npm run build
```

## Project Structure

```text
src/
  app/                      App Router pages, route boundaries, and API routes
    api/v1/community/        Community HTTP API
    dashboard/               Question and Answer Management Dashboard
    questions/               Feed, detail, and create-question routes
  features/
    questions/               Question UI, query hooks, schema, API client, and types
    dashboard/components     Question and Answer Management Dashboard
    answers/                 Answer UI, mutations, schema, API client, and types
  shared/                    Reusable UI, hooks, formatting helpers, and UI store
  server/                    Storage abstraction and HTTP helpers
```

The project is organised by feature, rather than by file type. A new product area can add its components, API client, schemas, and query hooks under `src/features/<feature>` without changing existing feature folders.

## Architecture Decisions

- **Feature boundaries:** Questions and answers own their presentational components, validation schemas, API clients, types, and query hooks. Shared code is only placed in `src/shared` when it has no domain-specific knowledge.
- **Thin routes:** App Router pages compose feature components. HTTP route handlers validate requests and delegate storage operations to `src/server/db.ts`; neither UI code nor route handlers directly manipulate the storage arrays.
- **Storage abstraction:** The current store is intentionally in-memory for the MVP. It is isolated behind exported functions, so replacing it with a database repository does not require changes to UI or API consumers.
- **Shared validation:** Zod schemas validate input in the form and again in the route handler. Client validation improves feedback speed, while server validation keeps the API trustworthy.
- **Shared query keys:** TanStack Query keys live with each feature's query hooks. Mutations can invalidate the correct resource without duplicating cache-key strings across components.
- **Clear state ownership:** Feed search, tag, and sort are URL state because they are shareable and back-button friendly. Server data belongs to TanStack Query. Toasts and durable UI preferences belong to Zustand. Form drafts and tag-input text are component-local state.

## Rendering Strategy

### `/questions`

- Rendering: static shell with client-side data fetching.
- Reasoning: the page frame is stable and can be prerendered. Search, tag, sort, and cursor are driven by the URL, so TanStack Query fetches and caches only the feed data that matches the current URL.

### `/questions/[id]`

- Rendering: dynamic server-rendered page.
- Reasoning: a question is addressed by ID and should render useful initial content for direct links and sharing. Related questions are resolved with the question on the server. The interactive answers area is loaded as a client island.

### `/questions/new`

- Rendering: static page shell.
- Reasoning: the route has no request-specific data, so it can be served immediately and the form logic can run entirely on the client.

## Data Fetching Strategy

- **Why TanStack Query:** The feed and answers are browser-side, changing server data. TanStack Query provides cache ownership, request deduplication, retry behaviour, mutation lifecycle support, and targeted invalidation without custom global async-state code.
- **Feed endpoint selection:** The question API client uses the dedicated search route when a search term is present and the normal feed route otherwise. Both return the same cursor-based `QuestionPage` contract, so the UI has one rendering path.
- **Cursor pagination:** `useInfiniteQuery` requests the next cursor only when the user reaches the sentinel or selects the accessible "Load more" fallback. This avoids fetching the entire feed up front.
- **Loading, error, and empty states:** Route-level `loading.tsx` files and skeletons cover navigation; query-level error surfaces expose a retry action; shared empty states cover no questions, no search results, and no answers.
- **Mutations:** Question creation validates server responses before navigation. Answer creation uses an optimistic update, then rolls back and reports an error when the request fails.

## State Management

- URL state: search term, tag filter, and sort order on the questions feed.
- Global state: toast notifications and the user density preference in Zustand.
- Local state: form drafts, answer textarea text, and temporary tag input draft state.

## Performance Optimizations

- **Code splitting and dynamic import:** `next/dynamic` creates a separate chunk for the answers section. Its query hooks, form, and mutation code are not included in the feed bundle.
- **Lazy loading:** The answer client island is loaded only on a question detail page and only in the browser, while the question content remains server-rendered.
- **Incremental feed rendering:** Cursor-based infinite scrolling renders one page at a time rather than loading every question on first paint.
- **Debounced search:** The search input delays URL updates, preventing a new request for every keystroke.
- **Loading boundaries:** Route-level loading components and small skeletons preserve responsive navigation while code or data is loading.

## Error Handling

- App-level error boundary: `src/app/error.tsx`
- Root-level fatal error boundary: `src/app/global-error.tsx`
- 404 page: `src/app/not-found.tsx`
- Segment-level 404 for question details: `src/app/questions/[id]/not-found.tsx`

## API Surface

- `GET /api/v1/community/questions`
- `GET /api/v1/community/questions/search`
- `GET /api/v1/community/questions/{id}`
- `POST /api/v1/community/questions`
- `PATCH /api/v1/community/questions/{id}`
- `DELETE /api/v1/community/questions/{id}`
- `GET /api/v1/community/questions/me`
- `GET /api/v1/community/tags`
- `GET /api/v1/community/answers?questionId=...`
- `POST /api/v1/community/answers`
- `PATCH /api/v1/community/answers/{id}`
- `DELETE /api/v1/community/answers/{id}`
- `GET /api/v1/community/answers/me`
- `POST /api/v1/community/upload/v2` with multipart field `file`
- `POST /api/v1/community/questions/{id}/attachments` with `{ "uploadId": "..." }`
- `POST /api/v1/community/answers/{id}/attachments` with `{ "uploadId": "..." }`

## What I Would Improve With One More Day

- Replace the in-memory store with a database-backed repository, object storage for upload bytes, and durable attachment records.
- Add authentication and authorization so edit, delete, and "my" endpoints enforce ownership rather than relying on the demo user.
- Add unit tests for validation and repositories, integration tests for API route error cases, and browser tests for filter URL state, infinite scrolling, and optimistic answer rollback.
- Add request logging, error monitoring, rate limiting, and upload virus/type validation for a production environment.
- Persist question and answer drafts locally so users can recover interrupted work.

## Notes

- The data layer is intentionally in-memory for this MVP, so data and staged uploads reset when the server restarts.
- Upload routes validate the multipart request and attachment size, but do not persist file bytes; a production deployment requires object storage.
- API edit, delete, "my", and attachment endpoints are implemented, but the current UI focuses on the required browse, detail, answer, and create-question MVP flows.
