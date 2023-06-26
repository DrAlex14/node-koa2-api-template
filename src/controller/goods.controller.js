const path = require('path')
const fs = require('fs')

const {fileUploadError, unSupportedFileType, publishGoodsError} = require('../constant/error.type')
const {createGoods} = require('../service/goods.service')

class goodsController {
    async upload(ctx, next) {
        console.log('files', ctx.request.files)
        const {pic} = ctx.request.files
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
        
    }

    async goodsRelease(ctx, next) {
        // 调用service的createGoods方法
        try {
            const {createdAt, updatedAt, ...res} = await createGoods(ctx.request.body) 
            ctx.body = {
                code: 0,
                message: '商品发布成功',
                result: res
            }
        } catch (error) {
            console.error(error)
            return ctx.app.emit('error', publishGoodsError, ctx)
        }
    }
}

module.exports = new goodsController()