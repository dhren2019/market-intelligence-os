import { fetchJsonWithPolicy } from "@/domain/connectors/http";
import type {
  CanonicalObservation,
  Connector,
  FetchJson,
  PublicSourceDefinition,
} from "@/domain/connectors/types";

const SERIES_ID = "IPC251856";
const SOURCE_URL = `https://servicios.ine.es/wstempus/js/ES/DATOS_SERIE/${SERIES_ID}?nult=24&tip=AM`;

export const ineSource: PublicSourceDefinition = {
  id: "source-ine-tempus-ipc",
  slug: "ine-tempus-ipc",
  name: "INE Tempus — variación anual del IPC general",
  documentationUrl: "https://www.ine.es/dyngs/DataLab/manual.html?cid=45",
  scope: "Variación anual del índice general de precios de consumo de España; serie IPC251856",
  license: "INE reuse terms; attribution required",
  authRequired: false,
  rateLimit: "No publicado; uso conservador diario",
  cost: "free",
};

type InePoint = {
  Fecha?: string;
  T3_TipoDato?: string;
  Valor?: number;
  Secreto?: boolean;
};
type IneSeries = { COD?: string; Nombre?: string; Data?: InePoint[] };

function parseIneDate(value: string): { date: Date; period: string } | null {
  const legacy = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  if (legacy) {
    const [, day, month, year] = legacy;
    return {
      date: new Date(`${year}-${month}-${day}T00:00:00.000Z`),
      period: `${year}-${month}`,
    };
  }
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return null;
  return {
    date,
    period: value.slice(0, 7),
  };
}

export function createIneConnector(options: { fetchJson?: FetchJson } = {}): Connector {
  const fetchJson = options.fetchJson ?? ((url) => fetchJsonWithPolicy(url));
  return {
    source: ineSource,
    async fetch() {
      const { payload, fetchedAt } = await fetchJson(SOURCE_URL);
      if (!payload || typeof payload !== "object") throw new Error("Respuesta INE inesperada");
      const seriesList = Array.isArray(payload) ? payload : [payload];
      const observations: CanonicalObservation[] = [];

      for (const series of seriesList as IneSeries[]) {
        for (const point of series.Data ?? []) {
          if (point.Secreto || typeof point.Valor !== "number" || !point.Fecha) continue;
          const parsed = parseIneDate(point.Fecha);
          if (!parsed) continue;
          observations.push({
            externalId: `${series.COD ?? SERIES_ID}:${parsed.period}`,
            topic: "economy:spain:cpi-annual-change",
            metricName: "consumer_price_index_annual_change",
            value: point.Valor,
            unit: "percent",
            country: "ES",
            period: parsed.period,
            observedAt: parsed.date,
            publishedAt: null,
            fetchedAt,
            sourceUrl: SOURCE_URL,
            dataQuality: point.T3_TipoDato?.toLowerCase().includes("provisional")
              ? "provisional"
              : "official",
            claimType: "observed",
            methodologyVersion: "ine-tempus-ipc-v1",
            rawPayload: { seriesCode: series.COD, seriesName: series.Nombre, point },
          });
        }
      }
      return { source: ineSource, observations, metadata: { seriesId: SERIES_ID } };
    },
  };
}
