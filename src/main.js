const app = require('./app/index')
const {APP_PORT} = require('./config/config.default.js')


app.listen(APP_PORT, (ctx) => {
    console.log(`server is running on http://localhost:${APP_PORT}`);
})


