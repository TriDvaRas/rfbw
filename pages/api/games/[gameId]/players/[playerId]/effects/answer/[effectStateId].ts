import _ from 'lodash';
import type { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import { GameEffectState, GameEffectStateWithEffectWithPlayer, Effect, Player } from '../../../../../../../../database/db';
import commonErrorHandlers from '../../../../../../../../middleware/commonErrorHandlers';
import requireApiSession from '../../../../../../../../middleware/requireApiSession';
import requirePlayer from '../../../../../../../../middleware/requirePlayer';
import { ApiError } from '../../../../../../../../types/common-api';
import { EffectStateQuestionVars } from '../../../../../../../../types/effectStateVars';
import questionAnswerMap from '../../../../../../../../util/game/questionAnswerMap';



const router = createRouter<NextApiRequest, NextApiResponse>();
export type GameQuestionAnswerBody = {
    effectState: GameEffectStateWithEffectWithPlayer<EffectStateQuestionVars>;
    selectedPlayerId?: string;
    selectedEffectId?: string;
    selectedTypeId?: string;
    selectedScoreId?: string;
    selectedWheelId?: string;
    selectedWheelItemId?: string;
};
export default router
    .use(requireApiSession)
    .use(requirePlayer)
    .post(async (req, res: NextApiResponse<GameEffectStateWithEffectWithPlayer | ApiError | null>) => {
        try {


            const body: GameQuestionAnswerBody = req.body
            const effectState = await GameEffectStateWithEffectWithPlayer<EffectStateQuestionVars>.findOne({
                where: {
                    gameId: req.query.gameId,
                    playerId: req.query.playerId,
                    id: req.query.effectStateId,
                },
                include: [Effect, Player]
            })
            if (!effectState)
                return res.status(400).json({ error: `Где ты нашел этот вопрос? Его нет... Обнови страницу...`, status: 400 })
            if (req.session.user.id !== effectState.player.id)
                return res.status(403).json({ error: `Это не твой вопрос. Как ты на него ответил?`, status: 403 })
            if (_.isEqual(
                { id: effectState.id, vars: effectState.vars },
                { id: body.effectState.id, vars: body.effectState.vars }
            )) {
                const fn = questionAnswerMap.get(effectState.effect.lid)
                if (fn) {
                    try {
                        await fn(effectState, req.body)

                        effectState.isEnded = true
                        await effectState.save()
                        res.json(effectState)

                    } catch (error: any) {
                        console.error(error);

                        return res.status(500).json({ error: error.message, status: 500 })
                    }

                }
                else
                    return res.status(400).json({ error: `Вопрос не поддерживается (пиздец)`, status: 400 })

            }

            else {
                return res.status(400).json({ error: `Твое содержимое вопроса не совпадает с сервером. Обнови страницу и попробуй еще раз.`, status: 400 })
            }
        } catch (error: any) {
            res.status(500).json({ error: error.message, status: 500 })
        }
    })
    .handler(commonErrorHandlers)