import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { getIncident } from "../lib/incidentRepo.js";

app.http("getIncidentById", {
    methods: ["GET"],
    authLevel: "anonymous",
    route: "incidents/{id}",
    handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
        const id = request.params.id;
        const incident = await getIncident(id);

        if(!incident) {
            return {
                status: 404,
                jsonBody: { message: `Incident with id ${id} not found` }
            };
        }
        return {
            status: 200,
            jsonBody: incident
        };
    }
});


