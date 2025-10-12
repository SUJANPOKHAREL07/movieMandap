# frontend

This is the Next.js + Tailwind frontend for Cine Gudi. It fetches movie data from the backend GraphQL endpoint and renders it.

Environment

-- NEXT_PUBLIC_GRAPHQL_URL (optional): full URL to the backend GraphQL endpoint. Defaults to `http://localhost:8000/graphql`.
-- NEXT_PUBLIC_BACKEND_URL (optional): base URL used to build poster image urls. Defaults to `http://localhost:8000`.

Run

```bash
# from repo root
npm --prefix apps/frontend run dev
```

Notes

- The frontend page-server calls the GraphQL endpoint at render time. Make sure the backend is running at the URL above.
