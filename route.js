
const { sampleHandler } = require('./handler/routeHandler/sampleHandler')
const { userHandler } = require('./handler/routeHandler/userHandler')
const { tokenHandler } = require('./handler/routeHandler/tokenHandelar');
const { chackHandler } = require('./handler/routeHandler/chackHandler');

const routes = {
    sample: sampleHandler,
    user: userHandler,
    token: tokenHandler,
    chack: chackHandler
}

module.exports = routes