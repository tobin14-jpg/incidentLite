import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { patchIncident, getIncident } from "../lib/incidentRepo.js";
import type { Incident } from "@incidentlite/shared";

app.http("patchIncidents", {
    methods: ["PATCH"],
    authLevel: "anonymous",
    route: "incidents/{id}",
    handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
        const id = request.params.id;
        const existingIncident = await getIncident(id); 
        if (!existingIncident) {
            return {
                status: 404,
                jsonBody: { message: `Incident with id ${id} not found` }
            };
        }

        const body = (await request.json()) as Partial<Pick<Incident, "title" | "description" | "severity" | "status">>;
        const patch: Partial<Pick<Incident, "title" | "description" | "severity" | "status">> = {};

        if (body.title !== undefined) patch.title = body.title;
        if (body.description !== undefined) patch.description = body.description;

        if (body.severity !== undefined) {
            if (!["Low", "Medium", "High", "Critical"].includes(body.severity)) {
                return {
                    status: 400,
                    jsonBody: { message: "severity must be one of Low, Medium, High, Critical" }
                };
            }
            patch.severity = body.severity;
        }

        if (body.status !== undefined) {
            if (!["Open", "In Progress", "Resolved", "Closed"].includes(body.status)) {
                return {
                    status: 400,
                    jsonBody: { message: "status must be one of Open, In Progress, Resolved, Closed" }
                };
            }
            patch.status = body.status;
        }

        if (Object.keys(patch).length === 0) {
            return {
                status: 400,
                jsonBody: { message: "No valid fields provided to patch" }
            };
        }

        const updatedIncident = await patchIncident(id, patch);
        if (!updatedIncident) {
            return {
                status: 404,
                jsonBody: { message: `Incident with id ${id} not found` }
            };
        }

        return {
            status: 200,
            jsonBody: updatedIncident
        };
    }});
