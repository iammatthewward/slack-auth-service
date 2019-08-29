const handler = require('./handler');

function authRoute(app, opts, done) {
    app.route({
        method: 'GET',
        url: '/auth',
        schema: {
            query: {
                code: { type: 'string' },
                state: { type: 'string' },
            },
            response: {
                201: {
                    type: 'object',
                    properties: {
                        userName: { type: 'string' },
                        userId: { type: 'string' },
                        teamId: { type: 'string' },
                    },
                },
                403: {
                    type: 'object',
                    properties: {
                        error: { type: 'string' },
                    },
                },
                503: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' },
                        error: { type: 'string' },
                    },
                },
            },
        },
        handler: handler(app),
    });

    done();
}

module.exports = authRoute;
