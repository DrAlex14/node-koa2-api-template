const Router = require('koa-router')
const userController = require('../controller/user.controller')
const {userValidator, verifyUser, cryptPassword, verifyLogin} = require('../middleware/user.middleware')

const router = new Router({prefix: '/user'})

router.post('/register', userValidator, verifyUser, cryptPassword, userController.register)

router.post('/login', userValidator, verifyLogin, userController.login)

module.exports = router