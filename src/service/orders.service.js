
const Orders = require('../model/orders.model')

class OrdersService{ 
    async createOrdersService(orders) {
        return await Orders.create(orders)
    }
}

module.exports = new OrdersService()