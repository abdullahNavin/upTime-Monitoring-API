

const { hash, createRandomId, parseJson } = require('../../helper/utilites')
const data = require('../../lib/data')

const handler = {}
handler.tokenHandler = (reqProperties, callback) => {
    const acceptedMethod = ['get', 'post', 'put', 'delete']
    if (acceptedMethod.indexOf(reqProperties.method) > -1) {
        handler._token[reqProperties.method](reqProperties, callback)
    }
    else {
        callback(405)
    }
}
handler._token = {}

handler._token.post = (reqProperties, callback) => {
    const phone = typeof (reqProperties.body.phone) === 'string' && reqProperties.body.phone.trim().length === 11 ? reqProperties.body.phone : false

    const password = typeof (reqProperties.body.password) === 'string' && reqProperties.body.password.trim().length > 0 ? reqProperties.body.password : false

    if (phone && password) {
        data.read('users', phone, (error, userdata) => {
            let hashPassword = hash(password)

            if (hashPassword === parseJson(userdata).password) {
                let tokenId = createRandomId(20)
                let expires = Date.now() + 60 * 60 * 1000
                let tokenObject = {
                    phone,
                    id: tokenId,
                    expires
                }

                // store the token

                data.create('tokens', tokenId, tokenObject, (err) => {
                    if (!err) {
                        callback(200,  tokenObject )
                    }
                    else {
                        callback(500, {
                            error: 'There is a server side error'
                        })
                    }
                })
            }
            else {
                callback(400, {
                    error: 'password is not valid'
                })
            }
        })
    }
    else {
        callback(500, {
            error: 'user alrady exist'
        })
    }

}
handler._token.get = (reqProperties, callback) => {

}
handler._token.put = (reqProperties, callback) => {

}
handler._token.delete = (reqProperties, callback) => {

}

module.exports = handler