const {createOrdersService, ordersListService} = require('../service/orders.service')

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

    async ordersList(ctx) {
        const user_id = ctx.state.user.id
        console.log(ctx.request.body);
        const {pageNum=1, pageSize=10, status=0} = ctx.request.body
        const res = await ordersListService(user_id, pageNum, pageSize, status)
        
        ctx.body = {
            code: 0,
            message: '获取订单列表成功',
            result: res
        }
    }
}

module.exports = new OrdersController()