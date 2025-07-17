

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
                        callback(200, tokenObject)
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
    const id = typeof reqProperties.queryStringObject.id === 'string' && reqProperties.queryStringObject.id.trim().length === 20 ? reqProperties.queryStringObject.id : false

    if (id) {
        data.read('tokens', id, (error, tokenData) => {
            const token = parseJson(tokenData)
            if (!error && tokenData) {
                callback(200, token)
            }
            else {
                callback(404, { error: 'token was not found' })
            }
        })
    }
    else {
        callback(404, { error: 'token was not found' })
    }
}

handler._token.put = (reqProperties, callback) => {

    const id = typeof reqProperties.body.id === 'string' && reqProperties.body.id.trim().length === 20 ? reqProperties.body.id : false;

    const extend = typeof reqProperties.body.extend === 'boolean' && reqProperties.body.extend === true ? true : false

    if (id && extend) {
        data.read('tokens', id, (error, tokenData) => {
            if (!error && tokenData) {
                let tokenObject = parseJson(tokenData)
                if (tokenObject.expires > Date.now()) {
                    tokenObject.expires = Date.now() + 60 * 60 * 1000

                    // store the tokenObject

                    data.update('tokens', id, tokenObject, (err2) => {
                        if (!err2) {
                            callback(200,{message:'token updated successfully'})
                        }
                        else {
                            callback(400, { error: 'there is a server side' })
                        }
                    })
                }
                else {
                    callback(400, { error: 'token already expired' })
                }
            }
            else {
                callback(400, { error: 'There is problem in your request' })
            }
        })
    }
    else {
        callback(400, { error: 'There is problem in your request' })
    }
}

handler._token.delete = (reqProperties, callback) => {
    const id = typeof (reqProperties.queryStringObject.id) === 'string' && reqProperties.queryStringObject.id.trim().length === 20 ? reqProperties.queryStringObject.id : false

    if (id) {
        data.read('tokens', id, (error, tokenData) => {
            if (!error && tokenData) {
                data.delete('tokens', id, (err) => {
                    if (!err) {
                        callback(200, { message: 'token deleted successfully' })
                    }
                    else {
                        callback(500, { error: 'There is a server side error' })
                    }
                })
            }
            else {
                callback(400, { error: 'There is a problem in your request' })
            }
        })
    }
    else {
        callback(400, { error: 'There is a problem in your request' })
    }
}

handler._token.verify = (id, phone, callback) => {
    data.read('tokens', id, (error, tokenData) => {
        if (!error && tokenData) {
            if (parseJson(tokenData).phone === phone && parseJson(tokenData).expires > Date.now()) {
                callback(true)
            }
            else {
                callback(false)
            }
        }
        else {
            callback(false)
        }
    })
}

module.exports = handler