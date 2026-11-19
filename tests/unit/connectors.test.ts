import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it, vi } from "vitest";
import { createEurostatConnector } from "@/domain/connectors/eurostat";
import { createGitHubConnector } from "@/domain/connectors/github";
import { createIneConnector } from "@/domain/connectors/ine";
import { fetchJsonWithPolicy } from "@/domain/connectors/http";

async function fixture(name: string): Promise<unknown> {
  return JSON.parse(
    await readFile(path.join(process.cwd(), "tests/fixtures/connectors", name), "utf8"),
  );
}

describe("public connectors", () => {
  it("maps INE series points into observed canonical observations", async () => {
    const payload = await fixture("ine-series.json");
    const connector = createIneConnector({
      fetchJson: vi.fn().mockResolvedValue({ payload, fetchedAt: new Date("2026-11-18T08:00:00Z") }),
    });

    const result = await connector.fetch();

    expect(result.source.slug).toBe("ine-tempus-ipc");
    expect(result.observations).toHaveLength(2);
    expect(result.observations[0]).toMatchObject({
      topic: "economy:spain:cpi-annual-change",
      metricName: "consumer_price_index_annual_change",
      value: 2.4,
      unit: "percent",
      country: "ES",
      period: "2026-09",
      claimType: "observed",
    });
    expect(result.observations[1]?.dataQuality).toBe("provisional");
  });

  it("maps Eurostat JSON-stat values, skipping absent values", async () => {
    const payload = await fixture("eurostat-gdp.json");
    const connector = createEurostatConnector({
      fetchJson: vi.fn().mockResolvedValue({ payload, fetchedAt: new Date("2026-11-18T08:00:00Z") }),
    });

    const result = await connector.fetch();

    expect(result.observations).toHaveLength(2);
    expect(result.observations[1]).toMatchObject({
      topic: "economy:spain:gdp-current-prices",
      value: 1593250,
      unit: "million_eur",
      period: "2024",
      dataQuality: "provisional",
      claimType: "observed",
    });
  });

  it("labels GitHub repository search count as a proxy, never as market demand", async () => {
    const payload = await fixture("github-search.json");
    const connector = createGitHubConnector({
      query: "topic:saas language:TypeScript",
      fetchJson: vi.fn().mockResolvedValue({ payload, fetchedAt: new Date("2026-11-18T08:00:00Z") }),
    });

    const result = await connector.fetch();

    expect(result.observations).toHaveLength(1);
    expect(result.observations[0]).toMatchObject({
      metricName: "github_repository_search_count",
      value: 1327,
      unit: "repositories",
      claimType: "proxy",
      methodologyVersion: "github-search-count-v1",
    });
    expect(result.observations[0]?.rawPayload).toMatchObject({ incompleteResults: false });
  });
});

describe("connector HTTP policy", () => {
  it("honours Retry-After once and then succeeds", async () => {
    const fetchImpl = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ message: "rate limited" }), {
          status: 429,
          headers: { "content-type": "application/json", "retry-after": "0" },
        }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { "content-type": "application/json" },
        }),
      );

    const response = await fetchJsonWithPolicy("https://example.test/data", {
      fetchImpl,
      maxAttempts: 2,
      sleep: vi.fn().mockResolvedValue(undefined),
    });

    expect(response.payload).toEqual({ ok: true });
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });

  it("does not retry permanent client errors", async () => {
    const fetchImpl = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify({ message: "not found" }), {
        status: 404,
        headers: { "content-type": "application/json" },
      }),
    );

    await expect(
      fetchJsonWithPolicy("https://example.test/missing", { fetchImpl, maxAttempts: 3 }),
    ).rejects.toThrow("HTTP 404");
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });
});
