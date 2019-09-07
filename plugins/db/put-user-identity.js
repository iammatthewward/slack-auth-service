const UserIdentity = require('../../models/user-identity');

function putUserIdentityFactory(config, client, logger) {
    return async function putUserIdentity({ accessToken, ...userData }) {
        const errors = UserIdentity.validate(userData);

        if (errors.length) {
            errors.map((err) => logger.error(err));
            throw new Error(errors.map(({ message }) => message));
        }

        return client.put({
            TableName: process.env.USER_IDENTITY_TABLE,
            Item: {
                accessToken,
                createdAt: Date.now(),
                ...userData,
            },
        });
    };
}

module.exports = putUserIdentityFactory;
