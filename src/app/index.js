const Koa = require('koa')
const {koaBody} = require('koa-body')
const userRouter = require('../router/user.router')
const indexRouter = require('../router/index.router')
const errHandler = require('./errHandler')


const app = new Koa()

app.use(koaBody())

app.use(indexRouter.routes())
app.use(userRouter.routes())

//统一的错误处理
app.on('error', errHandler)

module.exports = app