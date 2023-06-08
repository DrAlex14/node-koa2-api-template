const Router = require('koa-router')
const userController = require('../controller/user.controller')

const router = new Router({prefix: '/user'})

router.get('/register', userController.register)

router.get('/login', userController.login)

module.exports = router