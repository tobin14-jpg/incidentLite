import { randomUUID } from "crypto";
import type { Incident } from "@incidentlite/shared";

const incidents = new Map<string, Incident>();

(function seed() {
    const now = new Date();
    const incidentA = {
        id: randomUUID(),
        title: "Database connection issue",
        description: "Unable to connect to the database, causing service disruptions.",
        severity: "High" as const,
        status: "Open" as const,
        createdAt: now.toISOString(),
    };
    const incidentB = {
        id: randomUUID(),
        title: "API latency spike",
        description: "Significant increase in API response times observed.",
        severity: "Medium" as const,
        status: "In Progress" as const,
        createdAt: now.toISOString(),
    };
    incidents.set(incidentA.id, incidentA);
    incidents.set(incidentB.id, incidentB);
})();

export function listIncidents(): Incident[] {
    return Array.from(incidents.values());
}

export function getIncident(id: string): Incident | undefined {
    return incidents.get(id);
}

export function createIncident(input: { title: string; description?: string; severity: Incident["severity"] }): Incident {
    const now = new Date();
    const newIncident: Incident = {
        id: randomUUID(),
        title: input.title,
        description: input.description,
        severity: input.severity,
        status: "Open",
        createdAt: now.toISOString(),
    };
    incidents.set(newIncident.id, newIncident);
    return newIncident;
}

export function patchIncident(id: string, patch: Partial<Pick<Incident, "status" | "severity" | "title" | "description">>) {
  const existing = incidents.get(id);
  if (!existing) return undefined;
  const updated: Incident = { ...existing };

  // Only apply keys that are explicitly provided in the patch payload.
  if (patch.title !== undefined) updated.title = patch.title;
  if (patch.description !== undefined) updated.description = patch.description;
  if (patch.severity !== undefined) updated.severity = patch.severity;
  if (patch.status !== undefined) updated.status = patch.status;

  incidents.set(id, updated);
  return updated;
}
