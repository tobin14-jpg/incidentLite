const { app } = require('@azure/functions');

app.http('health', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    route: "health",
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);
        // return JSON object with a message property

        const name = request.query.get('name') || await request.text() || 'world';

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
