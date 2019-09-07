require('dotenv').config();
const fastify = require('fastify');
const oas = require('fastify-oas');
const env = require('fastify-env');
const db = require('./plugins/db');
const slack = require('./plugins/slack');

const app = fastify({ logger: true });

const { PORT, HOST } = process.env;

app
    .register(env, { schema: require('./schema/env'), dotenv: true })
    .register(oas, require('./docs'))
    .register(db)
    .register(slack)
    .register(require('./api'))
    .listen(PORT, HOST, (err, address) => {
        if (err) {
            app.log.error(err);
            process.exit(1);
        }
        app.log.info(`listening on ${address}`);
    });

module.exports = app;
