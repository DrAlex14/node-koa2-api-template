const Router = require('koa-router')
const {auth, hadAdminPermission} = require('../middleware/auth.middleware')
const {validator} = require('../middleware/goods.middleware')
const {update, upload, goodsRelease, hardDelete} = require('../controller/goods.controller')

const router = new Router({prefix: '/goods'})

router.post('/upload', auth, hadAdminPermission, upload)

router.post('/', auth, hadAdminPermission, validator, goodsRelease)

router.put('/:id', auth, hadAdminPermission, validator, update)

router.delete('/:id', auth, hadAdminPermission, hardDelete)

module.exports = router