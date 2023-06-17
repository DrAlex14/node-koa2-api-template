const {getUserInfo} = require('../service/user.service')
const {userFormateError, userAlreadyExited, userRegisterError, userDoesNotExist, userLoginError, invalidPassword} = require('../constant/error.type')
const bcrypt = require('bcryptjs')

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

const cryptPassword = async (ctx, next) => {
    const {password} = ctx.request.body
    const salt = bcrypt.genSaltSync(10)
    // hash保存密文
    const hash = bcrypt.hashSync(password, salt)
    ctx.request.body.password = hash

    await next()
}

const verifyLogin = async (ctx, next) => {
    const {user_name, password} = ctx.request.body
    
    try {
        // 判断用户是否存在
        const res = await getUserInfo({user_name})
        if (!res) {
            console.error('用户名不存在', {user_name})
            ctx.app.emit('error', userDoesNotExist, ctx)
            return
        }
        // 判断用户密码是否准确
        if (!bcrypt.compareSync(password, res.password)) {
            console.error('用户密码错误')
            ctx.app.emit('error', invalidPassword, ctx)
            return
        }
    } catch (error) {
        console.error(error);
        ctx.app.emit('error', userLoginError, ctx)
    }

    await next()
}

module.exports = {
    userValidator,
    verifyUser,
    cryptPassword,
    verifyLogin
}