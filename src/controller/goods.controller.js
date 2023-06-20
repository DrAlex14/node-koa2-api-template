class goodsController {
    async upload(ctx, next) {
        ctx.body = '上传图片'
    }
}

module.exports = new goodsController()