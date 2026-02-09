import { app, HttpRequest, HttpResponse, HttpResponseInit } from "@azure/functions";
import { listIncidents } from "../lib/incidentRepo.js";

app.http("getIncidents", {
    methods: ["GET"],
    authLevel: "anonymous",
    route: "incidents",
    handler: async (): Promise<HttpResponseInit> => {
        return {
            status: 200,
            jsonBody: listIncidents()
        };
    },
})