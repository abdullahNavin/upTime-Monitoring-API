
const { sampleHandler } = require('./handler/routeHandler/sampleHandler')
const { userHandler } = require('./handler/routeHandler/userHandler')
const { tokenHandler } = require('./handler/routeHandler/tokenHandelar');

const routes = {
    sample: sampleHandler,
    user: userHandler,
    token: tokenHandler
}

module.exports = routes