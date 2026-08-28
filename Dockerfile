FROM node:22-alpine

WORKDIR /app

# Install production dependencies from the lockfile.
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Server sources. README ships with the package files list.
COPY index.mjs client.mjs README.md ./

# Placeholder so initialize / tools/list / resources/list / prompts/list answer.
# capture_url only throws on an actual tool call with a bad key.
ENV ATTEST_CAPTURE_KEY=placeholder
ENV ATTEST_CAPTURE_API=https://getattest.com.au

# Must be `node index.mjs`, not the bin name: the argv guard in index.mjs only
# starts the stdio transport when argv[1] resolves to this file.
ENTRYPOINT ["node", "index.mjs"]
