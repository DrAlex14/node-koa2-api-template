const Router = require('koa-router')
const {auth, hadAdminPermission} = require('../middleware/auth.middleware')
const {validator} = require('../middleware/goods.middleware')
const {upload, goodsRelease} = require('../controller/goods.controller')

const router = new Router({prefix: '/goods'})

router.post('/upload', auth, hadAdminPermission, upload)

router.post('/', auth, hadAdminPermission, validator, goodsRelease)

module.exports = router