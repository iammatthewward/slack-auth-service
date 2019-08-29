require('dotenv').config();
const fastify = require('fastify');
const oas = require('fastify-oas');
const env = require('fastify-env');
const dynamodb = require('fastify-dynamodb');

const app = fastify({ logger: true });

const { PORT, HOST, AWS_REGION } = process.env;

app
    .register(env, { schema: require('./schema/env'), dotenv: true })
    .register(oas, require('./docs'))
    .register(dynamodb, { region: AWS_REGION })
    .register(require('./api'))
    .listen(PORT, HOST, (err, address) => {
        if (err) {
            app.log.error(err);
            process.exit(1);
        }
        app.log.info(`listening on ${address}`);
    });

module.exports = app;
