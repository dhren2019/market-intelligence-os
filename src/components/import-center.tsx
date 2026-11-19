"use client";

import { useState } from "react";
import { CheckCircle2, Download, FileUp, LoaderCircle, TriangleAlert } from "lucide-react";

type Preview = {
  contentHash: string;
  acceptedRows: number;
  rejectedRows: number;
  preview: Array<{ lineNumber: number; recordType: string; claimType: string; rawPayload: Record<string, unknown> }>;
  rejections: Array<{ lineNumber: number; reason: string; rawPayload: unknown }>;
};

export function ImportCenter() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function send(endpoint: string) {
    if (!file) return;
    setBusy(true); setMessage(null);
    const body = new FormData(); body.set("file", file);
    try {
      const response = await fetch(endpoint, { method: "POST", body });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "No se pudo procesar el archivo.");
      return result;
    } finally { setBusy(false); }
  }

  async function inspect() {
    try { setPreview(await send("/api/imports/preview")); }
    catch (error) { setMessage(error instanceof Error ? error.message : String(error)); }
  }

  async function commit() {
    try {
      const result = await send("/api/imports/commit");
      setMessage(result.duplicate ? "El archivo ya estaba importado; no se duplicó ningún registro." : `Importación completada: ${result.acceptedRows} aceptados, ${result.rejectedRows} rechazados.`);
    } catch (error) { setMessage(error instanceof Error ? error.message : String(error)); }
  }

  function downloadErrors() {
    if (!preview?.rejections.length) return;
    const blob = new Blob([JSON.stringify(preview.rejections, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob); const anchor = document.createElement("a");
    anchor.href = url; anchor.download = `${file?.name ?? "importacion"}.errores.json`; anchor.click(); URL.revokeObjectURL(url);
  }

  return <section className="import-center">
    <div className="upload-panel"><div className="upload-icon"><FileUp size={24} /></div><div><h2>Subir un archivo</h2><p>JSON, JSONL, NDJSON, CSV o XLSX · máximo 5 MB. La vista previa no escribe en la base.</p></div><label className="file-picker"><span>Elegir archivo</span><input type="file" accept=".json,.jsonl,.ndjson,.csv,.xlsx" onChange={(event) => { setFile(event.target.files?.[0] ?? null); setPreview(null); setMessage(null); }} /></label>{file ? <div className="selected-file"><strong>{file.name}</strong><span>{(file.size / 1024).toFixed(1)} KB</span><button className="button button-primary" type="button" onClick={inspect} disabled={busy}>{busy ? <LoaderCircle className="spin" size={16} /> : null}Validar y previsualizar</button></div> : null}</div>
    {message ? <div className="notice"><CheckCircle2 size={17} /><p>{message}</p></div> : null}
    {preview ? <div className="preview-panel"><div className="preview-summary"><div><span>Aceptados</span><strong>{preview.acceptedRows}</strong></div><div><span>Rechazados</span><strong>{preview.rejectedRows}</strong></div><div><span>SHA-256</span><code>{preview.contentHash.slice(0, 16)}…</code></div><div className="preview-actions"><button className="button" type="button" onClick={downloadErrors} disabled={!preview.rejections.length}><Download size={15} />Errores</button><button className="button button-primary" type="button" onClick={commit} disabled={busy || preview.acceptedRows === 0}>Confirmar importación</button></div></div>
      <div className="table-wrap"><table><thead><tr><th>Línea</th><th>Tipo</th><th>Evidencia</th><th>Vista previa</th></tr></thead><tbody>{preview.preview.map((row) => <tr key={`${row.lineNumber}-${row.recordType}`}><td className="num">{row.lineNumber}</td><td>{row.recordType}</td><td>{row.claimType}</td><td><code>{JSON.stringify(row.rawPayload).slice(0, 180)}</code></td></tr>)}</tbody></table></div>
      {preview.rejections.length ? <div className="rejection-list"><h3><TriangleAlert size={17} /> Rechazos por línea</h3>{preview.rejections.slice(0, 10).map((rejection) => <p key={rejection.lineNumber}><strong>Línea {rejection.lineNumber}</strong> {rejection.reason}</p>)}</div> : null}
    </div> : null}
  </section>;
}
