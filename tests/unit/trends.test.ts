import { describe, expect, it } from "vitest";
import { analyseTrend } from "@/domain/trends/engine";

describe("trend engine", () => {
  it("returns insufficient_data for a single point without manufacturing a trend", () => {
    const result = analyseTrend([
      { observedAt: new Date("2026-11-18T00:00:00Z"), value: 10 },
    ]);

    expect(result).toEqual({
      status: "insufficient_data",
      sampleSize: 1,
      windows: [],
      prediction: null,
    });
  });

  it("calculates only windows with a valid historical comparison", () => {
    const result = analyseTrend([
      { observedAt: new Date("2026-08-20T00:00:00Z"), value: 100 },
      { observedAt: new Date("2026-10-18T00:00:00Z"), value: 120 },
      { observedAt: new Date("2026-11-11T00:00:00Z"), value: 126 },
      { observedAt: new Date("2026-11-18T00:00:00Z"), value: 140 },
    ]);

    expect(result.status).toBe("observed_change");
    expect(result.windows.map((window) => window.days)).toEqual([7, 30, 90]);
    expect(result.windows[0]).toMatchObject({ absoluteChange: 14, percentChange: 11.11111111111111 });
    expect(result.prediction).toBeNull();
  });

  it("does not label a stale annual point as a 7, 30 or 90 day change", () => {
    const result = analyseTrend([
      { observedAt: new Date("2024-12-31T00:00:00Z"), value: 150 },
      { observedAt: new Date("2025-12-31T00:00:00Z"), value: 160 },
    ]);

    expect(result.status).toBe("insufficient_data");
    expect(result.windows).toEqual([]);
  });

  it("uses a monthly point for the 30 day window but not for 7 days", () => {
    const result = analyseTrend([
      { observedAt: new Date("2026-10-01T00:00:00Z"), value: 100 },
      { observedAt: new Date("2026-11-01T00:00:00Z"), value: 105 },
      { observedAt: new Date("2026-12-01T00:00:00Z"), value: 110 },
    ]);

    expect(result.windows.map((window) => window.days)).toEqual([30]);
  });
});
