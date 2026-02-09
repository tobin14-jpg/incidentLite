import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

app.http("health", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  route: "health",
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    const name = request.query.get("name") || "world";

    return {
      status: 200,
      jsonBody: {
        status: "ok",
        message: `Hello, ${name}!`,
        time: new Date().toISOString()
      }
    };
  }
});
