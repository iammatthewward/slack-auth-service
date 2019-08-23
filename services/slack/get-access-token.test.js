const qs = require('querystring');
const { yesno } = require('yesno-http');
const Slack = require('./index');

const setupTest = () => {
    yesno.restore();
    const code = '12345';
    const accessToken = 'aaabbbcccddd';

    yesno.mock([
        {
            request: {
                method: 'POST',
                path: '/oauth.access',
                host: 'slack.test',
                protocol: 'https',
            },
            response: {
                body: {
                    ok: true,
                    access_token: accessToken,
                    scope: 'identity.basic',
                    team_id: 'T0G9PQBBK',
                },
                statusCode: 200,
            },
        },
    ]);
    return { code, accessToken };
};

describe('getAccessToken', () => {
    it('should throw an error if no code provided', () => {
        setupTest();
        return expect(Slack.getAccessToken()).rejects.toEqual(
            new Error('Required param missing: code')
        );
    });

    it('should request an access token from Slack', async () => {
        const { code } = setupTest();
        await Slack.getAccessToken(code);

        const {
            request: { body },
        } = yesno.intercepted()[0];
        const params = qs.stringify({
            client_id: process.env.SLACK_CLIENT_ID,
            client_secret: process.env.SLACK_CLIENT_SECRET,
            code,
        });

        expect(body).toEqual(params);
    });

    it('should return the accessToken returned from slack', async () => {
        const { code, accessToken } = setupTest();
        const output = await Slack.getAccessToken(code);

        expect(output.accessToken).toEqual(accessToken);
    });
});
