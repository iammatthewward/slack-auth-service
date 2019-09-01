module.exports = {
    type: 'object',
    properties: {
        PORT: {
            type: 'string',
            default: '3000',
        },
        HOST: {
            type: 'string',
            default: '0.0.0.0',
        },
        SLACK_CLIENT_ID: { type: 'string' },
        SLACK_CLIENT_SECRET: { type: 'string' },
        SLACK_OAUTH_ACCESS_URL: { type: 'string' },
        SLACK_USERS_IDENTITY_URL: { type: 'string' },
        USER_IDENTITY_TABLE: { type: 'string' },
        AWS_REGION: { type: 'string' },
        AWS_ENDPOINT: { type: 'string' },
    },
    required: [
        'PORT',
        'HOST',
        'SLACK_CLIENT_ID',
        'SLACK_CLIENT_SECRET',
        'SLACK_OAUTH_ACCESS_URL',
        'SLACK_USERS_IDENTITY_URL',
        'USER_IDENTITY_TABLE',
        'AWS_REGION',
    ],
};
