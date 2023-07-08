// 导入koa-router
const Router = require('koa-router')

// 中间件
const {auth} = require('../middleware/auth.middleware')
const {validator} = require('../middleware/cart.middleware')

// 控制件
const {addCart} = require('../controller/cart.controller')


// 实例化router对象
const router = new Router({prefix: '/carts'})

// 编写路由规则

// 添加物品到购物车
router.post('/', auth, validator({ goods_id: 'number' }), addCart)


// 导出router对象
module.exports = router