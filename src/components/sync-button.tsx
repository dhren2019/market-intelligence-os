"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";

export function SyncButton() {
  const [status, setStatus] = useState<string>("");
  const [busy, setBusy] = useState(false);
  async function sync() {
    setBusy(true); setStatus("");
    try {
      const response = await fetch("/api/sources/sync", { method: "POST" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Sincronización fallida");
      setStatus(`${result.succeeded} fuentes completadas; ${result.failed} con error.`);
    } catch (error) { setStatus(error instanceof Error ? error.message : String(error)); }
    finally { setBusy(false); }
  }
  return <div className="sync-control"><button className="button button-primary" type="button" onClick={sync} disabled={busy}><RefreshCw className={busy ? "spin" : ""} size={15} />Sincronizar ahora</button>{status ? <small>{status}</small> : null}</div>;
}
