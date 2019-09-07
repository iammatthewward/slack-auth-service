const fp = require('fastify-plugin');
const AWS = require('aws-sdk');

const putUserIdentity = require('./put-user-identity');

function db(app, opts, next) {
    const { config, logger } = app;
    const { region, endpoint } = config;
    AWS.config.update({
        region,
        endpoint,
    });
    const client = new AWS.DynamoDB.DocumentClient();

    app.decorate('db', {
        putUserIdentity: putUserIdentity(config, client, logger),
    });

    next();
}

module.exports = fp(db);
