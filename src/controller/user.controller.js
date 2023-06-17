const jwt = require('jsonwebtoken')
const {createUser, getUserInfo} = require('../service/user.service')
const {userRegisterError} = require('../constant/error.type')

const {JWT_SECRET} = require('../config/config.default')
class UserController {
    async register(ctx, next) {
        // 获取数据
        console.log(ctx.request.body);
        const {user_name, password} = ctx.request.body
        
        //  操作数据库
        try {
            const res = await createUser(user_name, password)
            // 返回结果
            if (res) {
                ctx.body = {
                    code: 200,
                    message: '用户注册成功',
                    result: {
                        id: res.id,
                        user_name: res.user_name
                    }
                }
            } else {
                ctx.body = {
                    code: 500,
                    message: '用户注册失败',
                    result: res
                }
            }
        } catch (error) {
            console.log(error);
            ctx.app.emit('error', userRegisterError, ctx)
        }
    }

    async login(ctx, next) {
        const {user_name} = ctx.request.body

        try {
            // 获取的res剔除password
            const {password, ...res} = await getUserInfo({user_name})
            ctx.body = {
                code: 0,
                message: '登录成功',
                result: {
                    token: jwt.sign(res, JWT_SECRET, {expiresIn: '1d'})
                }
            }
        } catch (error) {
            console.error('用户登录失败', error);
        }
    }
}

module.exports = new UserController()