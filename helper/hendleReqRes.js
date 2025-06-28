
const { StringDecoder } = require('string_decoder')
const url = require('url');

const handler = {}

handler.handleReqRes = (req, res) => {
    const parsedUrl = url.parse(req.url, true)
    const path = parsedUrl.pathname
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');
    const method = req.method.toLowerCase()
    const queryStringObject = parsedUrl.query
    const headers = req.headers;

    const decoder = new StringDecoder('utf-8')
    let realData = ''

    req.on('data', (buffer) => {
        realData += decoder.write(buffer)
    })

    req.on('end', () => {
        realData += decoder.end()
        console.log(realData);
        res.end('Hello World');
    })
}

module.exports = handler