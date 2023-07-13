// 导入koa-router
const Router = require('koa-router')

// 中间件
const {auth} = require('../middleware/auth.middleware')
const {validator} = require('../middleware/cart.middleware')

// 控制件
const {addCart, findAll, updateCarts, removeCarts, selectAll, cancelSelectAll} = require('../controller/cart.controller')


// 实例化router对象
const router = new Router({prefix: '/carts'})

// 编写路由规则

// 添加物品到购物车
router.post('/', auth, validator({ goods_id: 'number' }), addCart)

// 查询购物车商品
router.get('/', auth, findAll)

// 更新购物车selected、number
router.patch('/:id', auth, updateCarts)

// 删除购物车商品
router.delete('/', auth, validator({ids: 'array'}), removeCarts)

// 全选商品
router.post('/selectAll', auth, selectAll)

// 全不选商品
router.post('/cancelSelectAll', auth, cancelSelectAll)


// 导出router对象
module.exports = router