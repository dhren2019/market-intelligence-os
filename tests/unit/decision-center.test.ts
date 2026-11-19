import { describe, expect, it } from "vitest";
import {
  buildAlertSummary,
  buildForecastReadiness,
  buildInvestorCoverage,
  buildValidationQueue,
} from "@/domain/decision-center/model";

describe("decision center", () => {
  it("orders only scored hypotheses and preserves the validation action", () => {
    const queue = buildValidationQueue([
      {
        id: "1",
        externalId: "A01",
        name: "Lower",
        category: "Apps",
        buyer: "Buyer A",
        legacyScore: 80,
        claimType: "hypothesis",
        rawPayload: { "Validación antes del código": "Entrevistar 5 compradores", "Regla de abandono": "Nadie paga" },
      },
      {
        id: "2",
        externalId: "A02",
        name: "Higher",
        category: "Apps",
        buyer: "Buyer B",
        legacyScore: 95,
        claimType: "hypothesis",
        rawPayload: { "Validación antes de construir": "Cobrar dos pilotos", "Criterio para parar": "Cero pilotos" },
      },
      {
        id: "3",
        externalId: "A03",
        name: "Missing score",
        category: "Apps",
        buyer: "Buyer C",
        legacyScore: null,
        claimType: "hypothesis",
        rawPayload: {},
      },
      {
        id: "4",
        externalId: "A04",
        name: "Observed record",
        category: "Apps",
        buyer: "Buyer D",
        legacyScore: 99,
        claimType: "observed",
        rawPayload: {},
      },
    ]);

    expect(queue.map((item) => item.externalId)).toEqual(["A02", "A01"]);
    expect(queue[0]).toMatchObject({ action: "Cobrar dos pilotos", stopRule: "Cero pilotos", rank: 1 });
    expect(queue[0].basis).toBe("Score legado del Excel; no es evidencia comercial");
  });

  it("creates alerts only from explicit source failures or observed comparable changes", () => {
    const alerts = buildAlertSummary({
      sources: [
        { id: "ine", name: "INE", status: "active", lastError: null },
        { id: "github", name: "GitHub", status: "error", lastError: "rate limit" },
      ],
      trends: [
        { topic: "single", metricName: "One point", sampleSize: 1, status: "insufficient_data", windows: [] },
        {
          topic: "cpi",
          metricName: "CPI",
          sampleSize: 12,
          status: "observed_change",
          windows: [{ days: 30, percentChange: -3.2 }],
        },
      ],
    });

    expect(alerts).toHaveLength(2);
    expect(alerts.map((alert) => alert.kind)).toEqual(["source_error", "observed_change"]);
    expect(alerts.some((alert) => alert.title.includes("single"))).toBe(false);
  });

  it("publishes a forecast only when a backtest beats its baseline", () => {
    const readiness = buildForecastReadiness({
      topics: [
        { topic: "short", sampleSize: 1, frequency: "unknown" },
        { topic: "tested", sampleSize: 24, frequency: "monthly" },
      ],
      forecasts: [
        { id: "forecast-1", topic: "tested", horizonDays: 30, method: "ewma", status: "ready", pointValue: 3, unit: "percent" },
      ],
      backtests: [
        { forecastId: "forecast-1", modelError: 1.2, baselineError: 1.4, sampleSize: 8, passed: true },
      ],
    });

    expect(readiness.find((row) => row.topic === "short")?.status).toBe("insufficient_history");
    expect(readiness.find((row) => row.topic === "tested")?.status).toBe("publishable");

    const blocked = buildForecastReadiness({
      topics: [{ topic: "tested", sampleSize: 24, frequency: "monthly" }],
      forecasts: [{ id: "forecast-1", topic: "tested", horizonDays: 30, method: "ewma", status: "ready", pointValue: 3, unit: "percent" }],
      backtests: [{ forecastId: "forecast-1", modelError: 1.5, baselineError: 1.4, sampleSize: 8, passed: false }],
    });
    expect(blocked[0].status).toBe("baseline_not_beaten");
    expect(blocked[0].pointValue).toBeNull();
  });

  it("reports missing investor coverage instead of zero investment", () => {
    expect(buildInvestorCoverage([], [])).toEqual({
      investorCount: 0,
      documentedEventCount: 0,
      disclosedAmountCount: 0,
      status: "no_verified_data",
      message: "No hay eventos de inversión documentados en la base local.",
    });
  });
});
