const axios = require('axios');

async function getIdentity(config, authToken) {
    if (!authToken) throw Error('Required param missing: authToken');

    const { SLACK_USERS_IDENTITY_URL } = config;

    const {
        user: { name: userName, id: userId },
        team: { id: teamId },
    } = await axios
        .get(SLACK_USERS_IDENTITY_URL, {
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            params: { token: authToken },
        })
        .then(({ data }) => data);

    return {
        userName,
        userId,
        teamId,
    };
}

module.exports = getIdentity;
