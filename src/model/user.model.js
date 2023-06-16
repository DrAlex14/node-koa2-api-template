const { DataTypes } = require('sequelize')
const seq = require('../db/seq')


// 创建模型
// User {id: int; user_name: varchar(255); password: char(64); is_admin: tinyint(1)}
const User = seq.define('User', {
    // id会被自动创建
    user_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        comment: '用户名, 唯一'
    },
    password: {
        type: DataTypes.CHAR(64),
        allowNull: false,
        comment: '密码'
    },
    is_admin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0,
        comment: '是否为管理员, 1是管理员, 0非管理员'
    }
})


// class User extends Model {}
// User.init({
//     // 在这里定义模型属性
//     firstName: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     lastName: {
//         type: DataTypes.STRING
//         // allowNull 默认为 true
//     }
// }, {
//     // 这是其他模型参数
//     sequelize, // 我们需要传递连接实例
//     modelName: 'User' // 我们需要选择模型名称
// });

//// 创建数据表
//// User.sync() - 如果表不存在,则创建该表(如果已经存在,则不执行任何操作)
//// User.sync({ force: true }) - 将创建表,如果表已经存在,则将其首先删除
//// User.sync({ alter: true }) - 这将检查数据库中表的当前状态(它具有哪些列,它们的数据类型等),然后在表中进行必要的更改以使其与模型匹配.
// User.sync({force: true})

module.exports = User