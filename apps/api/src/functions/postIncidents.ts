import { app, HttpRequest, HttpResponseInit } from "@azure/functions";
import { createIncident } from "../lib/incidentRepo.js";
import type { Incident } from "@incidentlite/shared";

app.http("postIncidents", {
    methods: ["POST"],
    authLevel: "anonymous",
    route: "incidents",
    handler: async (request: HttpRequest): Promise<HttpResponseInit> => {
        const body = await request.json() as Incident;
        const title = body.title;
        const description = body.description;
        const severity = body.severity;
            if (!title) return { status: 400, jsonBody: { error: "title is required" } };
            if (!severity) return { status: 400, jsonBody: { error: "severity is required" } };
            if (!["Low", "Medium", "High", "Critical"].includes(severity)) {
                return { status: 400, jsonBody: { error: "severity must be one of Low, Medium, High, Critical" } };
            }
        const newIncident = createIncident({ title, description , severity });
        return { status: 201, jsonBody: newIncident };
    },
})