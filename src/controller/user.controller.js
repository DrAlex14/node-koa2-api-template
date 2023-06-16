const {createUser} = require('../service/user.service')
const {userRegisterError} = require('../constant/error.type')
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
        ctx.body = '登录成功'
    }
}

module.exports = new UserController()