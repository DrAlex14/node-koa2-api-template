const Router = require('koa-router')
const {auth, hadAdminPermission} = require('../middleware/auth.middleware')
const {validator} = require('../middleware/goods.middleware')
const {update, upload, goodsRelease, hardDelete, offShelf, onShelf, findAll} = require('../controller/goods.controller')

const router = new Router({prefix: '/goods'})

router.post('/upload', auth, hadAdminPermission, upload)

router.post('/', auth, hadAdminPermission, validator, goodsRelease)

router.put('/:id', auth, hadAdminPermission, validator, update)

router.delete('/:id', auth, hadAdminPermission, hardDelete) // 硬删除

router.post('/:id/off', auth, hadAdminPermission, offShelf) // 商品上架

router.post('/:id/on', auth, hadAdminPermission, onShelf) // 商品下架

router.get('/', findAll) // 获取商品列表

module.exports = router