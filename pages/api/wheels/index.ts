import type { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth/next'
import { createRouter } from 'next-connect'
import { Wheel, WheelItem } from '../../../database/db';
import commonErrorHandlers from '../../../middleware/commonErrorHandlers'
import requireApiSession from '../../../middleware/requireApiSession'
import requirePlayer from '../../../middleware/requirePlayer'
import { ApiError } from '../../../types/common-api'
import { authOptions } from "../auth/[...nextauth]"



const router = createRouter<NextApiRequest, NextApiResponse<Wheel | ApiError | null>>();

export default router
    .use(requireApiSession)
    .use(requirePlayer)
    .post(async (req, res) => {
        try {
            const wheel = await Wheel.create({
                addedById: req.session.user.id,
                ownedById: req.session.user.id,
                title: req.body.title,
            })
            const wheelItems: Promise<WheelItem>[] = []
            let pos = 0
            for (const __ of new Array(wheel.size)) {
                wheelItems.push(WheelItem.create({
                    addedById: req.session.user.id,
                    ownedById: req.session.user.id,
                    position: pos,
                    wheelId: wheel.id
                }))
                pos++
            }
            await Promise.all(wheelItems)
            res.json(wheel)
        } catch (error: any) {
            res.status(500).json({ error: error.message, status: 500 })
        }
    })
    .handler(commonErrorHandlers)