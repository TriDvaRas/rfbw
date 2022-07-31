import type { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import { GameEffectState, GameEffectStateWithEffectWithPlayer, Effect, Player } from '../../../../../../../database/db';
import commonErrorHandlers from '../../../../../../../middleware/commonErrorHandlers';
import { ApiError } from '../../../../../../../types/common-api';



const router = createRouter<NextApiRequest, NextApiResponse>();

export default router
    .get(async (req, res: NextApiResponse<GameEffectStateWithEffectWithPlayer[] | ApiError | null>) => {
        try {
            const effects = await GameEffectStateWithEffectWithPlayer<any>.findAll({
                where: {
                    gameId: req.query.gameId,
                    playerId: req.query.playerId,
                    isEnded: false,
                },
                include: [Effect, Player]
            })
            res.json(effects)
        } catch (error: any) {
            res.status(500).json({ error: error.message, status: 500 })
        }
    })
    .handler(commonErrorHandlers)