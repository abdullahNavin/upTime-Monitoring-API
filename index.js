const http = require('http');
const { StringDecoder } = require('string_decoder');
const url = require('url');
const { handleReqRes } = require('./helper/hendleReqRes')
const environment = require('./helper/environment')
const data = require('./lib/data')

const app = {}

data.delete('test','newFile',(err)=>{
    console.log(err);
})

// create servr
app.createServer = () => {
    const server = http.createServer(app.handleReqRes)
    server.listen(environment.port, () => {
        console.log(`Server is running on port ${environment.port}`);
    })
}

// handle request response
app.handleReqRes = handleReqRes;

// start the server
app.createServer()