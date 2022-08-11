import multer from 'multer'
import type { NextApiRequest, NextApiResponse } from 'next'
import { createRouter } from "next-connect"
import sharp from 'sharp'
import { Audio, Image } from '../../../database/db'
import commonErrorHandlers from '../../../middleware/commonErrorHandlers'
import requireApiSession from '../../../middleware/requireApiSession'
import { ApiError } from '../../../types/common-api'
import * as mm from 'music-metadata';
import { writeFileSync } from 'fs'
import path from 'path'
import requirePlayer from '../../../middleware/requirePlayer'
export const config = {
    api: {
        bodyParser: false,
        externalResolver: true,
    }
}
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 30 * 1024 * 1024
    },
})
const router = createRouter<NextApiRequest, NextApiResponse>();

export default router
    .use(requireApiSession)
    .use(requirePlayer)
    .use(upload.single('audio') as any)
    .post(async (req, res: NextApiResponse<Audio | ApiError>) => {
        if (req.file) {//TODO file resize
            const metadata = await mm.parseBuffer(req.file.buffer)
            if (!metadata.format.duration)
                return res.status(400).json({ error: 'У тебя файл корраптнутый. Думай дальше', status: 400 })

            if (metadata.format.duration > getMaxDuration(req.body.type))
                return res.status(400).json({ error: 'Выбери что то покороче...', status: 400 })
            
            const audio = Audio.build({
                addedById: req.session.user.id,
                type: req.body.type,
                filePath: '',
                mime: req.file.mimetype,
                originalName: req.body.originalName
            })
            audio.filePath = `${audio.id}${path.extname(req.file.originalname)}`
            writeFileSync(`./uploads/${audio.filePath}`, req.file.buffer)
            await audio.save()
            res.status(200).json(audio)
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
        default:
            return 1500
    }
}
function getMaxDuration(type: string) {
    switch (type) {
        case 'wheel':
            return 420
        default:
            return 420
    }
}

//