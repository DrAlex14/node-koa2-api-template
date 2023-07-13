const {Op} = require('sequelize')

const Goods = require('../model/goods.model')
const Carts = require('../model/carts.model')

class CartsService {
    async createOrUpdate(user_id, goods_id) {
        // 检测是否商品下架
        let good = await Goods.findOne({
            where: {
                id: goods_id
            }
        })
        if (!good) {
            return '商品已经下架'
        } else {
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

    async findCarts(user_id, pageSize, pageNum) {
        const offset = pageSize * (pageNum - 1)
        const {count, rows} = await Carts.findAndCountAll({
            where: {
                user_id
            },
            attributes: ['id', 'number', 'selected'],
            include: {
                model: Goods,
                as: 'goods_info',
                attributes: ['id', 'goods_name', 'goods_price', 'goods_img'],
            },
            offset: offset,
            limit: pageSize * 1
        })

        rows.forEach(item => {
            console.log(item.dataValues)
            item.dataValues.total_price = (item.goods_info.goods_price * item.number).toFixed(2)
        })

        return {
            pageNum,
            pageSize,
            total: count,
            list: rows
        }
    }

    async updateCartsService({id, number, selected, user_id}) {
        const res = await Carts.findOne({where: {
            id,
            user_id
        }})
        if (!res) return ''

        number !== undefined ? (res.number = number) : ''
        selected !== undefined ? (res.selected = selected) : ''

        return await res.save()
    }

    async removeCartsService(ids) {
        const res = await Carts.destroy({
            where: {
                id: {
                    [Op.in]: ids
                }
            }
        })

        return res
    }
}

module.exports = new CartsService()