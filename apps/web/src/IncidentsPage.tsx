import { useEffect, useState } from "react";
import { Incident, IncidentSeverity } from "../../../packages/shared/src/types";
import { apiGet, apiPost, apiPatch } from "./api";
import { IncidentStatus } from "@incidentlite/shared";



export function IncidentsPage() {
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [listError, setListError] = useState<string | null>(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [listLoading, setListLoading] = useState(false);

    const [severity, setSeverity] = useState<Incident["severity"]>("Low");
    const [createError, setCreateError] = useState<string | null>(null);
    const [createLoading, setCreateLoading] = useState(false);

    //selectedid state
    const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
    const [selected, setSelected] = useState<Incident | undefined>(undefined);
    const [patchLoading, setPatchLoading] = useState(false);
    const [detailError, setDetailError] = useState<string | null>(null);
    const [detailLoading, setDetailLoading] = useState(false);

    const selectedIncident = incidents.find(i => i.id === selectedId);


    const statusOptions: IncidentStatus[] = ["Open", "In Progress", "Resolved"];
    const severityOptions: IncidentSeverity[] = ["Low", "Medium", "High", "Critical"];

    async function refreshIncident() {
        setListError(null);
        setListLoading(true);

        try {
            const data = await apiGet<Incident[]>("incidents");
            setIncidents(data);
        
        } catch (err) {
            setListError(`Failed to fetch incidents: ${(err as Error).message}`);
        } finally {
            setListLoading(false);
        }

    }

    useEffect(() => {
        refreshIncident();
    }, []);

    useEffect(() => {
        if (!selectedId) {
            setSelected(undefined);
            setDetailError(null);
            return;
        }
        loadDetail(selectedId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedId]);

    async function createIncident() {
        setCreateError(null);
        setCreateLoading(true);
        try {
            const created = await apiPost<Incident>("incidents", { title, description, severity });
            setTitle("");
            setDescription("");
            setSeverity("Low");
            await refreshIncident();
            setSelectedId(created.id);
        } catch (err) {
            setCreateError(`Failed to create incident: ${(err as Error).message}`);
        } finally {
            setCreateLoading(false);
        }

    }

    async function patchIncident(patch: Partial<Pick<Incident, "status" | "severity" | "title" | "description">>) {
        if (!selected) return;
        setPatchLoading(true);
        setDetailError(null);
        try {
            const updated = await apiPatch<Incident>(`incidents/${selected.id}`, patch);
            setSelected(updated);
            setIncidents(incidents.map(i => i.id === updated.id ? updated : i));

        } catch (err) {
            setDetailError(`Failed to update incident: ${(err as Error).message}`);
        }
        finally {
            setPatchLoading(false);
        }
    }

    async function loadDetail(id: string) {
        setDetailError(null);
        setDetailLoading(true);
        try {
            const data = await apiGet<Incident>(`incidents/${id}`);
            setSelected(data);
        } catch (err) {
            setSelected(selectedIncident);
            setDetailError(`Failed to load incident details: ${(err as Error).message}`);
        } finally {
            setDetailLoading(false);
        }
    }


    return (
        <div style={{ padding: 20, fontFamily: "system-ui, Arial" }}>
            <h1>IncidentLite</h1>

            {/* Create */}
            <section style={{ marginBottom: 20, padding: 12, border: "1px solid #ddd", borderRadius: 8 }}>
                <h2 style={{ marginTop: 0 }}>Create Incident</h2>

                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Title"
                        style={{ padding: 8, minWidth: 240 }}
                    />

                    <select
                        value={severity}
                        onChange={(e) => setSeverity(e.target.value as IncidentSeverity)}
                        style={{ padding: 8 }}
                    >
                        {severityOptions.map((s) => (
                            <option key={s} value={s}>
                                {s}
                            </option>
                        ))}
                    </select>

                    <input
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Description (optional)"
                        style={{ padding: 8, minWidth: 320 }}
                    />

                    <button onClick={createIncident} disabled={createLoading || title.trim().length === 0} style={{ padding: "8px 12px" }}>
                        {createLoading ? "Creating..." : "Create"}
                    </button>

                    <button onClick={refreshIncident} disabled={listLoading} style={{ padding: "8px 12px" }}>
                        {listLoading ? "Refreshing..." : "Refresh"}
                    </button>
                </div>

                {createError && <div style={{ marginTop: 8, color: "crimson" }}>{createError}</div>}
            </section>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {/* List */}
                <section style={{ padding: 12, border: "1px solid #ddd", borderRadius: 8, minHeight: 320 }}>
                    <h2 style={{ marginTop: 0 }}>Incidents</h2>
                    {listError && <div style={{ color: "crimson" }}>{listError}</div>}
                    {!listError && incidents.length === 0 && <div>No incidents yet.</div>}

                    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                        {incidents.map((x) => {
                            const active = x.id === selectedId;
                            return (
                                <li
                                    key={x.id}
                                    onClick={() => setSelectedId(x.id)}
                                    style={{
                                        padding: 10,
                                        borderRadius: 8,
                                        cursor: "pointer",
                                        marginBottom: 8,
                                        border: active ? "2px solid #333" : "1px solid #ddd",
                                        background: active ? "#f4f4f4" : "white"
                                    }}
                                >
                                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                                        <strong>{x.title}</strong>
                                        <span>{x.severity}</span>
                                    </div>
                                    <div style={{ opacity: 0.8 }}>
                                        {x.status} • {new Date(x.createdAt).toLocaleString()}
                                    </div>
                                    {x.description && <div style={{ marginTop: 6 }}>{x.description}</div>}
                                </li>
                            );
                        })}
                    </ul>
                </section>

                {/* Detail */}
                <section style={{ padding: 12, border: "1px solid #ddd", borderRadius: 8, minHeight: 320 }}>
                    <h2 style={{ marginTop: 0 }}>Details</h2>

                    {!selectedId && <div>Select an incident to view details.</div>}

                    {selectedId && detailLoading && <div>Loading details…</div>}

                    {selectedId && !detailLoading && !selected && <div>Couldn’t load incident.</div>}

                    {detailError && <div style={{ color: "crimson", whiteSpace: "pre-wrap" }}>{detailError}</div>}

                    {selected && (
                        <div>
                            <div style={{ marginBottom: 8 }}>
                                <strong style={{ fontSize: 18 }}>{selected.title}</strong>
                            </div>

                            <div style={{ marginBottom: 8, opacity: 0.85 }}>
                                ID: <code>{selected.id}</code>
                            </div>

                            <div style={{ marginBottom: 12 }}>
                                Created: {new Date(selected.createdAt).toLocaleString()}
                            </div>

                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: 12 }}>
                                <label>
                                    Status{" "}
                                    <select
                                        value={selected.status}
                                        onChange={(e) => patchIncident({ status: e.target.value as IncidentStatus })}
                                        disabled={patchLoading}
                                        style={{ padding: 6 }}
                                    >
                                        {statusOptions.map((s) => (
                                            <option key={s} value={s}>
                                                {s}
                                            </option>
                                        ))}
                                    </select>
                                </label>

                                <label>
                                    Severity{" "}
                                    <select
                                        value={selected.severity}
                                        onChange={(e) => patchIncident({ severity: e.target.value as IncidentSeverity })}
                                        disabled={patchLoading}
                                        style={{ padding: 6 }}
                                    >
                                        {severityOptions.map((s) => (
                                            <option key={s} value={s}>
                                                {s}
                                            </option>
                                        ))}
                                    </select>
                                </label>

                                {patchLoading && <span style={{ opacity: 0.8 }}>Saving…</span>}
                            </div>

                            <div style={{ marginBottom: 10 }}>
                                <div style={{ fontWeight: 600, marginBottom: 4 }}>Description</div>
                                <textarea
                                    value={selected.description ?? ""}
                                    onChange={(e) => setSelected({ ...selected, description: e.target.value })}
                                    rows={4}
                                    style={{ width: "100%", padding: 8 }}
                                />
                                <div style={{ marginTop: 8 }}>
                                    <button
                                        onClick={() => patchIncident({ description: selected.description ?? "" })}
                                        disabled={patchLoading}
                                        style={{ padding: "8px 12px" }}
                                    >
                                        Save description
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
