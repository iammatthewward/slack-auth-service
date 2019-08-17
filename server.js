require('dotenv').config();
const fastify = require('fastify');
const oas = require('fastify-oas');

const app = fastify({ logger: true });

const { PORT } = process.env;

app
    .register(oas, require('./docs'))
    .register(require('./api'))
    .listen(PORT, '0.0.0.0', (err, address) => {
        if (err) {
            app.log.error(err);
            process.exit(1);
        }
        app.log.info(`listening on ${address}`);
    });

module.exports = app;
