module.exports = {
    type: 'object',
    properties: {
        PORT: {
            type: 'string',
            default: 3000,
        },
        SLACK_CLIENT_ID: { type: 'string' },
        SLACK_CLIENT_SECRET: { type: 'string' },
        SLACK_OAUTH_ACCESS_URL: { type: 'string' },
        SLACK_USERS_IDENTITY_URL: { type: 'string' },
        USERS_IDENTITY_TABLE: { type: 'string' },
    },
    required: [
        'PORT',
        'SLACK_CLIENT_ID',
        'SLACK_CLIENT_SECRET',
        'SLACK_OAUTH_ACCESS_URL',
        'SLACK_USERS_IDENTITY_URL',
        'USER_IDENTITY_TABLE',
    ],
};
