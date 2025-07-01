
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

module.exports = utilites