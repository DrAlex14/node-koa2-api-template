const Koa = require('koa')
const {APP_PORT} = require('../config/config.default.js')
const userRouter = require('./router/user.router.js')

const app = new Koa()


app.use(userRouter.routes())

app.listen(APP_PORT, (ctx) => {
    console.log(`server is running on http://localhost:${APP_PORT}`);
})


