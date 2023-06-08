const Koa = require('koa')
const {koaBody} = require('koa-body')
const userRouter = require('../router/user.router')
const indexRouter = require('../router/index.router')


const app = new Koa()

app.use(koaBody())

app.use(indexRouter.routes())
app.use(userRouter.routes())


module.exports = app