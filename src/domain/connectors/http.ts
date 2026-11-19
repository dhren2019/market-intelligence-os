import type { FetchJsonResult } from "@/domain/connectors/types";

type FetchPolicyOptions = {
  fetchImpl?: typeof fetch;
  maxAttempts?: number;
  timeoutMs?: number;
  sleep?: (milliseconds: number) => Promise<void>;
  headers?: HeadersInit;
};

const defaultSleep = (milliseconds: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, milliseconds));

function retryDelay(response: Response, attempt: number): number | null {
  const retryAfter = response.headers.get("retry-after");
  if (retryAfter !== null) {
    const seconds = Number(retryAfter);
    if (Number.isFinite(seconds)) return Math.max(0, seconds * 1_000);
    const timestamp = Date.parse(retryAfter);
    if (Number.isFinite(timestamp)) return Math.max(0, timestamp - Date.now());
  }

  const exhausted = response.headers.get("x-ratelimit-remaining") === "0";
  if (response.status === 429 || response.status >= 500 || (response.status === 403 && exhausted)) {
    return Math.min(30_000, 500 * 2 ** (attempt - 1));
  }
  return null;
}

export async function fetchJsonWithPolicy(
  url: string,
  options: FetchPolicyOptions = {},
): Promise<FetchJsonResult> {
  const fetchImpl = options.fetchImpl ?? fetch;
  const maxAttempts = options.maxAttempts ?? 3;
  const timeoutMs = options.timeoutMs ?? 15_000;
  const sleep = options.sleep ?? defaultSleep;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetchImpl(url, {
        headers: {
          accept: "application/json",
          "user-agent": "Market-Intelligence-OS/0.1",
          ...options.headers,
        },
        signal: controller.signal,
      });
      if (response.ok) {
        return { payload: (await response.json()) as unknown, fetchedAt: new Date() };
      }

      const delay = retryDelay(response, attempt);
      if (delay === null || attempt === maxAttempts) {
        throw new Error(`HTTP ${response.status} ${response.statusText} al consultar ${url}`);
      }
      await sleep(delay);
    } catch (error) {
      if (error instanceof Error && error.message.startsWith("HTTP ")) throw error;
      if (attempt === maxAttempts) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`No se pudo consultar ${url}: ${message}`);
      }
      await sleep(Math.min(30_000, 500 * 2 ** (attempt - 1)));
    } finally {
      clearTimeout(timeout);
    }
  }

  throw new Error(`No se pudo consultar ${url}`);
}
