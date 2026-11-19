type QueueOpportunity = {
  id: string;
  externalId: string;
  name: string;
  category: string;
  buyer: string;
  legacyScore: number | null;
  claimType: string;
  rawPayload: Record<string, unknown>;
};

export type ValidationQueueItem = QueueOpportunity & {
  rank: number;
  action: string;
  stopRule: string;
  basis: "Score legado del Excel; no es evidencia comercial";
};

function textField(payload: Record<string, unknown>, keys: string[], fallback: string): string {
  for (const key of keys) {
    const value = payload[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return fallback;
}

export function buildValidationQueue(
  opportunities: QueueOpportunity[],
  limit = 6,
): ValidationQueueItem[] {
  return opportunities
    .filter(
      (opportunity) =>
        opportunity.claimType === "hypothesis" &&
        opportunity.legacyScore !== null &&
        Number.isFinite(opportunity.legacyScore),
    )
    .toSorted((left, right) => right.legacyScore! - left.legacyScore!)
    .slice(0, limit)
    .map((opportunity, index) => ({
      ...opportunity,
      rank: index + 1,
      action: textField(
        opportunity.rawPayload,
        ["Validación antes de construir", "Validación antes del código"],
        "Entrevistar al comprador exacto y pedir una señal de pago.",
      ),
      stopRule: textField(
        opportunity.rawPayload,
        ["Criterio para parar", "Regla de abandono"],
        "Sin criterio de abandono documentado.",
      ),
      basis: "Score legado del Excel; no es evidencia comercial",
    }));
}

type AlertSource = {
  id: string;
  name: string;
  status: string;
  lastError: string | null;
};

type AlertTrend = {
  topic: string;
  metricName: string;
  sampleSize: number;
  status: "insufficient_data" | "observed_change";
  windows: Array<{ days: number; percentChange: number | null }>;
};

export type DecisionAlert = {
  id: string;
  kind: "source_error" | "observed_change";
  title: string;
  detail: string;
  severity: "attention" | "information";
};

export function buildAlertSummary({
  sources,
  trends,
}: {
  sources: AlertSource[];
  trends: AlertTrend[];
}): DecisionAlert[] {
  const sourceAlerts = sources
    .filter((source) => source.status === "error" || Boolean(source.lastError))
    .map((source) => ({
      id: `source-${source.id}`,
      kind: "source_error" as const,
      title: `${source.name}: fuente con error`,
      detail: source.lastError || "La fuente figura con estado de error.",
      severity: "attention" as const,
    }));

  const trendAlerts = trends
    .filter((trend) => trend.status === "observed_change" && trend.windows.length > 0)
    .map((trend) => {
      const latestWindow = trend.windows.at(-1)!;
      const change = latestWindow.percentChange;
      return {
        id: `trend-${trend.topic}`,
        kind: "observed_change" as const,
        title: `${trend.metricName}: cambio observado`,
        detail:
          change === null
            ? `Cambio absoluto comparable en ${latestWindow.days} días; la base era cero.`
            : `${change > 0 ? "+" : ""}${change.toFixed(1)}% en ${latestWindow.days} días, con ${trend.sampleSize} observaciones.`,
        severity: "information" as const,
      };
    });

  return [...sourceAlerts, ...trendAlerts];
}

type ForecastTopic = { topic: string; sampleSize: number; frequency: string };
type ForecastRecord = {
  id: string;
  topic: string;
  horizonDays: number;
  method: string;
  status: string;
  pointValue: number | string | null;
  unit: string | null;
};
type BacktestRecord = {
  forecastId: string;
  modelError: number | string | null;
  baselineError: number | string | null;
  sampleSize: number;
  passed: boolean;
};

export type ForecastReadiness = {
  topic: string;
  sampleSize: number;
  frequency: string;
  status: "insufficient_history" | "missing_backtest" | "baseline_not_beaten" | "publishable";
  horizonDays: number | null;
  method: string | null;
  pointValue: number | null;
  unit: string | null;
  backtestSampleSize: number | null;
};

export function buildForecastReadiness({
  topics,
  forecasts,
  backtests,
}: {
  topics: ForecastTopic[];
  forecasts: ForecastRecord[];
  backtests: BacktestRecord[];
}): ForecastReadiness[] {
  return topics.map((topic) => {
    const forecast = forecasts.find((candidate) => candidate.topic === topic.topic);
    const backtest = forecast
      ? backtests.find((candidate) => candidate.forecastId === forecast.id)
      : undefined;
    const modelError = backtest?.modelError === null || backtest?.modelError === undefined
      ? null
      : Number(backtest.modelError);
    const baselineError = backtest?.baselineError === null || backtest?.baselineError === undefined
      ? null
      : Number(backtest.baselineError);
    const beatsBaseline = Boolean(
      backtest?.passed &&
      modelError !== null &&
      baselineError !== null &&
      Number.isFinite(modelError) &&
      Number.isFinite(baselineError) &&
      modelError < baselineError,
    );

    let status: ForecastReadiness["status"];
    if (topic.sampleSize < 12) status = "insufficient_history";
    else if (!forecast || !backtest) status = "missing_backtest";
    else if (!beatsBaseline) status = "baseline_not_beaten";
    else status = "publishable";

    return {
      topic: topic.topic,
      sampleSize: topic.sampleSize,
      frequency: topic.frequency,
      status,
      horizonDays: forecast?.horizonDays ?? null,
      method: forecast?.method ?? null,
      pointValue: status === "publishable" && forecast?.pointValue !== null
        ? Number(forecast?.pointValue)
        : null,
      unit: status === "publishable" ? forecast?.unit ?? null : null,
      backtestSampleSize: backtest?.sampleSize ?? null,
    };
  });
}

type InvestorRecord = { id: string };
type FundingRecord = {
  claimType: string;
  amount: number | string | null;
};

export function buildInvestorCoverage(investors: InvestorRecord[], events: FundingRecord[]) {
  const documentedEvents = events.filter(
    (event) => !["hypothesis", "estimate", "prediction", "demo"].includes(event.claimType),
  );
  const disclosedAmountCount = documentedEvents.filter(
    (event) => event.amount !== null && Number.isFinite(Number(event.amount)),
  ).length;

  if (!investors.length && !documentedEvents.length) {
    return {
      investorCount: 0,
      documentedEventCount: 0,
      disclosedAmountCount: 0,
      status: "no_verified_data" as const,
      message: "No hay eventos de inversión documentados en la base local.",
    };
  }

  return {
    investorCount: investors.length,
    documentedEventCount: documentedEvents.length,
    disclosedAmountCount,
    status: "verified_records_available" as const,
    message: "La cobertura refleja solo registros documentados e importados.",
  };
}
