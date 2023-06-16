const {getUserInfo} = require('../service/user.service')
const {userFormateError, userAlreadyExited, userRegisterError} = require('../constant/error.type')

const userValidator = async (ctx, next) => {
    const {user_name, password} = ctx.request.body

    // 验证合法性
    if (!user_name || !password) {
        console.error('用户名或密码为空', ctx.request.body)
        ctx.app.emit('error', userFormateError, ctx) //提交错误, 在app.js中统一处理
        return
    }

    await next()
}

const verifyUser = async (ctx, next) => {
    const {user_name} = ctx.request.body
    // 验证合理性
    // if (await getUserInfo({user_name})) {
    //     console.error('用户名已经存在', { user_name })
    //     ctx.app.emit('error', userAlreadyExited, ctx)
    //     return
    // }

    try {
        const res = await getUserInfo({user_name})
        if (res) {
            console.error('用户名已经存在', { user_name })
            ctx.app.emit('error', userAlreadyExited, ctx)
            return
        }
    } catch (error) {
        console.error('获取用户信息出错', error);
        ctx.app.emit('error', userRegisterError, ctx)
        return
    }

    await next()
}

module.exports = {
    userValidator,
    verifyUser
}