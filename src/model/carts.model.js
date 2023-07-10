const {DataTypes} = require('sequelize')

const seq = require('../db/seq')
const Goods = require('../model/goods.model')

// 定义Cart模型
const Carts = seq.define('Carts', {
    goods_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '商品的id'
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '用户的id'
    },
    number: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: '商品数量'
    },
    selected: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: '是否选中'
    }
})

// 同步数据(建表)
// Carts.sync({force: true})

// Carts和Goods表存在一对一关系，外键在Carts中定义
Carts.belongsTo(Goods, {
    foreignKey: 'goods_id',
    as: 'goods_info'
})

module.exports = Carts