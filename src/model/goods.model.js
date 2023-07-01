const { DataTypes } = require('sequelize')

const seq = require('../db/seq')

const Goods = seq.define('Goods', {
        goods_name: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: '商品名称'
        },
        goods_price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            comment: '商品价格'
        },
        goods_num: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: '商品数量'
        },
        goods_img: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: '商品图片的url'
        }
    }, {
        // 软删除 link: https://www.sequelize.cn/core-concepts/paranoid
        paranoid: true
    }
)

// // 创建表命令, 建表后注释
// Goods.sync({force: true})

module.exports = Goods