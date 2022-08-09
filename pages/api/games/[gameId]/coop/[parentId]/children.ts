import { includes } from 'lodash';
import type { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth/next'
import { createRouter } from 'next-connect'
import { GameTaskWithWheelItem, WheelItem } from '../../../../../../database/db';
import commonErrorHandlers from '../../../../../../middleware/commonErrorHandlers';
import { ApiError } from '../../../../../../types/common-api';




const router = createRouter<NextApiRequest, NextApiResponse>();

export default router
    .get(async (req, res: NextApiResponse<GameTaskWithWheelItem[] | ApiError | null>) => {
        try {
            const tasks = await GameTaskWithWheelItem.findAll({
                where: {
                    gameId: req.query.gameId,
                    coopParentId: req.query.parentId
                },
                include: WheelItem
            })
            res.json(tasks)
        } catch (error: any) {
            res.status(500).json({ error: error.message, status: 500 })
        }
    })
    .handler(commonErrorHandlers)