const {createOrUpdate, findCarts, updateCartsService, removeCartsService, selectAllService, cancelSelectAllService} = require('../service/carts.service.js')
const {cartFormatError} = require('../constant/error.type.js')

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

    async updateCarts(ctx, next) {
        const user_id = ctx.state.user.id
        const {id} = ctx.request.params
        const {number, selected} = ctx.request.body
        if (!number && !selected) { // number 和 selected 不能同时缺失
            cartFormatError.message = 'number和selected不能同时为空'
            ctx.app.emit('error', cartFormatError, ctx)
        }

        const res = await updateCartsService({id, number, selected, user_id})
        ctx.body = {
            code: 0,
            message: '更新购物车成功',
            result: res
        }
    }

    async removeCarts(ctx, next) {
        const {ids} = ctx.request.body

        const res = await removeCartsService(ids)

        ctx.body = {
            code: 0,
            message: '商品删除成功',
            result: res
        }
    }

    async selectAll(ctx, next) {
        const user_id = ctx.state.user.id
        const res = await selectAllService(user_id)

        ctx.body = {
            code: 0,
            message: '全部商品选中',
            result: res
        }
    }

    async cancelSelectAll(ctx, next) {
        const user_id = ctx.state.user.id
        const res = await cancelSelectAllService(user_id)

        ctx.body = {
            code: 0,
            message: '全部商品取消选中',
            result: res
        }
    }
}

module.exports = new Cart()