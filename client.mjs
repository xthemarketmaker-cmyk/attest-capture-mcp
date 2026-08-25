export async function captureUrl({
  apiBase = "https://getattest.com.au",
  apiKey,
  input,
  fetcher = fetch,
} = {}) {
  if (!apiKey) throw new Error("ATTEST_CAPTURE_KEY is required");
  const response = await fetcher(`${String(apiBase).replace(/\/$/, "")}/api/v1/capture`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
      "user-agent": "attest-capture-mcp/0.1.0",
    },
    body: JSON.stringify(input),
  });
  const text = await response.text();
  let result;
  try {
    result = text ? JSON.parse(text) : {};
  } catch {
    result = {};
  }
  if (!response.ok) throw new Error(`Attest Capture ${response.status}: ${result.error || "request_failed"}`);
  return result;
}
