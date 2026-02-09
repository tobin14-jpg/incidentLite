export type IncidentStatus = "Open" | "In Progress" | "Resolved" | "Closed";

export type IncidentSeverity = "Low" | "Medium" | "High" | "Critical";

export type Incident = {
  id: string;
  title: string;
  description?: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  createdAt: string;
};