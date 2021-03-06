const qs = require('querystring');
const axios = require('axios');

function getAccessTokenFactory(config) {
    const {
        SLACK_CLIENT_ID,
        SLACK_CLIENT_SECRET,
        SLACK_OAUTH_ACCESS_URL,
    } = config;

    return async function getAccessToken(code) {
        if (!code) throw Error('Required param missing: code');

        const params = {
            client_id: SLACK_CLIENT_ID,
            client_secret: SLACK_CLIENT_SECRET,
            code,
        };

        const { access_token: accessToken } = await axios
            .post(SLACK_OAUTH_ACCESS_URL, qs.stringify(params))
            .then(({ data }) => data);

        return accessToken;
    };
}

module.exports = getAccessTokenFactory;
