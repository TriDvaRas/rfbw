import type { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import { GameWheelWithWheel, Wheel } from '../../../../database/db';
import adminOnly from '../../../../middleware/adminOnly';
import commonErrorHandlers from '../../../../middleware/commonErrorHandlers';
import requireApiSession from '../../../../middleware/requireApiSession';
import { ApiError } from '../../../../types/common-api';



const router = createRouter<NextApiRequest, NextApiResponse>();

export default router
    .get(async (req, res: NextApiResponse<GameWheelWithWheel[] | ApiError | null>) => {
        try {
            const gameWheels = await GameWheelWithWheel.findAll({
                where: {
                    gameId: req.query.gameId
                },
                include: Wheel
            })
            if (gameWheels)
                res.json(gameWheels)
            else
                res.status(404).json({ error: 'А где', status: 404 })
        } catch (error: any) {
            res.status(500).json({ error: error.message, status: 500 })
        }
    })
    .use(requireApiSession)
    .use(adminOnly)
    .post(async (req, res: NextApiResponse<GameWheelWithWheel | ApiError | null>) => {
        try {
            const body: {
                gameId: string
                wheelId: string
            } = req.body
            const gameWheel = await GameWheelWithWheel.create({
                gameId: body.gameId,
                wheelId: body.wheelId,
                addedById: req.session.user.id
            }, { include: Wheel })
            res.json(gameWheel)
        } catch (error: any) {
            res.status(500).json({ error: error.message, status: 500 })
        }
    })
    .handler(commonErrorHandlers)