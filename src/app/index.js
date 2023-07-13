const path = require('path')

const KoaStatic = require('koa-static')
const Koa = require('koa')
const {koaBody} = require('koa-body')
const parameter = require('koa-parameter')
// const userRouter = require('../router/user.router')
// const goodsRouter = require('../router/goods.router')
const indexRouter = require('../router')
const errHandler = require('./errHandler')
const {unSupportedFileType} = require('../constant/error.type')


const app = new Koa()

app.use(koaBody({
    multipart: true, // 解析多个文件
    parsedMethods: ['POST', 'PUT', 'PATCH', 'DELETE'], // 默认严格模式下不会解析delete请求里的requestbody
    formidable: {
        // 在配置option里, 相对路径是相对process.cwd()
        uploadDir: path.join(__dirname, '../upload'),
        keepExtensions: true, // 保留文件扩展名
        maxFieldsSize: 100 * 1024 * 1024, // 设置文件上传大小 默认2M
        // onFileBegin: (name, file) => {
        //     const reg = /\.[A-Za-z]+$/g
        //     const ext = file.originalFilename.match(reg)[0]

        //     //修改上传文件名
        //     // file.filepath = path.join(__dirname, './upload/') + Date.now() + ext
        //     // file.newFilename = Date.now()
        //     // console.log(file);
        // }
    }
}))
app.use(KoaStatic(path.join(__dirname, '../upload')))
app.use(parameter(app))
app.use(indexRouter.routes())
// app.use(userRouter.routes())
// app.use(goodsRouter.routes())
.use(indexRouter.allowedMethods()) // 不支持的请求方式报501错误而不是404

//统一的错误处理
app.on('error', errHandler)

module.exports = app