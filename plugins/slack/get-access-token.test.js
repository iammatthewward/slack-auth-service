const qs = require('querystring');
const { yesno } = require('yesno-http');
const getAccessTokenFactory = require('./get-access-token');

const setupTest = () => {
    const code = '12345';
    const accessToken = 'aaabbbcccddd';
    const config = {
        SLACK_CLIENT_ID: process.env.SLACK_CLIENT_ID,
        SLACK_CLIENT_SECRET: process.env.SLACK_CLIENT_SECRET,
        SLACK_OAUTH_ACCESS_URL: process.env.SLACK_OAUTH_ACCESS_URL,
    };

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
    const getAccessToken = getAccessTokenFactory(config);
    return { getAccessToken, code, accessToken };
};

describe('getAccessToken', () => {
    afterEach(() => yesno.restore());
    it('should throw an error if no code provided', () => {
        const { getAccessToken } = setupTest();
        return expect(getAccessToken()).rejects.toEqual(
            new Error('Required param missing: code')
        );
    });

    it('should request an access token from Slack', async () => {
        const { getAccessToken, code } = setupTest();
        await getAccessToken(code);

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
        const { getAccessToken, code, accessToken } = setupTest();
        const output = await getAccessToken(code);

        expect(output).toEqual(accessToken);
    });
});
