const {createUser, getUserInfo} = require('../service/user.service')
class UserController {
    async register(ctx, next) {
        // 获取数据
        console.log(ctx.request.body);
        const {user_name, password} = ctx.request.body
        // 验证合法性
        if (!user_name || !password) {
            console.error('用户名或密码为空', ctx.request.body)
            ctx.status = 400
            ctx.body = {
                code: 10001,
                message: '用户名或密码为空',
                result: ''
            }
            return
        }
        // 验证合理性
        if (await getUserInfo({user_name})) {
            ctx.status = 409,
            ctx.body = {
                code: '10002',
                message: '用户已经存在',
                result: ''
            }
            return
        }
        //  操作数据库
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
    }

    async login(ctx, next) {
        ctx.body = '登录成功'
    }
}

module.exports = new UserController()