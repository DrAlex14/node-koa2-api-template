
const Address = require('../model/address.model')

class AddressService{
    async addAddrService(addr) {
        const res = await Address.create(addr)
        return res
    }

    async addrListService(user_id) {
        const res = await Address.findAll({
            attributes: ["id","consignee","phone","address","is_default"],
            where: {user_id}
        })

        return res
    }
}

module.exports = new AddressService()