async function apiRoutes(app) {
    app.register(require('./auth'));
}

module.exports = apiRoutes;
