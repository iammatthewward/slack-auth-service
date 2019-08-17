module.exports = {
    routePrefix: '/docs',
    exposeRoute: true,
    swagger: {
        info: {
            title: 'Slack Auth Service',
            description: 'Service to handle all authenticaion for a Slack app',
            version: '0.0.0',
        },
        consumes: ['application/json'],
        produces: ['application/json'],
        tags: [],
        schemes: ['http', 'https'],
        components: {
            securitySchemes: {
                authorization: {
                    type: 'http',
                    scheme: 'bearer',
                },
            },
        },
    },
};
