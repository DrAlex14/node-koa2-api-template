const {createOrUpdate} = require('../service/carts.service.js')

class Cart {
    async addCart(ctx, next) {
        const user_id = ctx.state.user.id
        const {goods_id} = ctx.request.body
        // 操作数据库
        const res = await createOrUpdate(user_id, goods_id)
        ctx.body = {
            code: 0,
            message: '添加到购物车操作完成',
            result: res
        }
    }
}

module.exports = new Cart()