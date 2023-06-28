const Router = require('koa-router')
const {auth, hadAdminPermission} = require('../middleware/auth.middleware')
const {validator} = require('../middleware/goods.middleware')
const {update, upload, goodsRelease} = require('../controller/goods.controller')

const router = new Router({prefix: '/goods'})

router.post('/upload', auth, hadAdminPermission, upload)

router.post('/', auth, hadAdminPermission, validator, goodsRelease)

router.put('/:id', auth, hadAdminPermission, validator, update)

module.exports = router