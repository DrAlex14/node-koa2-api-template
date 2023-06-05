const Koa = require('koa')

const app = new Koa()

app.use((ctx, next) => {
    ctx.body = 'hello world'
})

app.listen(5000, (ctx) => {
    console.log('server is running on http://localhost:5000');
})


