const dotenv = require('dotenv')

dotenv.config()

console.log('APP_PORT', process.env.APP_PORT);

module.exports = process.env