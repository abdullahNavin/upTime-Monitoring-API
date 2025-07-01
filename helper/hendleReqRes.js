
const { StringDecoder } = require('string_decoder')
const url = require('url');
const routes = require('../route')
const { notFoundHandler } = require('../handler/routeHandler/notFoundHandler')
const {parseJson} =require('../helper/utilites')

const handler = {}

handler.handleReqRes = (req, res) => {
    const parsedUrl = url.parse(req.url, true)
    const path = parsedUrl.pathname
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');
    const method = req.method.toLowerCase()
    const queryStringObject = parsedUrl.query
    const headersObject = req.headers;

    const reqProperties = {
        parsedUrl,
        path,
        trimmedPath,
        method,
        queryStringObject,
        headersObject
    }

    const decoder = new StringDecoder('utf-8')
    let realData = ''

    const chosenHandelar = routes[trimmedPath] ? routes[trimmedPath] : notFoundHandler

    req.on('data', (buffer) => {
        realData += decoder.write(buffer)
    })

    req.on('end', () => {
        realData += decoder.end()

        reqProperties.body = parseJson(realData)

        chosenHandelar(reqProperties, (statusCode, playLoad) => {
            statusCode = typeof (statusCode) === 'number' ? statusCode : 500
            playLoad = typeof (playLoad) === 'object' ? playLoad : {}

            const playLoadString = JSON.stringify(playLoad)

            res.setHeader('Content-Type', 'application/json')
            res.writeHead(statusCode)
            res.end(playLoadString)
        })
    })
}

module.exports = handler