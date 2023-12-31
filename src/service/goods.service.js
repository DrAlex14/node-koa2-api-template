const Goods = require('../model/goods.model')

class GoodsService {
    async createGoods(goods) {
        const res = await Goods.create(goods)
        return res.dataValues
    }

    async updateGoods(id, goods) {
        const res = await Goods.update(goods, {where: {id}})
        return res[0] > 0 
    }

    async hardDeleteGoods(id) {
        const res = await Goods.destroy({where: {id}})
        console.log('res', res);
        return res > 0
    }

    async offShelfGoods(id) {
        const res = await Goods.destroy({where: {id}})
        return res > 0
    }

    async onShelfGoods(id) {
        const res = await Goods.restore({where: {id}})
        console.log(res)
        return res > 0
    }

    async findAllGoods(pageSize, pageNum) {
        const offset = (pageNum - 1) * pageSize
        const {count, rows} = await Goods.findAndCountAll({
            offset: offset,
            limit: pageSize * 1
        })
        return {
            pageNum,
            pageSize,
            total: count,
            list: rows
        }
    }
}

module.exports = new GoodsService()