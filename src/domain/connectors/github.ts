import { fetchJsonWithPolicy } from "@/domain/connectors/http";
import type {
  Connector,
  FetchJson,
  PublicSourceDefinition,
} from "@/domain/connectors/types";

export const githubSource: PublicSourceDefinition = {
  id: "source-github-repository-search",
  slug: "github-repository-search",
  name: "GitHub repository search",
  documentationUrl: "https://docs.github.com/en/rest/search/search?apiVersion=2022-11-28#search-repositories",
  scope: "Recuento reproducible de repositorios que coinciden con una consulta; proxy de actividad técnica",
  license: "GitHub API Terms; repository metadata remains subject to its source license",
  authRequired: false,
  rateLimit: "Search API has a separate rate limit; optional GITHUB_TOKEN recommended",
  cost: "free",
};

type GitHubSearch = {
  total_count?: number;
  incomplete_results?: boolean;
  items?: unknown[];
};

function slugQuery(query: string): string {
  return query.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function createGitHubConnector(options: {
  query?: string;
  fetchJson?: FetchJson;
  token?: string;
} = {}): Connector {
  const query = options.query ?? "topic:saas language:TypeScript";
  const sourceUrl = `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=updated&order=desc&per_page=1`;
  const fetchJson = options.fetchJson ?? ((url, init) => fetchJsonWithPolicy(url, {
    headers: init?.headers,
  }));
  return {
    source: githubSource,
    async fetch() {
      const headers: HeadersInit = {
        accept: "application/vnd.github+json",
        "x-github-api-version": "2022-11-28",
      };
      if (options.token) (headers as Record<string, string>).authorization = `Bearer ${options.token}`;
      const { payload, fetchedAt } = await fetchJson(sourceUrl, { headers });
      if (!payload || typeof payload !== "object") throw new Error("Respuesta GitHub inesperada");
      const data = payload as GitHubSearch;
      if (typeof data.total_count !== "number") throw new Error("Respuesta GitHub sin total_count");
      const observedAt = new Date(fetchedAt);
      const period = observedAt.toISOString().slice(0, 10);
      return {
        source: githubSource,
        observations: [{
          externalId: `github-search:${slugQuery(query)}:${period}`,
          topic: `github:${slugQuery(query)}`,
          metricName: "github_repository_search_count",
          value: data.total_count,
          unit: "repositories",
          country: "GLOBAL",
          period,
          observedAt,
          publishedAt: null,
          fetchedAt,
          sourceUrl,
          dataQuality: "proxy",
          claimType: "proxy",
          methodologyVersion: "github-search-count-v1",
          rawPayload: {
            query,
            incompleteResults: data.incomplete_results ?? null,
            returnedItems: data.items?.length ?? 0,
          },
        }],
        metadata: { query },
      };
    },
  };
}
