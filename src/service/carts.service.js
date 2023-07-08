const {Op} = require('sequelize')

const Goods = require('../model/goods.model')
const Carts = require('../model/carts.model')

class CartsService {
    async createOrUpdate(user_id, goods_id) {
        // 根据user_id 和 goods_id同时查找, 有没有记录
        let res = await Carts.findOne({
            where: {
                [Op.and]: {
                    user_id,
                    goods_id
                }
            }
        })

        if (res) {
            // 已经存在一条记录，将number + 1
            await res.increment('number')
            return res.reload()
        } else {
            // 没有记录，需要创建一条
            return await Carts.create({
                user_id,
                goods_id
            })
        }
    }
}

module.exports = new CartsService()