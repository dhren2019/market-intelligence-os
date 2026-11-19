export type TrendPoint = { observedAt: Date; value: number };
export type TrendWindow = {
  days: 7 | 30 | 90;
  from: Date;
  to: Date;
  startValue: number;
  endValue: number;
  absoluteChange: number;
  percentChange: number | null;
};

export type TrendAnalysis = {
  status: "insufficient_data" | "observed_change";
  sampleSize: number;
  windows: TrendWindow[];
  prediction: null;
};

export function analyseTrend(points: TrendPoint[]): TrendAnalysis {
  const ordered = points
    .filter((point) => Number.isFinite(point.value) && Number.isFinite(point.observedAt.getTime()))
    .toSorted((left, right) => left.observedAt.getTime() - right.observedAt.getTime());
  if (ordered.length < 2) {
    return { status: "insufficient_data", sampleSize: ordered.length, windows: [], prediction: null };
  }

  const current = ordered.at(-1)!;
  const windows: TrendWindow[] = [];
  const toleranceDays: Record<7 | 30 | 90, number> = { 7: 2, 30: 7, 90: 14 };
  for (const days of [7, 30, 90] as const) {
    const threshold = current.observedAt.getTime() - days * 86_400_000;
    const baseline = ordered.filter((point) => point.observedAt.getTime() <= threshold).at(-1);
    if (!baseline || threshold - baseline.observedAt.getTime() > toleranceDays[days] * 86_400_000) continue;
    const absoluteChange = current.value - baseline.value;
    windows.push({
      days,
      from: baseline.observedAt,
      to: current.observedAt,
      startValue: baseline.value,
      endValue: current.value,
      absoluteChange,
      percentChange: baseline.value === 0 ? null : (absoluteChange / baseline.value) * 100,
    });
  }

  return {
    status: windows.length > 0 ? "observed_change" : "insufficient_data",
    sampleSize: ordered.length,
    windows,
    prediction: null,
  };
}
