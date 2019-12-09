const lolex = require('lolex');

const putUserIdentityFactory = require('./put-user-identity');

let clock;

const setupTest = ({ dynamoError } = {}) => {
    clock = lolex.install({ now: 1567163437497 });
    const config = {
        USER_IDENTITY_TABLE: process.env.USER_IDENTITY_TABLE,
    };
    const client = {
        put: jest.fn(() => (dynamoError ? Promise.reject() : Promise.resolve())),
    };
    const logger = { error: jest.fn() };
    const accessToken = 'xoxp-1111827399-16111519414-20367011469-5f89a31i07';
    const userIdentity = {
        userName: 'Fred',
        userId: 'U0G9QF9C6',
        teamId: 'T0G9PQBBK',
    };

    const putUserIdentity = putUserIdentityFactory(config, client, logger);

    return {
        putUserIdentity,
        accessToken,
        userIdentity,
        config,
        client,
        logger,
    };
};

describe('putUserIdentity', () => {
    afterEach(() => clock.uninstall);

    it('should store the data against the correct table', async () => {
        const {
            putUserIdentity,
            config,
            client,
            accessToken,
            userIdentity,
        } = setupTest();
        await putUserIdentity({ accessToken, ...userIdentity });

        expect(client.put).toHaveBeenCalledWith({
            TableName: config.USER_IDENTITY_TABLE,
            Item: expect.any(Object),
        });
    });

    it('should store the provided access token', async () => {
        const { putUserIdentity, client, accessToken, userIdentity } = setupTest();
        await putUserIdentity({ accessToken, ...userIdentity });

        expect(client.put).toHaveBeenCalledWith({
            TableName: expect.any(String),
            Item: expect.objectContaining({
                accessToken,
            }),
        });
    });

    it('should store the provided user identity', async () => {
        const { putUserIdentity, client, accessToken, userIdentity } = setupTest();
        await putUserIdentity({ accessToken, ...userIdentity });

        expect(client.put).toHaveBeenCalledWith({
            TableName: expect.any(String),
            Item: expect.objectContaining({
                ...userIdentity,
            }),
        });
    });

    it('should store the current time as createdAt', async () => {
        const { putUserIdentity, client, accessToken, userIdentity } = setupTest();
        await putUserIdentity({ accessToken, ...userIdentity });

        expect(client.put).toHaveBeenCalledWith({
            TableName: expect.any(String),
            Item: expect.objectContaining({
                createdAt: 1567163437497,
            }),
        });
    });

    describe('user identity does not match schema', () => {
        it('should throw a relevant error', () => {
            const { putUserIdentity, accessToken, userIdentity } = setupTest();
            const invalidUser = { ...userIdentity, userId: 1 };

            return expect(
                putUserIdentity({ accessToken, ...invalidUser })
            ).rejects.toEqual(new Error('userId must be of type String.'));
        });

        it('should log each error', async () => {
            const {
                putUserIdentity,
                accessToken,
                userIdentity,
                logger,
            } = setupTest();
            const invalidUser = { ...userIdentity, userId: 1 };

            await putUserIdentity({ accessToken, ...invalidUser }).catch(() => {});

            expect(logger.error).toHaveBeenCalledWith(
                new Error('userId must be of type String.')
            );
        });
    });
});
