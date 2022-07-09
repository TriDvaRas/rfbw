import multer from 'multer'
import type { NextApiRequest, NextApiResponse } from 'next'
import { createRouter } from "next-connect"
import sharp from 'sharp'
import { Image, User } from '../../../database/db'
import adminOnly from '../../../middleware/adminOnly'
import commonErrorHandlers from '../../../middleware/commonErrorHandlers'
import requireApiSession from '../../../middleware/requireApiSession copy'
import { ApiError } from '../../../types/common-api'

export const config = {
    api: {
        bodyParser: false,
        externalResolver: true,
    }
}
const upload = multer({ storage: multer.memoryStorage() })
const router = createRouter<NextApiRequest, NextApiResponse>();

export default router
    .use(requireApiSession)
    .use(upload.single('image') as any)
    .post(async (req, res: NextApiResponse<Image | ApiError>) => {
        if (req.file) {//TODO file resize
            const rawImage = await sharp(req.file.buffer)
            const meta = await rawImage.metadata()
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
        else
            res.status(400).json({ error: 'No file', status: 400 })

    })
    .handler(commonErrorHandlers)


function getBigSize(type: string) {
    switch (type) {
        case 'player':
            return 800
        case 'wheelitem':
            return 1200
        default:
            return 1500
    }
}