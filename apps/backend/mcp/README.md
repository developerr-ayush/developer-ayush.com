# Blog MCP Server

A [Model Context Protocol](https://modelcontextprotocol.io/) server that lets **Claude AI** create and manage blog posts on your portfolio backend.

## Tools

| Tool | Description |
|---|---|
| `login` | Authenticate with email/password → returns a `session_token` |
| `create_blog` | Create a blog post (banner **optional** for drafts) |
| `update_blog` | Edit an existing blog by ID |
| `get_blog` | Fetch a blog by ID or slug |
| `list_blogs` | List all blogs (paginated, filterable by status) |

## Setup

### 1. Environment variables

Copy `.env.example` to `.env` and fill in:

```bash
cp .env.example .env
```

```env
# Same DATABASE_URL as your backend
DATABASE_URL=postgresql://...

# Any strong random string
MCP_JWT_SECRET=your-secret-here
```

### 2. Build

```bash
cd apps/backend/mcp
npm install
npm run build
```

This compiles TypeScript to `dist/`.

## Connecting to Claude Desktop

Add this to your `claude_desktop_config.json`:

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "blog-manager": {
      "command": "node",
      "args": ["/absolute/path/to/apps/backend/mcp/dist/index.js"],
      "env": {
        "DATABASE_URL": "postgresql://...",
        "MCP_JWT_SECRET": "your-secret-here"
      }
    }
  }
}
```

Replace `/absolute/path/to/` with the actual path on your machine.

## Usage Flow (from Claude)

1. **Login first:**
   > "Login to the blog backend with email `admin@example.com` and password `...`"

2. **Create a draft blog (no image needed):**
   > "Create a blog post titled 'Why TypeScript is Great' about the benefits of TypeScript. Save as draft."

3. **Update / publish later:**
   > "Update blog `[id]` with status published and banner `https://cdn.example.com/banner.png`"

## Development

```bash
# Watch mode
npm run dev

# Type check only
npm run check-types

# Test with MCP Inspector
npx @modelcontextprotocol/inspector dist/index.js
```

## Notes

- Session tokens expire after **4 hours**
- `banner` is optional when `status = "draft"`. Publishing requires a banner URL
- Only ADMIN / SUPER_ADMIN roles can publish directly; other roles always create drafts
- Categories are created automatically if they don't exist
