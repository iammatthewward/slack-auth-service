const fp = require('fastify-plugin');

const getAccessTokenFactory = require('./get-access-token');
const getIdentityFactory = require('./get-identity');

function slack(app, opts, next) {
    const { config } = app;

    app.decorate('slack', {
        getAccessToken: getAccessTokenFactory(config),
        getIdentity: getIdentityFactory(config),
    });

    next();
}

module.exports = fp(slack);
