const handlerFactory = require('./handler');

const setupTest = ({ dbError } = {}) => {
    const db = {
        putUserIdentity: jest.fn(() =>
            dbError ? Promise.reject(dbError) : Promise.resolve()
        ),
    };
    const slack = {
        getAccessToken: jest.fn(() => Promise.resolve(accessToken)),
        getIdentity: jest.fn(() => Promise.resolve(userIdentity)),
    };
    const app = { db, slack };
    const code = 'XXYYZZ';
    const request = { query: { code } };
    const reply = { code: jest.fn().mockReturnValue({ send: jest.fn() }) };
    const accessToken = 'xoxp-1111827399-16111519414-20367011469-5f89a31i07';
    const userIdentity = {
        userName: 'Fred',
        userId: 'U0G9QF9C6',
        teamId: 'T0G9PQBBK',
    };

    const handler = handlerFactory(app);

    return {
        handler,
        code,
        request,
        reply,
        accessToken,
        userIdentity,
        db,
        slack,
    };
};

describe('handler', () => {
    it('should exchange the request query code for an access token', async () => {
        const { handler, request, reply, code, slack } = setupTest();
        await handler(request, reply);

        expect(slack.getAccessToken).toHaveBeenCalledWith(code);
    });

    it('should use the access token to request user indentity data', async () => {
        const { handler, request, reply, accessToken, slack } = setupTest();
        await handler(request, reply);

        expect(slack.getIdentity).toHaveBeenCalledWith(accessToken);
    });

    it('should store the returned access token and identity', async () => {
        const {
            handler,
            request,
            reply,
            accessToken,
            userIdentity,
            db,
        } = setupTest();
        await handler(request, reply);

        expect(db.putUserIdentity).toHaveBeenCalledWith({
            accessToken,
            ...userIdentity,
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
            const { handler, request, reply, slack } = setupTest();

            const errorMessage = 'Required param missing: code';
            slack.getAccessToken.mockRejectedValueOnce(Error(errorMessage));

            await handler(request, reply);

            expect(reply.code).toHaveBeenCalledWith(503);
            expect(reply.code().send).toHaveBeenCalledWith({
                message: 'exception thrown by Slack',
                error: errorMessage,
            });
        });

        it('should return 503 if an error occurs in getIdentity', async () => {
            const { handler, request, reply, slack } = setupTest();

            const errorMessage = 'Required param missing: authToken';
            slack.getIdentity.mockRejectedValueOnce(Error(errorMessage));

            await handler(request, reply);

            expect(reply.code).toHaveBeenCalledWith(503);
            expect(reply.code().send).toHaveBeenCalledWith({
                message: 'exception thrown by Slack',
                error: errorMessage,
            });
        });

        it('should return 503 if an error occurs in calling the db method', async () => {
            const errorMessage = 'Validation failed';
            const { handler, request, reply } = setupTest({
                dbError: Error(errorMessage),
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
