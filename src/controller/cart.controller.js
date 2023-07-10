const {createOrUpdate, findCarts} = require('../service/carts.service.js')

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

    async findAll(ctx, next) {
        console.log(ctx.state.user);
        const {id} = ctx.state.user
        const {pageSize = 10, pageNum = 1} = ctx.request.query

        const res = await findCarts(id, pageSize, pageNum)
        
        ctx.body = {
            code: 0,
            message: '获取购物车列表成功',
            result: res
        }
    }
}

module.exports = new Cart()