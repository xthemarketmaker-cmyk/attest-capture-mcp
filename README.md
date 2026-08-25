# Attest Capture MCP

Stdio MCP server exposing one tool: `capture_url`. It wraps the Attest Capture API and returns a signed artifact URL, SHA-256 digest, capture timestamp and optional public evidence page.

This package is staged for review and is not published to npm yet.

## Environment

- `ATTEST_CAPTURE_KEY` — required Capture API key.
- `ATTEST_CAPTURE_API` — optional API origin; defaults to `https://getattest.com.au`.

## Run from this repository

```powershell
cd packages\attest-capture-mcp
npm install
$env:ATTEST_CAPTURE_KEY='attest_cap_...'
node index.mjs
```

## Claude Desktop or Cursor

Use an absolute path in the client configuration:

```json
{
  "mcpServers": {
    "attest-capture": {
      "command": "node",
      "args": ["E:/EMPIRE/01-PROJECTS/ecom/agentstack/packages/attest-capture-mcp/index.mjs"],
      "env": {
        "ATTEST_CAPTURE_KEY": "attest_cap_..."
      }
    }
  }
}
```

## Future npm configuration

After the package owner publishes it:

```json
{
  "mcpServers": {
    "attest-capture": {
      "command": "npx",
      "args": ["-y", "attest-capture-mcp"],
      "env": {
        "ATTEST_CAPTURE_KEY": "attest_cap_..."
      }
    }
  }
}
```

## Tool input

```json
{
  "url": "https://example.com",
  "format": "png",
  "full_page": true,
  "viewport": { "width": 1440, "height": 900 },
  "attest": true
}
```

`format` accepts `png`, `pdf` or `html`. PNG and HTML cost 1 credit; PDF costs 2. Capture targets must resolve to public HTTP or HTTPS addresses.
