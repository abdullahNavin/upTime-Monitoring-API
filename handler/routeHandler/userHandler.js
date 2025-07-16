
const data = require('../../lib/data')
const { hash } = require('../../helper/utilites')
const { parseJson } = require('../../helper/utilites')
const { _token } = require('./tokenHandelar')


const handler = {}
handler.userHandler = (reqProperties, callback) => {
    const acceptedMethod = ['get', 'post', 'put', 'delete']
    if (acceptedMethod.indexOf(reqProperties.method) > -1) {
        handler._users[reqProperties.method](reqProperties, callback)
    }
    else {
        callback(405)
    }
}
handler._users = {}

handler._users.post = (reqProperties, callback) => {
    const firstName = typeof (reqProperties.body.firstName) === 'string' && reqProperties.body.firstName.trim().length > 0 ? reqProperties.body.firstName : false

    const lastName = typeof (reqProperties.body.lastName) === 'string' && reqProperties.body.lastName.trim().length > 0 ? reqProperties.body.lastName : false

    const phone = typeof (reqProperties.body.phone) === 'string' && reqProperties.body.phone.trim().length === 11 ? reqProperties.body.phone : false

    const password = typeof (reqProperties.body.password) === 'string' && reqProperties.body.password.trim().length > 0 ? reqProperties.body.password : false

    const tosAgreement = typeof (reqProperties.body.tosAgreement) === 'boolean' && reqProperties.body.tosAgreement ? reqProperties.body.tosAgreement : false

    if (firstName && lastName && phone && password && tosAgreement) {
        data.read('users', phone, (error) => {
            if (error) {
                let userObject = {
                    firstName,
                    lastName,
                    phone,
                    password: hash(password),
                    tosAgreement
                }
                data.create('users', phone, userObject, (err) => {
                    if (!err) {
                        callback(200, {
                            message: 'user has been created successfully'
                        })
                    }
                    else {
                        callback(500, {
                            message: 'There is problem, can not create user'
                        })
                    }
                })
            }
            else {
                callback(500, {
                    error: 'user alrady exist'
                })
            }
        })
    }
    else {
        callback(400, {
            error: 'There is an problem in you request'
        })
    }
}

handler._users.get = (reqProperties, callback) => {

    const phone = typeof (reqProperties.queryStringObject.phone) === 'string' && reqProperties.queryStringObject.phone.trim().length === 11 ? reqProperties.queryStringObject.phone : false

    if (phone) {

        const token = typeof (reqProperties.headersObject.token) === 'string' ? reqProperties.headersObject.token : false

        _token.verify(token, phone, (tokenId) => {
            if (tokenId) {
                data.read('users', phone, (error, u) => {
                    const user = { ...parseJson(u) }
                    if (!error && user) {
                        delete user.password
                        callback(200, user)
                    }
                    else {
                        callback(404, { message: 'user not found' })
                    }
                })
            }
            else {
                callback(403, { error: 'Authentication failed' })
            }
        })

    }
    else {
        callback(404, { message: 'user not found' })
    }
}

handler._users.put = (reqProperties, callback) => {
    // console.log(reqProperties);
    const firstName = typeof (reqProperties.body.firstName) === 'string' && reqProperties.body.firstName.trim().length > 0 ? reqProperties.body.firstName : false

    const lastName = typeof (reqProperties.body.lastName) === 'string' && reqProperties.body.lastName.trim().length > 0 ? reqProperties.body.lastName : false

    const phone = typeof (reqProperties.body.phone) === 'string' && reqProperties.body.phone.trim().length === 11 ? reqProperties.body.phone : false

    const password = typeof (reqProperties.body.password) === 'string' && reqProperties.body.password.trim().length > 0 ? reqProperties.body.password : false

    // console.log(phone, firstName);
    if (phone) {
        if (firstName || lastName || phone || password) {

            const token = typeof (reqProperties.headersObject.token) === 'string' ? reqProperties.headersObject.token : false

            _token.verify(token, phone, (tokenId) => {
                if (tokenId) {
                    data.read('users', phone, (error, uData) => {

                        const userData = { ...parseJson(uData) }

                        if (!error && userData) {
                            if (firstName) {
                                userData.firstName = firstName
                            }
                            if (lastName) {
                                userData.lastName = lastName
                            }
                            if (password) {
                                userData.password = hash(password)
                            }
                            data.update('users', phone, userData, (err) => {
                                if (!err) {
                                    callback(200, { message: 'user updated successfully' })
                                }
                                else {
                                    callback(500, { error: 'You have a problem in your request' })
                                }
                            })

                        }
                        else {
                            callback(500, { error: 'There is a server side error' })
                        }
                    })
                }
                else {
                    callback(403, { error: 'Authentication failed' })
                }
            })

        }
        else {
            callback(400, { error: 'You have a problem in your request' })
        }

    }
    else {
        callback(400, { error: 'Must have to be a phone number' })
    }
}

handler._users.delete = (reqProperties, callback) => {
    const phone = typeof (reqProperties.queryStringObject.phone) === 'string' && reqProperties.queryStringObject.phone.trim().length === 11 ? reqProperties.queryStringObject.phone : false

    if (phone) {

        const token = typeof (reqProperties.headersObject.token) === 'string' ? reqProperties.headersObject.token : false

        _token.verify(token, phone, (tokenId) => {
            if (tokenId) {
                data.read('users', phone, (error, userData) => {
                    if (!error && userData) {
                        data.delete('users', phone, (err) => {
                            if (!err) {
                                callback(200, { message: 'user deleted successfully' })
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
                callback(403, { error: 'Authentication failed' })
            }
        })
    }
    else {
        callback(400, { error: 'There is a problem in your request' })
    }
}

module.exports = handler