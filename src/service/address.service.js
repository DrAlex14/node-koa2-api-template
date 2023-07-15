
const Address = require('../model/address.model')

class AddressService{
    async addAddrService(addr) {
        console.log(addr);
        const res = await Address.create(addr)
        return res
    }
}

module.exports = new AddressService()