const http = require('http');

const app = {}

app.config = {
    port: 5000
}

// create servr
app.createServer = () => {
    const server = http.createServer(app.handleReqRes)
    server.listen(app.config.port, () => {
        console.log(`Server is running on port ${app.config.port}`);
    })
}

// handle request response
app.handleReqRes = (req, res) => {
    res.end('Hello World');
}

// start the server
app.createServer()