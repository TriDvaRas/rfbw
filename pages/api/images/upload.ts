import multer from 'multer'
import type { NextApiRequest, NextApiResponse } from 'next'
import { createRouter } from "next-connect"
import sharp from 'sharp'
import { Image, User } from '../../../database/db'
import adminOnly from '../../../middleware/adminOnly'
import commonErrorHandlers from '../../../middleware/commonErrorHandlers'
import requireApiSession from '../../../middleware/requireApiSession'
import requirePlayer from '../../../middleware/requirePlayer'
import { ApiError } from '../../../types/common-api'
import path from 'path';

export const config = {
    api: {
        bodyParser: false,
        externalResolver: true,
    }
}
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } })
const router = createRouter<NextApiRequest, NextApiResponse>();

export default router
    .use(requireApiSession)
    .use(requirePlayer)
    .use(upload.single('image') as any)
    .post(async (req, res: NextApiResponse<Image | ApiError>) => {
        if (req.file) {
            const rawImage = sharp(req.file.buffer)
            const meta = await rawImage.metadata()
            const ext = path.extname(req.file.originalname)
            if (ext == '.gif') {
                const bigBuffer = req.file.buffer
                const image = await Image.create({
                    addedById: req.session.user.id,
                    imageData: bigBuffer.toString('base64'),
                    type: req.body.type,
                    preview: false,
                    mime: req.file.mimetype,
                })
                const smallBuffer = await rawImage.resize(128, 128, { fit: 'outside' }).toBuffer()
                const smallImage = await Image.create({
                    id: image.id,
                    addedById: req.session.user.id,
                    imageData: smallBuffer.toString('base64'),
                    type: req.body.type,
                    preview: true,
                    mime: req.file.mimetype,
                })
                res.status(200).json(smallImage)
            }
            else {
                const minSize = getMinSizes(req.body.type)
                if ((meta.width && meta.width < minSize[0]) || (meta.height && meta.height < minSize[1]))
                    return res.status(400).json({ error: 'Найди нормальное качество картинки уебище...', status: 400 })
                const bigSize = getBigSize(req.body.type)

                const bigBuffer = await ((bigSize < (meta.height || 10000) && bigSize < (meta.width || 10000) ?
                    rawImage.resize(bigSize, bigSize, { fit: 'outside' }) : rawImage)
                    .toBuffer())
                const image = await Image.create({
                    addedById: req.session.user.id,
                    imageData: bigBuffer.toString('base64'),
                    type: req.body.type,
                    preview: false,
                    mime: req.file.mimetype,
                })
                const smallBuffer = await rawImage.resize(128, 128, { fit: 'outside' }).toBuffer()
                const smallImage = await Image.create({
                    id: image.id,
                    addedById: req.session.user.id,
                    imageData: smallBuffer.toString('base64'),
                    type: req.body.type,
                    preview: true,
                    mime: req.file.mimetype,
                })
                res.status(200).json(smallImage)
            }

        }
        else
            res.status(400).json({ error: 'No file', status: 400 })

    })
    .handler(commonErrorHandlers)


function getBigSize(type: string) {
    switch (type) {
        case 'player':
            return 1000
        case 'wheelitem':
            return 1400
        case 'game':
            return 1920
        default:
            return 1500
    }
}
function getMinSizes(type: string) {
    switch (type) {
        case 'player':
            return [600, 600]
        case 'wheelitem':
            return [500, 300]
        case 'game':
            return [750, 300]
        default:
            return [500, 500]
    }
}

//