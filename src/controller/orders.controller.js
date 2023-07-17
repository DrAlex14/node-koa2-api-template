const {createOrdersService} = require('../service/orders.service')

class OrdersController {
    async createOrders(ctx) {
        const user_id = ctx.state.user.id
        const {address_id, goods_info, total} = ctx.request.body

        const orders_number = 'ALEXY' + Date.now()
        const res = await createOrdersService({
            user_id,
            address_id,
            goods_info,
            total,
            orders_number
        })

        ctx.body = {
            code: 0,
            message: '订单生成成功',
            result: res
        }
    }
}

module.exports = new OrdersController()