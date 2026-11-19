import type { ClaimType } from "@/domain/evidence";

export type PublicSourceDefinition = {
  id: string;
  slug: string;
  name: string;
  documentationUrl: string;
  scope: string;
  license: string;
  authRequired: boolean;
  rateLimit: string;
  cost: "free";
};

export type CanonicalObservation = {
  externalId: string;
  topic: string;
  metricName: string;
  value: number;
  unit: string;
  country: string;
  period: string;
  observedAt: Date;
  publishedAt: Date | null;
  fetchedAt: Date;
  sourceUrl: string;
  dataQuality: "official" | "provisional" | "proxy";
  claimType: ClaimType;
  methodologyVersion: string;
  rawPayload: Record<string, unknown>;
};

export type ConnectorResult = {
  source: PublicSourceDefinition;
  observations: CanonicalObservation[];
  metadata: Record<string, unknown>;
};

export type FetchJsonResult = { payload: unknown; fetchedAt: Date };
export type FetchJson = (url: string, init?: RequestInit) => Promise<FetchJsonResult>;

export type Connector = {
  source: PublicSourceDefinition;
  fetch(): Promise<ConnectorResult>;
};
