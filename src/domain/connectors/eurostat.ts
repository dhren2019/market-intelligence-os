import { fetchJsonWithPolicy } from "@/domain/connectors/http";
import type {
  CanonicalObservation,
  Connector,
  FetchJson,
  PublicSourceDefinition,
} from "@/domain/connectors/types";

const SOURCE_URL =
  "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/nama_10_gdp?lang=en&geo=ES&na_item=B1GQ&unit=CP_MEUR&sinceTimePeriod=2016";

export const eurostatSource: PublicSourceDefinition = {
  id: "source-eurostat-gdp-es",
  slug: "eurostat-gdp-es",
  name: "Eurostat — PIB España",
  documentationUrl: "https://ec.europa.eu/eurostat/web/user-guides/data-browser/api-data-access/api-introduction",
  scope: "PIB a precios de mercado, España, precios corrientes en millones de euros",
  license: "European Commission reuse policy; attribution required",
  authRequired: false,
  rateLimit: "Extracciones grandes pueden requerir modo asíncrono; consulta anual acotada",
  cost: "free",
};

type JsonStat = {
  id?: string[];
  size?: number[];
  dimension?: Record<string, { category?: { index?: Record<string, number> | string[] } }>;
  value?: Record<string, number | null> | Array<number | null>;
  status?: Record<string, string> | string[];
};

function orderedCategories(index: Record<string, number> | string[] | undefined): string[] {
  if (Array.isArray(index)) return index;
  return Object.entries(index ?? {})
    .sort(([, left], [, right]) => left - right)
    .map(([key]) => key);
}

function indexedValue<T>(values: Record<string, T> | T[] | undefined, index: number): T | undefined {
  return Array.isArray(values) ? values[index] : values?.[String(index)];
}

export function createEurostatConnector(options: { fetchJson?: FetchJson } = {}): Connector {
  const fetchJson = options.fetchJson ?? ((url) => fetchJsonWithPolicy(url));
  return {
    source: eurostatSource,
    async fetch() {
      const { payload, fetchedAt } = await fetchJson(SOURCE_URL);
      if (!payload || typeof payload !== "object") {
        throw new Error("Respuesta Eurostat inesperada");
      }
      const dataset = payload as JsonStat;
      const timePosition = dataset.id?.indexOf("time") ?? -1;
      if (timePosition < 0 || !dataset.dimension?.time) {
        throw new Error("Respuesta Eurostat sin dimensión temporal");
      }
      const periods = orderedCategories(dataset.dimension.time.category?.index);
      const timeStride = (dataset.size ?? []).slice(timePosition + 1).reduce((a, b) => a * b, 1);
      const observations: CanonicalObservation[] = [];

      for (let timeIndex = 0; timeIndex < periods.length; timeIndex += 1) {
        const flatIndex = timeIndex * timeStride;
        const value = indexedValue(dataset.value, flatIndex);
        if (typeof value !== "number" || !Number.isFinite(value)) continue;
        const period = periods[timeIndex];
        const status = indexedValue(dataset.status, flatIndex);
        observations.push({
          externalId: `nama_10_gdp:CP_MEUR:B1GQ:ES:${period}`,
          topic: "economy:spain:gdp-current-prices",
          metricName: "gross_domestic_product_current_prices",
          value,
          unit: "million_eur",
          country: "ES",
          period,
          observedAt: new Date(`${period}-12-31T00:00:00.000Z`),
          publishedAt: null,
          fetchedAt,
          sourceUrl: SOURCE_URL,
          dataQuality: status?.includes("p") ? "provisional" : "official",
          claimType: "observed",
          methodologyVersion: "eurostat-jsonstat-v1",
          rawPayload: { dataset: "nama_10_gdp", status: status ?? null },
        });
      }
      return { source: eurostatSource, observations, metadata: { dataset: "nama_10_gdp" } };
    },
  };
}
