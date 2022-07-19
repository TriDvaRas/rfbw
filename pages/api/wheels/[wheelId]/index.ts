import type { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth/next'
import { createRouter } from 'next-connect'
import { Wheel } from '../../../../database/db'
import commonErrorHandlers from '../../../../middleware/commonErrorHandlers'
import requireApiSession from '../../../../middleware/requireApiSession'
import requirePlayer from '../../../../middleware/requirePlayer'
import { ApiError } from '../../../../types/common-api'
import { authOptions } from "../../auth/[...nextauth]"



const router = createRouter<NextApiRequest, NextApiResponse<Wheel | ApiError | null>>();

export default router
    .get(async (req, res) => {
        try {
            const wheel = await Wheel.findOne({
                where: {
                    id: req.query.wheelId
                }
            })
            if (wheel)
                res.json(wheel)
            else
                res.status(404).json({ error: 'А где', status: 404 })
        } catch (error: any) {
            res.status(500).json({ error: error.message, status: 500 })
        }
    })
    .use(requireApiSession)
    .use(requirePlayer)
    .patch(async (req, res) => {
        try {
            const wheel = await Wheel.findOne({
                where: {
                    id: req.query.wheelId
                }
            })
            if (!wheel)
                return res.status(404).json({ error: 'А где', status: 404 })
            if (wheel.ownedById !== req.session.user.id && !req.session.user.isAdmin)
                return res.status(403).json({ error: 'Иди нахуй', status: 404 })

            wheel.title = req.body.title === undefined ? wheel.title : req.body.title
            wheel.borderColor = req.body.borderColor === undefined ? wheel.borderColor : req.body.borderColor
            wheel.pointerColor = req.body.pointerColor === undefined ? wheel.pointerColor : req.body.pointerColor
            wheel.backgroundColor = req.body.backgroundColor === undefined ? wheel.backgroundColor : req.body.backgroundColor
            wheel.dotColor = req.body.dotColor === undefined ? wheel.dotColor : req.body.dotColor
            wheel.minimalSpin = req.body.minimalSpin === undefined ? wheel.minimalSpin : req.body.minimalSpin
            wheel.audioId = req.body.audioId === undefined ? wheel.audioId : req.body.audioId
            wheel.spinDuration = req.body.spinDuration === undefined ? wheel.spinDuration : req.body.spinDuration
            wheel.prespinDuration = req.body.prespinDuration === undefined ? wheel.prespinDuration : req.body.prespinDuration
            if (req.session.user.isAdmin) {
                wheel.minSize = req.body.minSize === undefined ? wheel.minSize : req.body.minSize
                wheel.maxSize = req.body.maxSize === undefined ? wheel.maxSize : req.body.maxSize
                wheel.approved = req.body.approved === undefined ? wheel.approved : req.body.approved
                wheel.locked = req.body.locked === undefined ? wheel.locked : req.body.locked
            }
            await wheel.save()
            res.json(wheel)
        } catch (error: any) {
            res.status(500).json({ error: error.message, status: 500 })
        }
    })
    .handler(commonErrorHandlers)