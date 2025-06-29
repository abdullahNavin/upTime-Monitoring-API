
const handler = {

}
handler.notFoundHandler = (reqProperties, callback) => {
    callback(404, {
        message: 'url not found'
    })
}

module.exports = handler