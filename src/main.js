const Koa = require('koa')
const {APP_PORT} = require('../config/config.default.js')

const app = new Koa()

app.use((ctx, next) => {
    ctx.body = 'hello world'
})

app.listen(APP_PORT, (ctx) => {
    console.log('server is running on http://localhost:8000');
})


