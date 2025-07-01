
const environment = {}

environment.staging = {
    port: 5000,
    envName: 'staging',
    secretKey:'sjkdfslkdjf'
}
environment.production = {
    port: 3000,
    envName: 'production',
    secretKey:'eoirwwoeurie'
}

const currentEnvironment = typeof (process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV.trim() : 'staging'


const envToExport = typeof(environment[currentEnvironment]) === 'object'  ? environment[currentEnvironment] : environment.staging

module.exports = envToExport