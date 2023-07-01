# 一. 项目的初始化

## 1 npm 初始化

```
npm init -y
```

生成`package.json`文件:

- 记录项目的依赖

## 2 git 初始化

```
git init
```

生成'.git'隐藏文件夹, git 的本地仓库

## 3 创建 ReadMe 文件

# 二. 搭建项目

## 1 安装 Koa 框架

```
npm install koa
```

## 2 编写最基本的 app

创建`src/main.js`

```js
const Koa = require('koa')

const app = new Koa()

app.use((ctx, next) => {
  ctx.body = 'hello world'
})

app.listen(3000, () => {
  console.log('server is running on http://localhost:3000')
})
```

## 3 测试

在终端, 使用`node src/main.js`

![image-20210521142016066](http://image.brojie.cn/image-20210521142016066.png)

# 三. 项目的基本优化

## 1 自动重启服务

安装 nodemon 工具

```
npm i nodemon -D
```

编写`package.json`脚本

```json
"scripts": {
  "dev": "nodemon ./src/main.js",
  "test": "echo \"Error: no test specified\" && exit 1"
},
```

执行`npm run dev`启动服务

![image-20210521142807478](http://image.brojie.cn/image-20210521142807478.png)

## 2 读取配置文件

安装`dotenv`, 读取根目录中的`.env`文件, 将配置写到`process.env`中

```
npm i dotenv
```

创建`.env`文件

```
APP_PORT=8000
```

创建`src/config/config.default.js`

```js
const dotenv = require('dotenv')

dotenv.config()

// console.log(process.env.APP_PORT)

module.exports = process.env
```

改写`main.js`

```js
const Koa = require('koa')

const { APP_PORT } = require('./config/config.default')

const app = new Koa()

app.use((ctx, next) => {
  ctx.body = 'hello api'
})

app.listen(APP_PORT, () => {
  console.log(`server is running on http://localhost:${APP_PORT}`)
})
```

# 四. 添加路由

路由: 根据不同的 URL, 调用对应处理函数

## 1 安装 koa-router

```
npm i koa-router
```

步骤:

1. 导入包
2. 实例化对象
3. 编写路由
4. 注册中间件

## 2 编写路由

创建`src/router`目录, 编写`user.route.js`

```js
const Router = require('koa-router')

const router = new Router({ prefix: '/users' })

// GET /users/
router.get('/', (ctx, next) => {
  ctx.body = 'hello users'
})

module.exports = router
```

## 3 改写 main.js

```js
const Koa = require('koa')

const { APP_PORT } = require('./config/config.default')

const userRouter = require('./router/user.route')

const app = new Koa()

app.use(userRouter.routes())

app.listen(APP_PORT, () => {
  console.log(`server is running on http://localhost:${APP_PORT}`)
})
```

# 五. 目录结构优化

## 1 将 http 服务和 app 业务拆分

创建`src/app/index.js`

```js
const Koa = require('koa')

const userRouter = require('../router/user.route')

const app = new Koa()

app.use(userRouter.routes())

module.exports = app
```

改写`main.js`

```js
const { APP_PORT } = require('./config/config.default')

const app = require('./app')

app.listen(APP_PORT, () => {
  console.log(`server is running on http://localhost:${APP_PORT}`)
})
```

## 2 将路由和控制器拆分

路由: 解析 URL, 分布给控制器对应的方法

控制器: 处理不同的业务

改写`user.route.js`

```js
const Router = require('koa-router')

const { register, login } = require('../controller/user.controller')

const router = new Router({ prefix: '/users' })

// 注册接口
router.post('/register', register)

// 登录接口
router.post('/login', login)

module.exports = router
```

创建`controller/user.controller.js`

```js
class UserController {
  async register(ctx, next) {
    ctx.body = '用户注册成功'
  }

  async login(ctx, next) {
    ctx.body = '登录成功'
  }
}

module.exports = new UserController()
```

# 六. 解析 body

## 1 安装 koa-body

```
npm i koa-body
```

## 2 注册中间件

改写`app/index.js`

![image-20210521165536780](http://image.brojie.cn/image-20210521165536780.png)

## 3 解析请求数据

改写`user.controller.js`文件

```js
const { createUser } = require('../service/user.service')

class UserController {
  async register(ctx, next) {
    // 1. 获取数据
    // console.log(ctx.request.body)
    const { user_name, password } = ctx.request.body
    // 2. 操作数据库
    const res = await createUser(user_name, password)
    // console.log(res)
    // 3. 返回结果
    ctx.body = ctx.request.body
  }

  async login(ctx, next) {
    ctx.body = '登录成功'
  }
}

module.exports = new UserController()
```

## 4 拆分 service 层

service 层主要是做数据库处理

创建`src/service/user.service.js`

```js
class UserService {
  async createUser(user_name, password) {
    // todo: 写入数据库
    return '写入数据库成功'
  }
}

module.exports = new UserService()
```

# 七. 集成 sequlize

sequelize ORM 数据库工具

ORM: 对象关系映射

- 数据表映射(对应)一个类
- 数据表中的数据行(记录)对应一个对象
- 数据表字段对应对象的属性
- 数据表的操作对应对象的方法

## 1 安装 sequelize

```
npm i mysql2 sequelize
```

## 2 连接数据库

```
src/db/seq.js
const { Sequelize } = require('sequelize')

const {
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_USER,
  MYSQL_PWD,
  MYSQL_DB,
} = require('../config/config.default')

const seq = new Sequelize(MYSQL_DB, MYSQL_USER, MYSQL_PWD, {
  host: MYSQL_HOST,
  dialect: 'mysql',
})

seq
  .authenticate()
  .then(() => {
    console.log('数据库连接成功')
  })
  .catch((err) => {
    console.log('数据库连接失败', err)
  })

module.exports = seq
```

## 3 编写配置文件

```
APP_PORT = 8000

MYSQL_HOST = localhost
MYSQL_PORT = 3306
MYSQL_USER = root
MYSQL_PWD = 123456
MYSQL_DB = zdsc
```

# 八. 创建 User 模型

## 1 拆分 Model 层

sequelize 主要通过 Model 对应数据表

创建`src/model/user.model.js`

```js
const { DataTypes } = require('sequelize')

const seq = require('../db/seq')

// 创建模型(Model zd_user -> 表 zd_users)
const User = seq.define('zd_user', {
  // id 会被sequelize自动创建, 管理
  user_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    comment: '用户名, 唯一',
  },
  password: {
    type: DataTypes.CHAR(64),
    allowNull: false,
    comment: '密码',
  },
  is_admin: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: 0,
    comment: '是否为管理员, 0: 不是管理员(默认); 1: 是管理员',
  },
})

// 强制同步数据库(创建数据表)
// User.sync({ force: true })

module.exports = User
```

# 九. 添加用户入库

所有数据库的操作都在 Service 层完成, Service 调用 Model 完成数据库操作

改写`src/service/user.service.js`

```js
const User = require('../model/use.model')

class UserService {
  async createUser(user_name, password) {
    // 插入数据
    // User.create({
    //   // 表的字段
    //   user_name: user_name,
    //   password: password
    // })

    // await表达式: promise对象的值
    const res = await User.create({ user_name, password })
    // console.log(res)

    return res.dataValues
  }
}

module.exports = new UserService()
```

同时, 改写`user.controller.js`

```js
const { createUser } = require('../service/user.service')

class UserController {
  async register(ctx, next) {
    // 1. 获取数据
    // console.log(ctx.request.body)
    const { user_name, password } = ctx.request.body
    // 2. 操作数据库
    const res = await createUser(user_name, password)
    // console.log(res)
    // 3. 返回结果
    ctx.body = {
      code: 0,
      message: '用户注册成功',
      result: {
        id: res.id,
        user_name: res.user_name,
      },
    }
  }

  async login(ctx, next) {
    ctx.body = '登录成功'
  }
}

module.exports = new UserController()
```

# 十. 错误处理

在控制器中, 对不同的错误进行处理, 返回不同的提示错误提示, 提高代码质量

```js
const { createUser, getUerInfo } = require('../service/user.service')

class UserController {
  async register(ctx, next) {
    // 1. 获取数据
    // console.log(ctx.request.body)
    const { user_name, password } = ctx.request.body

    // 合法性
    if (!user_name || !password) {
      console.error('用户名或密码为空', ctx.request.body)
      ctx.status = 400
      ctx.body = {
        code: '10001',
        message: '用户名或密码为空',
        result: '',
      }
      return
    }
    // 合理性
    if (getUerInfo({ user_name })) {
      ctx.status = 409
      ctx.body = {
        code: '10002',
        message: '用户已经存在',
        result: '',
      }
      return
    }
    // 2. 操作数据库
    const res = await createUser(user_name, password)
    // console.log(res)
    // 3. 返回结果
    ctx.body = {
      code: 0,
      message: '用户注册成功',
      result: {
        id: res.id,
        user_name: res.user_name,
      },
    }
  }

  async login(ctx, next) {
    ctx.body = '登录成功'
  }
}

module.exports = new UserController()
```

在 service 中封装函数

```js
const User = require('../model/use.model')

class UserService {
  async createUser(user_name, password) {
    // 插入数据
    // await表达式: promise对象的值
    const res = await User.create({ user_name, password })
    // console.log(res)

    return res.dataValues
  }

  async getUerInfo({ id, user_name, password, is_admin }) {
    const whereOpt = {}

    id && Object.assign(whereOpt, { id })
    user_name && Object.assign(whereOpt, { user_name })
    password && Object.assign(whereOpt, { password })
    is_admin && Object.assign(whereOpt, { is_admin })

    const res = await User.findOne({
      attributes: ['id', 'user_name', 'password', 'is_admin'],
      where: whereOpt,
    })

    return res ? res.dataValues : null
  }
}

module.exports = new UserService()
```

# 十一. 拆分中间件

为了使代码的逻辑更加清晰, 我们可以拆分一个中间件层, 封装多个中间件函数

![image-20210524154353520](http://image.brojie.cn/image-20210524154353520.png)

## 1 拆分中间件

添加`src/middleware/user.middleware.js`

```js
const { getUerInfo } = require('../service/user.service')
const { userFormateError, userAlreadyExited } = require('../constant/err.type')

const userValidator = async (ctx, next) => {
  const { user_name, password } = ctx.request.body
  // 合法性
  if (!user_name || !password) {
    console.error('用户名或密码为空', ctx.request.body)
    ctx.app.emit('error', userFormateError, ctx)
    return
  }

  await next()
}

const verifyUser = async (ctx, next) => {
  const { user_name } = ctx.request.body

  if (getUerInfo({ user_name })) {
    ctx.app.emit('error', userAlreadyExited, ctx)
    return
  }

  await next()
}

module.exports = {
  userValidator,
  verifyUser,
}
```

## 2 统一错误处理

- 在出错的地方使用`ctx.app.emit`提交错误
- 在 app 中通过`app.on`监听

编写统一的错误定义文件

```js
module.exports = {
  userFormateError: {
    code: '10001',
    message: '用户名或密码为空',
    result: '',
  },
  userAlreadyExited: {
    code: '10002',
    message: '用户已经存在',
    result: '',
  },
}
```

## 3 错误处理函数

```js
module.exports = (err, ctx) => {
  let status = 500
  switch (err.code) {
    case '10001':
      status = 400
      break
    case '10002':
      status = 409
      break
    default:
      status = 500
  }
  ctx.status = status
  ctx.body = err
}
```

改写`app/index.js`

```js
const errHandler = require('./errHandler')
// 统一的错误处理
app.on('error', errHandler)
```

# 十二. 加密

在将密码保存到数据库之前, 要对密码进行加密处理

123123abc (加盐) 加盐加密

## 1 安装 bcryptjs

```
npm i bcryptjs
```

## 2 编写加密中间件

```js
const crpytPassword = async (ctx, next) => {
  const { password } = ctx.request.body

  const salt = bcrypt.genSaltSync(10)
  // hash保存的是 密文
  const hash = bcrypt.hashSync(password, salt)

  ctx.request.body.password = hash

  await next()
}
```

## 3 在 router 中使用

改写`user.router.js`

```js
const Router = require('koa-router')

const {
  userValidator,
  verifyUser,
  crpytPassword,
} = require('../middleware/user.middleware')
const { register, login } = require('../controller/user.controller')

const router = new Router({ prefix: '/users' })

// 注册接口
router.post('/register', userValidator, verifyUser, crpytPassword, register)

// 登录接口
router.post('/login', login)

module.exports = router
```

# 十三. 登录验证

流程:

- 验证格式
- 验证用户是否存在
- 验证密码是否匹配

改写`src/middleware/user.middleware.js`

```js
const bcrypt = require('bcryptjs')

const { getUerInfo } = require('../service/user.service')
const {
  userFormateError,
  userAlreadyExited,
  userRegisterError,
  userDoesNotExist,
  userLoginError,
  invalidPassword,
} = require('../constant/err.type')

const userValidator = async (ctx, next) => {
  const { user_name, password } = ctx.request.body
  // 合法性
  if (!user_name || !password) {
    console.error('用户名或密码为空', ctx.request.body)
    ctx.app.emit('error', userFormateError, ctx)
    return
  }

  await next()
}

const verifyUser = async (ctx, next) => {
  const { user_name } = ctx.request.body

  // if (await getUerInfo({ user_name })) {
  //   ctx.app.emit('error', userAlreadyExited, ctx)
  //   return
  // }
  try {
    const res = await getUerInfo({ user_name })

    if (res) {
      console.error('用户名已经存在', { user_name })
      ctx.app.emit('error', userAlreadyExited, ctx)
      return
    }
  } catch (err) {
    console.error('获取用户信息错误', err)
    ctx.app.emit('error', userRegisterError, ctx)
    return
  }

  await next()
}

const crpytPassword = async (ctx, next) => {
  const { password } = ctx.request.body

  const salt = bcrypt.genSaltSync(10)
  // hash保存的是 密文
  const hash = bcrypt.hashSync(password, salt)

  ctx.request.body.password = hash

  await next()
}

const verifyLogin = async (ctx, next) => {
  // 1. 判断用户是否存在(不存在:报错)
  const { user_name, password } = ctx.request.body

  try {
    const res = await getUerInfo({ user_name })

    if (!res) {
      console.error('用户名不存在', { user_name })
      ctx.app.emit('error', userDoesNotExist, ctx)
      return
    }

    // 2. 密码是否匹配(不匹配: 报错)
    if (!bcrypt.compareSync(password, res.password)) {
      ctx.app.emit('error', invalidPassword, ctx)
      return
    }
  } catch (err) {
    console.error(err)
    return ctx.app.emit('error', userLoginError, ctx)
  }

  await next()
}

module.exports = {
  userValidator,
  verifyUser,
  crpytPassword,
  verifyLogin,
}
```

定义错误类型

```js
module.exports = {
  userFormateError: {
    code: '10001',
    message: '用户名或密码为空',
    result: '',
  },
  userAlreadyExited: {
    code: '10002',
    message: '用户已经存在',
    result: '',
  },
  userRegisterError: {
    code: '10003',
    message: '用户注册错误',
    result: '',
  },
  userDoesNotExist: {
    code: '10004',
    message: '用户不存在',
    result: '',
  },
  userLoginError: {
    code: '10005',
    message: '用户登录失败',
    result: '',
  },
  invalidPassword: {
    code: '10006',
    message: '密码不匹配',
    result: '',
  },
}
```

改写路由

```js
// 登录接口
router.post('/login', userValidator, verifyLogin, login)
```

# 十四. 用户的认证

登录成功后, 给用户颁发一个令牌 token, 用户在以后的每一次请求中携带这个令牌.

jwt: jsonwebtoken

- header: 头部
- payload: 载荷
- signature: 签名

## 1 颁发 token

### 1) 安装 jsonwebtoken

```
npm i jsonwebtoken
```

### 2) 在控制器中改写 login 方法

```js
async login(ctx, next) {
  const { user_name } = ctx.request.body

  // 1. 获取用户信息(在token的payload中, 记录id, user_name, is_admin)
  try {
    // 从返回结果对象中剔除password属性, 将剩下的属性放到res对象
    const { password, ...res } = await getUerInfo({ user_name })

    ctx.body = {
      code: 0,
      message: '用户登录成功',
      result: {
        token: jwt.sign(res, JWT_SECRET, { expiresIn: '1d' }),
      },
    }
  } catch (err) {
    console.error('用户登录失败', err)
  }
}
```

### 3) 定义私钥

在`.env`定义

```
JWT_SECRET = xzd
```

## 2 用户认证

### 1) 创建 auth 中间件

```js
const jwt = require('jsonwebtoken')

const { JWT_SECRET } = require('../config/config.default')

const { tokenExpiredError, invalidToken } = require('../constant/err.type')

const auth = async (ctx, next) => {
  const { authorization } = ctx.request.header
  const token = authorization.replace('Bearer ', '')
  console.log(token)

  try {
    // user中包含了payload的信息(id, user_name, is_admin)
    const user = jwt.verify(token, JWT_SECRET)
    ctx.state.user = user
  } catch (err) {
    switch (err.name) {
      case 'TokenExpiredError':
        console.error('token已过期', err)
        return ctx.app.emit('error', tokenExpiredError, ctx)
      case 'JsonWebTokenError':
        console.error('无效的token', err)
        return ctx.app.emit('error', invalidToken, ctx)
    }
  }

  await next()
}

module.exports = {
  auth,
}
```

# 十五.修改密码

### 1) 改写 router

```js
// 修改密码接口
router.patch('/', auth, (ctx, next) => {
  console.log(ctx.state.user)
  ctx.body = '修改密码成功'
})
```

### 2) userController中加入changePassword修改密码中间件

```javascript
// user.router.js
router.patch('/', auth, cryptPassword, userController.changePassword)

// user.controller.js
async changePassword(ctx, next) {
        const {id} = ctx.state.user
        const {password} = ctx.request.body
        console.log(id);
        console.log(password);

        // 操作数据库
        if (await updateById({id, password})) {
            ctx.body = {
                code: 0,
                message: '修改密码成功',
                result: '',
            }
        } else {
            ctx.body = {
                code: '10007',
                message: '修改密码失败',
                result: '',
            }
        }
        // 3. 返回结果
    }
```



# 十六. 自动加载路由

router文件夹中建立index.js使用fs模块自动加载文件下路由文件

```javascript
// src/router/index.js
const fs = require('fs')

// 自动导入文件夹下所有路由文件
fs.readdirSync(__dirname).forEach(file => {
    console.log('filename', file)
    if (file !== 'index.js') {
        let r = require('./' + file)
        router.use(r.routes())
    }
})

// src/app/index.js
app.use(indexRouter.routes()).use(indexRouter.allowedMethods()) // 不支持的请求方式报501错误而不是404
```

# 十七. 用户上传商品图片

### 1) router给路由/load添加检测用户是否有管理员权限中间件

```javascript
const hadAdminPermission = async (ctx, next) => {
    const {is_admin} = ctx.state.user
    if (!is_admin) {
        console.error('用户没有管理员权限', ctx.state.user)
        ctx.app.emit('error', hasNotAdminPermission, ctx)
    } else {
        await next()
    }
}
```

### 2)  koa-body添加设置解析图片等文件参数

```javascript
app.use(koaBody({
    multipart: true, // 解析多个文件
    formidable: {
        // 在配置option里, 相对路径是相对process.cwd()
        uploadDir: path.join(__dirname, '../upload'),
        keepExtensions: true, // 保留文件扩展名
        maxFieldsSize: 100 * 1024 * 1024 // 设置文件上传大小 默认2M
    }
}))
```

### 3) controller获取请求中文件信息

通过ctx.request.files获取请求中的文件信息

```javascript
async upload(ctx, next) {
        console.log(ctx.request.files)
        const {pic} = ctx.request.files // pic对应请求中文件的key
        if (pic) {
            ctx.body = {
                code: 0,
                message: '上传图片成功',
                result: {
                    goods_img: path.basename(pic.filepath)
                }
            }
        } else {
            console.error('图片上传失败')
            ctx.app.emit('error', fileUploadError, ctx)
        }
        
    }
```

### 4) koa-static对静态资源处理

```javascript
// src/app/index.js

app.use(KoaStatic(path.join(__dirname, '../upload'))) //可通过'http://localhost:8000/文件名'  访问静态资源
```

### 5) 检测上传文件的类型
获取文件的`mimetype`进行正则表达式测试检测文件类型，非支持的文件类型通过fs.unlinkSync删除
```javascript
if (pic) {
    if (!pic.mimetype.match(/image\/.+/)) {
        console.error('不支持的文件格式')
        ctx.app.emit('error', unSupportedFileType, ctx)
        return fs.unlinkSync(pic.filepath)
    }
    ctx.body = {
        code: 0,
        message: '上传图片成功',
        result: {
            goods_img: path.basename(pic.filepath)
        }
    }
} else {
    console.error('图片上传失败')
    ctx.app.emit('error', fileUploadError, ctx)
}
```

# 十八. 用户发布商品
### 1) 硬删除商品
sequelize的 delete查询,使用Model.destroy方法将在数据库中直接移除数据
```javascript
async hardDeleteGoods(id) {
    const res = await Goods.destroy({where: {id}})
    console.log('res', res);
    return res > 0
}
```

### 2) 偏执表
通常不会直接在数据库中彻底移除数据，而是通过修改一个单独字段改变是否删除的状态

Sequelize 支持 paranoid 表的概念. 一个 paranoid 表是一个被告知删除记录时不会真正删除它的表.反而一个名为 deletedAt 的特殊列会将其值设置为该删除请求的时间戳.
这意味着偏执表会执行记录的 软删除,而不是 硬删除
```javascript
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
```

当你调用 destroy 方法时,将发生软删除
```javascript
async offShelfGoods(id) {
    const res = await Goods.destroy({where: {id}})
    return res > 0
}
// UPDATE "goods" SET "deletedAt"=[timestamp] WHERE "deletedAt" IS NULL AND "id" = id
```

当你调用 restore 方法时,恢复软删除的记录
```javascript
async onShelfGoods(id) {
    const res = await Goods.restore({where: {id}})
    console.log(res)
    return res > 0
}
```

# 十九. 商品列表
findAndCountAll 方法是结合了 findAll 和 count 的便捷方法. 在处理与分页有关的查询时非常有用,在分页中,你想检索带有 limit 和 offset 的数据,但又需要知道与查询匹配的记录总数.

当没有提供 group 时, findAndCountAll 方法返回一个具有两个属性的对象：

count - 一个整数 - 与查询匹配的记录总数
rows - 一个数组对象 - 获得的记录
当提供了 group 时, findAndCountAll 方法返回一个具有两个属性的对象：

count - 一个数组对象 - 包含每组中的合计和预设属性
rows - 一个数组对象 - 获得的记录

```javascript
async findAllGoods(pageSize, pageNum) {
    const offset = (pageNum - 1) * pageSize // 偏移量
    const {count, rows} = await Goods.findAndCountAll({
        offset: offset,
        limit: pageSize * 1 // limit默认为string, *1使参数值为number
    })
    return {
        pageNum,
        pageSize,
        total: count, // 总共数据量
        list: rows    // 获取到的数据
    }
}
```