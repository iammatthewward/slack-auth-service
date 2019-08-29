const { getAccessToken, getIdentity } = require('../../services/slack');

const handleUpstreamServiceError = (service) => (err = {}) => {
    throw {
        code: 503,
        error: {
            message: `exception thrown by ${service}`,
            error: err.message,
        },
    };
};

function handlerFactory(app) {
    return async function handler(request, reply) {
        try {
            const handleSlackError = handleUpstreamServiceError('Slack');
            const handleDatabaseError = handleUpstreamServiceError('database');

            const { code, error } = request.query;
            if (error) return reply.code(403).send({ error: 'access denied' });

            const accessToken = await getAccessToken(code).catch(handleSlackError);
            const userIdentity = await getIdentity(accessToken).catch(
                handleSlackError
            );

            const params = {
                TableName: process.env.USER_IDENTITY_TABLE,
                Item: {
                    ...userIdentity,
                    accessToken,
                },
            };
            await app.dynamo
                .put(params)
                .promise()
                .catch(handleDatabaseError);

            return reply.code(201).send(userIdentity);
        } catch (err) {
            if (err.code) {
                return reply.code(err.code).send(err.error);
            }

            return reply.code(500);
        }
    };
}

module.exports = handlerFactory;
