const {orderFormatError} = require('../constant/error.type')

const validator = (rules) => {
    // 接收rules，返回一个校验rules的函数
    return async (ctx, next) => {
        try {
            ctx.verifyParams(rules)
        } catch (error) {
            console.error(error)
            orderFormatError.result = error
            return ctx.app.emit('error', orderFormatError, ctx)
        }

        await next()
    }
}

module.exports = {
    validator
}