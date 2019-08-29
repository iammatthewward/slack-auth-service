const qs = require('querystring');
const axios = require('axios');

async function getAccessToken(config, code) {
    if (!code) throw Error('Required param missing: code');

    const {
        SLACK_CLIENT_ID,
        SLACK_CLIENT_SECRET,
        SLACK_OAUTH_ACCESS_URL,
    } = config;

    const params = {
        client_id: SLACK_CLIENT_ID,
        client_secret: SLACK_CLIENT_SECRET,
        code,
    };

    const { access_token: accessToken } = await axios
        .post(SLACK_OAUTH_ACCESS_URL, qs.stringify(params))
        .then(({ data }) => data);

    return accessToken;
}

module.exports = getAccessToken;
