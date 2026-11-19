import path from "node:path";
import { expect, test } from "@playwright/test";

test("home answers the three decision questions with real-state labels", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Lo que sabemos. Y lo que todavía no." })).toBeVisible();
  await expect(page.getByText("¿Qué ha cambiado?")).toBeVisible();
  await expect(page.getByText("¿Hay dinero?")).toBeVisible();
  await expect(page.getByText("No demostrado")).toBeVisible();
  await expect(page.getByText("¿Podemos construirlo?")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Dónde invertir tiempo ahora" })).toBeVisible();
  await expect(page.getByText("Score legado del Excel; no es evidencia comercial").first()).toBeVisible();
});

test("all decision screens are reachable", async ({ page }) => {
  const screens = [
    ["/sectores", "Sectores y tecnología"],
    ["/oportunidades", "Oportunidades"],
    ["/apps", "Apps y productos tecnológicos"],
    ["/inversores", "Inversores"],
    ["/alertas", "Alertas"],
    ["/forecasts", "Forecasts"],
    ["/empresas", "Empresas"],
    ["/fuentes", "Fuentes"],
    ["/importaciones", "Importaciones"],
  ] as const;
  for (const [url, heading] of screens) {
    await page.goto(url);
    await expect(page.getByRole("heading", { name: heading, exact: true })).toBeVisible();
  }
});

test("technology is visible without a fabricated market magnitude", async ({ page }) => {
  await page.goto("/sectores");
  const technology = page.getByRole("article").filter({ hasText: "Tecnología" });
  await expect(technology).toContainText("30 oportunidades");
  await expect(technology).toContainText("No comparable con magnitudes INE");
});

test("investors and forecasts expose missing evidence honestly", async ({ page }) => {
  await page.goto("/inversores");
  await expect(page.getByText("No hay eventos de inversión documentados en la base local.")).toBeVisible();
  await page.goto("/forecasts");
  await expect(page.getByRole("heading", { name: "Sin pronóstico publicable", exact: true })).toBeVisible();
});

test("browser import previews without committing", async ({ page }) => {
  await page.goto("/importaciones");
  await page.locator('input[type="file"]').setInputFiles(path.join(process.cwd(), "data/examples/ejemplo_importacion.jsonl"));
  await page.getByRole("button", { name: "Validar y previsualizar" }).click();
  await expect(page.getByText("Aceptados")).toBeVisible();
  await expect(page.getByRole("button", { name: "Confirmar importación" })).toBeEnabled();
});

test("XLSX export downloads a workbook", async ({ request }) => {
  const response = await request.get("/api/exports/intelligence.xlsx");
  expect(response.ok()).toBeTruthy();
  expect(response.headers()["content-type"]).toContain("spreadsheetml");
  expect((await response.body()).subarray(0, 2).toString()).toBe("PK");
});
