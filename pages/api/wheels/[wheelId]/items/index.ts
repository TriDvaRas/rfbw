import type { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import { Wheel, WheelItem } from '../../../../../database/db';
import commonErrorHandlers from '../../../../../middleware/commonErrorHandlers';
import requireApiSession from '../../../../../middleware/requireApiSession';
import requirePlayer from '../../../../../middleware/requirePlayer';
import { ApiError } from '../../../../../types/common-api';



const router = createRouter<NextApiRequest, any>();

export default router
    .get(async (req, res: NextApiResponse<WheelItem[] | ApiError | null>) => {
        try {
            const wheelitems = await WheelItem.findAll({
                where: {
                    wheelId: req.query.wheelId
                },
                order: [['position', 'ASC']]
            })
            if (wheelitems)
                res.json(wheelitems)
            else
                res.status(404).json({ error: 'А где', status: 404 })
        } catch (error: any) {
            res.status(500).json({ error: error.message, status: 500 })
        }
    })
    .use(requireApiSession)
    .use(requirePlayer)
    .post(async (req, res: NextApiResponse<WheelItem | ApiError | null>) => {
        try {
            const wheel = await Wheel.findOne({
                where: {
                    id: req.query.wheelId,
                }
            })
            if (!wheel)
                return res.status(404).json({ error: 'А где', status: 404 })
            const items = await WheelItem.findAll({
                where: {
                    wheelId: wheel.id
                }
            })
            const wheelItem = await WheelItem.create({
                addedById: req.session.user.id,
                ownedById: req.session.user.id,
                position: items.length,
                wheelId: wheel.id
            })
            wheel.size++
            wheel.save()
            res.json(wheelItem)
        } catch (error: any) {
            res.status(500).json({ error: error.message, status: 500 })
        }
    })
    .handler(commonErrorHandlers)