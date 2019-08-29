const handlerFactory = require('./handler');
const Slack = require('../../services/slack');

jest.mock('../../services/slack');

const setupTest = ({ dynamoError } = {}) => {
    const dynamo = {
        put: jest.fn().mockReturnValue({
            promise: jest.fn(() =>
                dynamoError ? Promise.reject(dynamoError) : Promise.resolve()
            ),
        }),
    };
    const app = { dynamo };
    const code = 'XXYYZZ';
    const request = { query: { code } };
    const reply = { code: jest.fn().mockReturnValue({ send: jest.fn() }) };
    const accessToken = 'xoxp-1111827399-16111519414-20367011469-5f89a31i07';
    const userIdentity = {
        userName: 'Fred',
        userId: 'U0G9QF9C6',
        teamId: 'T0G9PQBBK',
    };

    Slack.getAccessToken.mockImplementation(() => Promise.resolve(accessToken));
    Slack.getIdentity.mockImplementation(() => Promise.resolve(userIdentity));

    const handler = handlerFactory(app);

    return {
        handler,
        code,
        request,
        reply,
        accessToken,
        userIdentity,
        dynamo,
    };
};

describe('handler', () => {
    it('should exchange the request query code for an access token', async () => {
        const { handler, request, reply, code } = setupTest();
        await handler(request, reply);

        expect(Slack.getAccessToken).toHaveBeenCalledWith(code);
    });

    it('should use the access token to request user indentity data', async () => {
        const { handler, request, reply, accessToken } = setupTest();
        await handler(request, reply);

        expect(Slack.getIdentity).toHaveBeenCalledWith(accessToken);
    });

    it('should store the returned access token and identity', async () => {
        const {
            handler,
            request,
            reply,
            accessToken,
            userIdentity,
            dynamo,
        } = setupTest();
        await handler(request, reply);

        expect(dynamo.put).toHaveBeenCalledWith({
            TableName: process.env.USER_IDENTITY_TABLE,
            Item: {
                ...userIdentity,
                accessToken,
            },
        });
    });

    it('should return 201 with the non-private entity fields', async () => {
        const { handler, request, reply, userIdentity } = setupTest();
        await handler(request, reply);

        expect(reply.code).toHaveBeenCalledWith(201);
        expect(reply.code().send).toHaveBeenCalledWith({
            ...userIdentity,
        });
    });

    describe('errors', () => {
        it('should return 403 if the user denies access', async () => {
            const { handler, request, reply } = setupTest();
            const deniedAccessRequest = {
                ...request,
                query: { ...request.query, error: 'access_denied' },
            };
            await handler(deniedAccessRequest, reply);

            expect(reply.code).toHaveBeenCalledWith(403);
            expect(reply.code().send).toHaveBeenCalledWith({
                error: 'access denied',
            });
        });

        it('should return 503 if an error occurs in getAccessToken', async () => {
            const { handler, request, reply } = setupTest();

            const errorMessage = 'Required param missing: code';
            Slack.getAccessToken.mockRejectedValueOnce(Error(errorMessage));

            await handler(request, reply);

            expect(reply.code).toHaveBeenCalledWith(503);
            expect(reply.code().send).toHaveBeenCalledWith({
                message: 'exception thrown by Slack',
                error: errorMessage,
            });
        });

        it('should return 503 if an error occurs in getIdentity', async () => {
            const { handler, request, reply } = setupTest();

            const errorMessage = 'Required param missing: authToken';
            Slack.getIdentity.mockRejectedValueOnce(Error(errorMessage));

            await handler(request, reply);

            expect(reply.code).toHaveBeenCalledWith(503);
            expect(reply.code().send).toHaveBeenCalledWith({
                message: 'exception thrown by Slack',
                error: errorMessage,
            });
        });

        it('should return 503 if an error occurs in dynamo', async () => {
            const errorMessage = 'Validation failed';
            const { handler, request, reply } = setupTest({
                dynamoError: Error(errorMessage),
            });

            await handler(request, reply);

            expect(reply.code).toHaveBeenCalledWith(503);
            expect(reply.code().send).toHaveBeenCalledWith({
                message: 'exception thrown by database',
                error: errorMessage,
            });
        });
    });
});
