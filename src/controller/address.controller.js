const {addAddrService, addrListService, updateAddrService, deleteAddrService, setDefaultAddrService} = require('../service/address.service')


class AddressController {
    async addAddr(ctx, next) {
        const user_id = ctx.state.user.id
        const {consignee, phone, address} = ctx.request.body

        const res = await addAddrService({user_id, consignee, phone, address})

        ctx.body = {
            code: 0,
            message: '添加地址成功',
            result: res
        }
    }

    async addrList(ctx, next) {
        const user_id = ctx.state.user.id

        const res = await addrListService(user_id)

        ctx.body = {
            code: 0,
            message: '获取地址列表成功',
            result: res
        }
    }

    async updateAddr(ctx) {
        const {id} = ctx.request.params
        const user_id = ctx.state.user.id
        const addr = ctx.request.body
        const res = await updateAddrService(id, user_id, addr)

        ctx.body = {
            code: 0,
            message: '更新地址成功',
            result: res
        }
    }

    async deleteAddr(ctx) {
        const {id} = ctx.request.params
        const user_id = ctx.state.user.id
        
        const res = await deleteAddrService(id, user_id)

        ctx.body = {
            code: 0,
            message: '删除地址成功',
            result: res
        }
    }

    async setDefaultAddr(ctx) {
        const {id} = ctx.request.params
        const user_id = ctx.state.user.id
        
        const res = await setDefaultAddrService(id, user_id)

        ctx.body = {
            code: 0,
            message: '设置默认地址成功',
            result: res
        }
    }
}

module.exports = new AddressController()