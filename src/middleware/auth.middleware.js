const jwt = require('jsonwebtoken')
const {
    JWT_SECRET
} = require('../config/config.default')
const {tokenExpiredError, invalidToken} = require('../constant/error.type')


const auth = async (ctx, next) => {
    const {
        authorization
    } = ctx.request.header
    const token = authorization.replace('Bearer ', '')
    try {

        const user = jwt.verify(token, JWT_SECRET)
        console.log(user);

        ctx.state.user = user
        ctx.body = '修改密码'

    } catch (error) {
        switch (error.name) {
            case 'TokenExpiredError':
                console.error('token已过期', error)
                return ctx.app.emit('error', tokenExpiredError, ctx)
            case 'JsonWebTokenError':
                console.error('无效的token', error)
                return ctx.app.emit('error', invalidToken, ctx)
        }
    }

    await next()
}

module.exports = {
    auth
}