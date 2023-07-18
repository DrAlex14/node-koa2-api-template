
const Orders = require('../model/orders.model')

class OrdersService{ 
    async createOrdersService(orders) {
        return await Orders.create(orders)
    }

    async ordersListService(user_id, pageNum, pageSize, status) {
        const offset = (pageNum - 1) * pageSize
        const {count, rows} = await Orders.findAndCountAll({
            attributes: ['goods_info', 'total', 'orders_number', 'status'],
            where: {user_id, status},
            offset: offset,
            limit: pageSize * 1,
        })
        return {
            pageNum,
            pageSize,
            total: count,
            list: rows
        }

        // return await Orders.findAll({where: {user_id, status}})
    }
}

module.exports = new OrdersService()