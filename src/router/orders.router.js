const Router = require('koa-router')

const {auth} = require('../middleware/auth.middleware')
const {createOrders, ordersList} = require('../controller/orders.controller')
const {validator} = require('../middleware/orders.middleware')

const router = new Router({prefix: '/orders'})

router.post('/', auth, validator({
    address_id: 'int',
    goods_info: 'string',
    total: 'string'
}), createOrders)

router.post('/list', auth, ordersList)

module.exports = router