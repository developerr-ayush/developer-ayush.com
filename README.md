# Turborepo starter

This Turborepo starter is maintained by the Turborepo core team.

## Using this example

Run the following command:

```sh
npx create-turbo@latest
```

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `docs`: a [Next.js](https://nextjs.org/) app
- `web`: another [Next.js](https://nextjs.org/) app
- `@repo/ui`: a stub React component library shared by both `web` and `docs` applications
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Build

To build all apps and packages, run the following command:

```
cd my-turborepo
pnpm build
```

### Develop

To develop all apps and packages, run the following command:

```
cd my-turborepo
pnpm dev
```

### Remote Caching

> [!TIP]
> Vercel Remote Cache is free for all plans. Get started today at [vercel.com](https://vercel.com/signup?/signup?utm_source=remote-cache-sdk&utm_campaign=free_remote_cache).

Turborepo can use a technique known as [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup?utm_source=turborepo-examples), then enter the following commands:

```
cd my-turborepo
npx turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

```
npx turbo link
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks)
- [Caching](https://turbo.build/repo/docs/core-concepts/caching)
- [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching)
- [Filtering](https://turbo.build/repo/docs/core-concepts/monorepos/filtering)
- [Configuration Options](https://turbo.build/repo/docs/reference/configuration)
- [CLI Usage](https://turbo.build/repo/docs/reference/command-line-reference)

## Local development with Docker (admin/API)

```sh
docker compose up --build            # Postgres + apps/backend on http://localhost:3001
SEED_ON_START=1 docker compose up    # also load slang + demo users (owner@example.com / demo-password-123)
docker compose down -v               # wipe the local database
```

- Local runs against its **own Postgres container**; it refuses to start if `DATABASE_URL` isn't that container, so production data is never touched.
- Put optional secrets (Cloudinary, Gemini, ...) in `apps/backend/.env.docker` (git-ignored).
- The committed Prisma migrations don't cover the full schema, so local uses `prisma db push`.
- After changing dependencies: `docker compose build && docker compose down -v`.
- Production is unchanged: Vercel with your hosted `DATABASE_URL` set in project env vars.

## MCP server (`/api/mcp`)

Tools: `login`, `create_blog`, `update_blog`, `get_blog`, `list_blogs`, `upload_image` (URL or base64 → Cloudinary), `list_categories`, `create_category`, `list_products`, `create_product`, `update_product`, `list_slang`, `moderate_slang`.

Auth (any one):
- **OAuth 2.1 (claude.ai, ChatGPT):** add `https://admin.developer-ayush.com/api/mcp` as a custom connector with no manual credentials. The client discovers `/.well-known/oauth-protected-resource`, registers itself (`/api/oauth/register`), and sends you to `/oauth/authorize` to sign in with your admin email and password and approve. Access tokens last 1 hour and refresh for 30 days; deleting a user or changing their role takes effect on the next call. Stateless: codes, tokens and clients are signed JWTs (secret: `MCP_JWT_SECRET`, else `AUTH_SECRET`; rotating it signs every connector out). Requests with no `Authorization` header get `401` + `WWW-Authenticate` (only `login` and `session_token` calls are allowed without one).
- `Authorization: Bearer <MCP_API_KEY>`: set `MCP_API_KEY` (a long random string) and optionally `MCP_API_USER_EMAIL` (the account it acts as; default: first SUPER_ADMIN). Use this for ChatGPT and other clients that can't run a login step.
- `login` tool → pass the returned `session_token` (or send it as the bearer). Tokens last 4 hours; signed with `MCP_JWT_SECRET` (falls back to `AUTH_SECRET`).

Blog `content` is validated before saving: Editor.js JSON with block types header, paragraph, list, table, image, code, embed, quote, delimiter, or plain text (split on blank lines). Invalid content is rejected with the exact block and reason. Duplicate titles and bad slugs are reported clearly.

## Gemini models

`GET /api/ai/models` lists the Gemini models your `GEMINI_API_KEY` can use (live from Google, cached 10 min); the AI sheet uses it. Flash is the default (`config/ai-config.json`).
