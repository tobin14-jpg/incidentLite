import { useEffect, useState } from "react";
import { Incident } from "../../../packages/shared/src/types";
import { apiGet, apiPost } from "./api";



export function IncidentsPage() {
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [severity, setSeverity] = useState<Incident["severity"]>("Low");
    const [error, setError] = useState<string | null>(null);

    async function refresh() {
        setError(null);
        try {
            const data = await apiGet<Incident[]>("incidents");
            setIncidents(data);
        } catch (err) {
            setError(`Failed to fetch incidents: ${(err as Error).message}`);
        }

    }

    useEffect(() => {
        refresh();
    }, []);

    async function create() {
        setError(null);
        try {
            await apiPost<Incident>("incidents", { title, description, severity });
            setTitle("");
            setDescription("");
            setSeverity("Low");
            await refresh();
        } catch (err) {
            setError(`Failed to create incident: ${(err as Error).message}`);
        }

    }

    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h1>Incident Lite</h1>

            <h2>Create Incident</h2>
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 16 }}>
                <input
                    value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
                <select value={severity} onChange={(e) => setSeverity(e.target.value as Incident["severity"])}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                </select>
                <button onClick={create}>Create</button>
                <button onClick={refresh}>Refresh</button>
            </div>
            {error && <div style={{ color: "red" }}>{error}</div>}

            <h2>Incidents</h2>
            <ul>
                {incidents.map(incident => (
                    <li key={incident.id} style={{ marginBottom: 8 }}>
                        <strong>{incident.title}</strong> [{incident.severity}] - {incident.status}
                        <br />
                        <small>Created at: {new Date(incident.createdAt).toLocaleString()}</small>
                        <p>{incident.description}</p>
                    </li>
                ))}
            </ul>
        </div>

    )
}