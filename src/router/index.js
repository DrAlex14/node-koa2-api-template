const Router = require('koa-router')
const fs = require('fs')


const router = new Router()

router.get('/', (ctx, next) => {
    ctx.body = 'hello index'
})

// 自动导入文件夹下所有路由文件
fs.readdirSync(__dirname).forEach(file => {
    console.log('filename', file)
    if (file !== 'index.js') {
        let r = require('./' + file)
        router.use(r.routes())
    }
})

module.exports = router