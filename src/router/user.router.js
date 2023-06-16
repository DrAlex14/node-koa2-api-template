const Router = require('koa-router')
const userController = require('../controller/user.controller')
const {userValidator, verifyUser} = require('../middleware/user.middleware')

const router = new Router({prefix: '/user'})

router.post('/register', userValidator, verifyUser, userController.register)

router.post('/login', userController.login)

module.exports = router