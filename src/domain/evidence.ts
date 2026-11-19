export const claimTypes = [
  "observed",
  "proxy",
  "estimate",
  "hypothesis",
  "prediction",
  "demo",
] as const;

export type ClaimType = (typeof claimTypes)[number];

export function isRankableEvidence(claimType: ClaimType): boolean {
  return claimType === "observed" || claimType === "proxy";
}

