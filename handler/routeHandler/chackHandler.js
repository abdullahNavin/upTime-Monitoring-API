
const data = require('../../lib/data')
const { parseJson, createRandomId } = require('../../helper/utilites')
const { _token } = require('./tokenHandelar')
const { maxChacks } = require('../../helper/environment')


const handler = {}
handler.chackHandler = (reqProperties, callback) => {
    const acceptedMethod = ['get', 'post', 'put', 'delete']
    if (acceptedMethod.indexOf(reqProperties.method) > -1) {
        handler._chack[reqProperties.method](reqProperties, callback)
    }
    else {
        callback(405)
    }
}
handler._chack = {}

handler._chack.post = (reqProperties, callback) => {
    const protocol = typeof (reqProperties.body.protocol) === 'string' && ['http', 'https'].indexOf(reqProperties.body.protocol) > -1 ? reqProperties.body.protocol : false;

    const url = typeof (reqProperties.body.url) === 'string' && reqProperties.body.url.trim().length > 0 ? reqProperties.body.url.trim() : false;

    const method = typeof (reqProperties.body.method) === 'string' && ['GET', 'POST', 'PUT', 'DELETE'].indexOf(reqProperties.body.method) > -1 ? reqProperties.body.method : false;

    const successCodes = typeof (reqProperties.body.successCodes) === 'object' && reqProperties.body.successCodes instanceof Array ? reqProperties.body.successCodes : false

    const timeOutSeconds = typeof (reqProperties.body.timeOutSeconds) === 'number' && reqProperties.body.timeOutSeconds % 1 === 0 && reqProperties.body.timeOutSeconds >= 1 && reqProperties.body.timeOutSeconds <= 5 ? reqProperties.body.timeOutSeconds : false


    if (protocol && url && method && successCodes && timeOutSeconds) {

        const token = typeof (reqProperties.headersObject.token) === 'string' ? reqProperties.headersObject.token : false

        if (token) {

            data.read('tokens', token, (err, tokenData) => {
                if (!err && tokenData) {
                    data.read('users', parseJson(tokenData).phone, (err, userData) => {
                        if (!err, userData) {
                            const userPhone = parseJson(userData).phone
                            _token.verify(token, userPhone, (tokenisValid) => {
                                if (tokenisValid) {
                                    let userObject = parseJson(userData)
                                    const userCheck = typeof (userObject.chacks) === 'object' && userData.chacks instanceof Array ? userData.chacks : []

                                    if (userCheck.length < maxChacks) {
                                        const chackId = createRandomId(20)
                                        const chackObject = {
                                            id: chackId,
                                            userPhone,
                                            protocol,
                                            url,
                                            method,
                                            successCodes,
                                            timeOutSeconds
                                        }

                                        data.create('chacks', chackId, chackObject, (err) => {
                                            if (!err) {
                                                userObject.chacks = userCheck
                                                userObject.chacks.push(chackId)
                                                data.update('users', userPhone, userObject, (err2) => {
                                                    if (!err2) {
                                                        callback(200, chackObject)
                                                    }
                                                    else {
                                                        callback(500, { error: 'There is a server side error' })
                                                    }
                                                })
                                            }
                                            else {
                                                callback(500, { error: 'There is a server side error' })
                                            }
                                        })
                                    }
                                    else {
                                        callback(401, { error: 'user alrady reach the check limit' })
                                    }

                                }
                                else {
                                    callback(403, { error: 'Authentication problem' })
                                }
                            })
                        }
                        else {
                            callback(403, { error: 'Authentication problem' })
                        }
                    })
                }
                else {
                    callback(401, { error: 'unauthorize access' })
                }
            })

        }
        else {
            callback(403, { error: 'Forbidden access' })
        }
    }
    else {
        callback(400, { error: 'You have a problem in your input' })
    }
}

handler._chack.get = (reqProperties, callback) => {
    const id = typeof (reqProperties.queryStringObject.id) === 'string' && reqProperties.queryStringObject.id.trim().length === 20 ? reqProperties.queryStringObject.id : false

    if (id) {

        data.read('chacks', id, (err, Udata) => {
            if (!err && Udata) {
                const userData = parseJson(Udata)

                const token = typeof (reqProperties.headersObject.token) === 'string' ? reqProperties.headersObject.token : false

                _token.verify(token, userData.userPhone, (tokenIsValid) => {
                    if (tokenIsValid) {
                        callback(200, userData)
                    }
                    else {
                        callback(403, { error: 'Forbidden access' })
                    }
                })
            }
            else {
                callback(500, { error: 'There is a server side error' })
            }
        })
    }
    else {
        callback(400, { error: 'You have a problem in your request' })
    }
}

handler._chack.put = (reqProperties, callback) => {
    const id = typeof (reqProperties.body.id) === 'string' && reqProperties.body.id.trim().length === 20 ? reqProperties.body.id : false

    // input validation
    const protocol = typeof (reqProperties.body.protocol) === 'string' && ['http', 'https'].indexOf(reqProperties.body.protocol) > -1 ? reqProperties.body.protocol : false;

    const url = typeof (reqProperties.body.url) === 'string' && reqProperties.body.url.trim().length > 0 ? reqProperties.body.url.trim() : false;

    const method = typeof (reqProperties.body.method) === 'string' && ['GET', 'POST', 'PUT', 'DELETE'].indexOf(reqProperties.body.method) > -1 ? reqProperties.body.method : false;

    const successCodes = typeof (reqProperties.body.successCodes) === 'object' && reqProperties.body.successCodes instanceof Array ? reqProperties.body.successCodes : false

    const timeOutSeconds = typeof (reqProperties.body.timeOutSeconds) === 'number' && reqProperties.body.timeOutSeconds % 1 === 0 && reqProperties.body.timeOutSeconds >= 1 && reqProperties.body.timeOutSeconds <= 5 ? reqProperties.body.timeOutSeconds : false

    if (id) {
        if (protocol || url || method || successCodes || timeOutSeconds) {
            data.read('chacks', id, (err, Cdata) => {
                const chackData = parseJson(Cdata)
                if (!err && chackData) {
                    const token = typeof (reqProperties.headersObject.token) === 'string' ? reqProperties.headersObject.token : false

                    _token.verify(token, chackData.userPhone, (tokenIsValid) => {
                        if (tokenIsValid) {
                            if (protocol) {
                                chackData.protocol = protocol
                            }
                            if (url) {
                                chackData.url = url
                            }
                            if (method) {
                                chackData.method = method
                            }
                            if (successCodes) {
                                chackData.successCodes = successCodes
                            }
                            if (timeOutSeconds) {
                                chackData.timeOutSeconds = timeOutSeconds
                            }
                            data.update('chacks', id, chackData, (err) => {
                                if (!err) {
                                    callback(200, { message: 'updated successfully' })
                                }
                                else {
                                    callback(500, { error: 'server side error' })
                                }
                            })
                        }
                        else {
                            callback(403, { error: 'unauthorize access' })
                        }
                    })
                }
                else {
                    callback(500, { error: 'server side error' })
                }
            })
        }
        else {
            callback(400, { error: 'You have to update At lest one data' })
        }
    }
    else {
        callback(400, { error: 'You have a problem in your request' })
    }

}

handler._chack.delete = (reqProperties, callback) => {
    const id = typeof (reqProperties.queryStringObject.id) === 'string' && reqProperties.queryStringObject.id.trim().length === 20 ? reqProperties.queryStringObject.id : false

    if (id) {

        data.read('chacks', id, (err, Udata) => {
            if (!err && Udata) {
                const userData = parseJson(Udata)

                const token = typeof (reqProperties.headersObject.token) === 'string' ? reqProperties.headersObject.token : false

                _token.verify(token, userData.userPhone, (tokenIsValid) => {
                    if (tokenIsValid) {
                        data.delete('chacks', id, (err2) => {
                            if (!err2) {
                                data.read('users', userData.userPhone, (err3, uData) => {
                                    let userObject = parseJson(uData)
                                    if (!err3 && userObject) {
                                        let userChacks = typeof (userObject.chacks) === 'object' && userObject.chacks instanceof Array ? userObject.chacks : []

                                        let chacksPosition = userChacks.indexOf(id)
                                        if (chacksPosition > -1) {
                                            userChacks.splice(chacksPosition, 1)
                                            userObject.chacks = userChacks
                                            data.update('users', userObject.phone, userObject, (err4) => {
                                                if (!err4) {
                                                    callback(200, { message: 'chack id deleted successfully' })
                                                }
                                                else {
                                                    callback(500, { error: 'server side error' })
                                                }
                                            })
                                        }
                                        else {
                                            callback(404, { error: 'chack id not found' })
                                        }

                                    }
                                    else {
                                        callback(500, { error: 'server side error' })
                                    }
                                })
                            }
                            else {
                                callback(500, { error: 'server side error' })
                            }
                        })
                    }
                    else {
                        callback(403, { error: 'Forbidden access' })
                    }
                })
            }
            else {
                callback(500, { error: 'There is a server side error' })
            }
        })
    }
    else {
        callback(400, { error: 'You have a problem in your request' })
    }
}

module.exports = handler