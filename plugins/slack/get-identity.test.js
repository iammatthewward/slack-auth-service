const qs = require('querystring');
const { yesno } = require('yesno-http');
const getIdentityFactory = require('./get-identity');

const setupTest = () => {
    const accessToken = 'xoxp-1111827393-16111519414-20367011469-5f89a31i07';
    const userId = 'U0G9QF9C6';
    const userName = 'Fred';
    const teamId = 'T0G9PQBBK';
    const config = {
        SLACK_USERS_IDENTITY_URL: process.env.SLACK_USERS_IDENTITY_URL,
    };

    yesno.mock([
        {
            request: {
                method: 'GET',
                path: '/users.identity',
                host: 'slack.test',
                protocol: 'https',
            },
            response: {
                body: {
                    ok: true,
                    user: {
                        name: userName,
                        id: userId,
                    },
                    team: {
                        id: teamId,
                    },
                },
                statusCode: 200,
            },
        },
    ]);
    const getIdentity = getIdentityFactory(config);
    return { getIdentity, accessToken, userName, userId, teamId };
};

describe('getIdentity', () => {
    afterEach(() => yesno.restore());
    it('should throw an error if no authToken provided', () => {
        const { getIdentity } = setupTest();
        return expect(getIdentity()).rejects.toEqual(
            new Error('Required param missing: authToken')
        );
    });

    it('should request a users identity from Slack', async () => {
        const { getIdentity, accessToken } = setupTest();
        await getIdentity(accessToken);

        const {
            request: { query },
        } = yesno.intercepted()[0];
        const params = qs.stringify({
            token: accessToken,
        });

        expect(query).toEqual(`?${params}`);
    });

    it('should return the userName returned from slack', async () => {
        const { getIdentity, accessToken, userName } = setupTest();
        const output = await getIdentity(accessToken);

        expect(output.userName).toEqual(userName);
    });

    it('should return the userId returned from slack', async () => {
        const { getIdentity, accessToken, userId } = setupTest();
        const output = await getIdentity(accessToken);

        expect(output.userId).toEqual(userId);
    });

    it('should return the teamId returned from slack', async () => {
        const { getIdentity, accessToken, teamId } = setupTest();
        const output = await getIdentity(accessToken);

        expect(output.teamId).toEqual(teamId);
    });
});
