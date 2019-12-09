const Schema = require('validate');

module.exports = new Schema({
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    teamId: {
        type: String,
        required: true,
    },
});
