const Koa = require('koa')
const {koaBody} = require('koa-body')
// const userRouter = require('../router/user.router')
// const goodsRouter = require('../router/goods.router')
const indexRouter = require('../router')
const errHandler = require('./errHandler')


const app = new Koa()

app.use(koaBody())

app.use(indexRouter.routes())
// app.use(userRouter.routes())
// app.use(goodsRouter.routes())
.use(indexRouter.allowedMethods()) // 不支持的请求方式报501错误而不是404

//统一的错误处理
app.on('error', errHandler)

module.exports = app