
const crypto = require('crypto');
const environment = require('../helper/environment')

const utilites = {}

utilites.parseJson = (jsonString) => {
    let output;

    try {
        output = JSON.parse(jsonString)
    }
    catch {
        output = {}
    }
    return output;
}

// hash password
utilites.hash = (str) => {
    if (typeof (str) === 'string' && str.length > 0) {
        const hash = crypto
            .createHmac('sha256', environment.secretKey)
            .update(str)
            .digest('hex')
        return hash
    }
    return false

}
utilites.createRandomId = (stringLength) => {
    let length = stringLength
    length = typeof stringLength === 'number' && stringLength > 0 ? stringLength : false

    if (length) {
        const possibleCharacter = 'abcdefghijklmnopqrstuvwxyz1234567890'
        let output = ''

        for (let i = 1; i <= length; i += 1) {
            const randomcharacter = possibleCharacter.charAt(Math.floor(Math.random() * possibleCharacter.length))

            output += randomcharacter
        }
        return output;
    }
    return false
}

module.exports = utilites