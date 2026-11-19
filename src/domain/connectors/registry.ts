import type { Connector } from "@/domain/connectors/types";
import { createEurostatConnector } from "@/domain/connectors/eurostat";
import { createGitHubConnector } from "@/domain/connectors/github";
import { createIneConnector } from "@/domain/connectors/ine";

export function createPublicConnectors(): Connector[] {
  return [
    createIneConnector(),
    createEurostatConnector(),
    createGitHubConnector({ token: process.env.GITHUB_TOKEN }),
  ];
}
