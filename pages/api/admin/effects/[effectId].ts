import type { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth/next'
import { createRouter } from 'next-connect'
import { Game, Wheel, WheelItem, Effect } from '../../../../database/db';
import adminOnly from '../../../../middleware/adminOnly';
import commonErrorHandlers from '../../../../middleware/commonErrorHandlers'
import requireApiSession from '../../../../middleware/requireApiSession'
import requirePlayer from '../../../../middleware/requirePlayer'
import { ApiError } from '../../../../types/common-api'
import { authOptions } from "../../auth/[...nextauth]"



const router = createRouter<NextApiRequest, NextApiResponse>();

export default router
    .use(requireApiSession)
    .use(adminOnly)
    .patch(async (req, res) => {
        try {
            const effect = await Effect.findOne({
                where: {
                    id: req.query.effectId
                }
            })
            if (!effect)
                return res.status(404).json({ error: 'А где', status: 404 })
            effect.title = req.body.title === undefined ? effect.title : req.body.title
            effect.description = req.body.description === undefined ? effect.description : req.body.description
            effect.lid = req.body.lid === undefined ? effect.lid : req.body.lid
            effect.groupId = req.body.groupId === undefined ? effect.groupId : req.body.groupId
            effect.imageId = req.body.imageId === undefined ? effect.imageId : req.body.imageId
            effect.type = req.body.type === undefined ? effect.type : req.body.type
            effect.isDefault = req.body.isDefault === undefined ? effect.isDefault : req.body.isDefault
            await effect.save()
            res.json(effect)
        } catch (error: any) {
            res.status(500).json({ error: error.message, status: 500 })
        }
    })
    .handler(commonErrorHandlers)