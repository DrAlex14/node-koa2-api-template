const Router = require('koa-router')

const {auth} = require('../middleware/auth.middleware')
const {validator}= require('../middleware/address.middleware')
const {addAddr, addrList, updateAddr} = require('../controller/address.controller')

const router = new Router({prefix: '/address'})

// 添加地址
router.post('/', auth, validator({
    consignee: 'string',
    phone: {type: 'string', format: /^1[3-9]\d{9}$/},
    address: 'string'    
}), addAddr)

// 获取地址列表
router.get('/', auth, addrList)

// 更新地址
router.put('/:id', auth, validator({
    consignee: 'string',
    phone: {type: 'string', format: /^1[3-9]\d{9}$/},
    address: 'string' 
}), updateAddr)

// 删除地址


// 设置默认地址


module.exports = router