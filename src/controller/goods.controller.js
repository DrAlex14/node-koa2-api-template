const path = require('path')
const fs = require('fs')

const {fileUploadError, unSupportedFileType, publishGoodsError, invalidGoodsID} = require('../constant/error.type')
const {createGoods, updateGoods, hardDeleteGoods} = require('../service/goods.service')

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

    async update(ctx, next) {
        const {id} = ctx.params
        try {
            const res = await updateGoods(id, ctx.request.body)
            if (res) {
                ctx.body = {
                    code: 0,
                    message: '修改商品成功',
                    result: ''
                }
            } else {
                ctx.app.emit('error', invalidGoodsID, ctx)
            }
            
        } catch (error) {
            console.error(error);
        }
    }

    async hardDelete(ctx, next) {
        const {id} = ctx.params
        try {
            const res = await hardDeleteGoods(id)
            if (res) {
                ctx.body = {
                    code: 0,
                    message: '彻底删除商品成功',
                    res: ''
                }
            } else {
                ctx.app.emit('error', invalidGoodsID, ctx)
            }
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = new goodsController()