const path = require('path')
const fs = require('fs')

const {fileUploadError, unSupportedFileType} = require('../constant/error.type')

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
}

module.exports = new goodsController()