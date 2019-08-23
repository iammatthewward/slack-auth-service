const qs = require('querystring');
const { yesno } = require('yesno-http');
const Slack = require('./index');

const setupTest = () => {
    yesno.restore();
    const accessToken = 'xoxp-1111827393-16111519414-20367011469-5f89a31i07';
    const userId = 'U0G9QF9C6';
    const userName = 'Fred';
    const teamId = 'T0G9PQBBK';

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
    return { accessToken, userName, userId, teamId };
};

describe('getIdentity', () => {
    it('should throw an error if no authToken provided', () => {
        setupTest();
        return expect(Slack.getIdentity()).rejects.toEqual(
            new Error('Required param missing: authToken')
        );
    });

    it('should request a users identity from Slack', async () => {
        const { accessToken } = setupTest();
        await Slack.getIdentity(accessToken);

        const {
            request: { query },
        } = yesno.intercepted()[0];
        const params = qs.stringify({
            token: accessToken,
        });

        expect(query).toEqual(`?${params}`);
    });

    it('should return the userName returned from slack', async () => {
        const { accessToken, userName } = setupTest();
        const output = await Slack.getIdentity(accessToken);

        expect(output.userName).toEqual(userName);
    });

    it('should return the userId returned from slack', async () => {
        const { accessToken, userId } = setupTest();
        const output = await Slack.getIdentity(accessToken);

        expect(output.userId).toEqual(userId);
    });

    it('should return the teamId returned from slack', async () => {
        const { accessToken, teamId } = setupTest();
        const output = await Slack.getIdentity(accessToken);

        expect(output.teamId).toEqual(teamId);
    });
});
