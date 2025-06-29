
const handler = {

}
handler.sampleHandler = (reqProperties, callback) => {
    callback(200, {
        message: 'this is sample route'
    })
}

module.exports = handler