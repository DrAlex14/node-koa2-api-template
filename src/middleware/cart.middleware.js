const {cartFormatError} = require('../constant/error.type')


const validator = (rules) => {
    // 接收rules，返回一个校验rules的函数
    return async (ctx, next) => {
        try {
            ctx.verifyParams(rules)
        } catch (error) {
            console.error(error)
            cartFormatError.result = error
            return ctx.app.emit('error', cartFormatError, ctx)
        }

        await next()
    }
}

module.exports = {
    validator
}