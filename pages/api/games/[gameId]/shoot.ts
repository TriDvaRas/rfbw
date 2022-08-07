import type { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import { Game, GameWheel, Wheel, GamePlayer, WheelItem, GameEffect, Effect, Player, GameEffectStateWithEffectWithPlayer, GameEvent, GameEffectState } from '../../../../database/db';
import commonErrorHandlers from '../../../../middleware/commonErrorHandlers';
import { ApiError } from '../../../../types/common-api';
import { GameStats } from '../../../../types/stats';
import { Op } from 'sequelize'
import requireApiSession from '../../../../middleware/requireApiSession';
import requirePlayer from '../../../../middleware/requirePlayer';
import _, { includes } from 'lodash';
import { GameRollDiceResult, GameShootResult } from '../../../../types/game';
import { effectsConfig } from '../../../../config';


const router = createRouter<NextApiRequest, NextApiResponse<GameShootResult | ApiError | null>>();

export default router
    .use(requireApiSession)
    .use(requirePlayer)
    .post(async (req, res) => {
        const user = req.session.user
        const player = await Player.findOne({ where: { id: user.id } }) as Player
        const effectState = await GameEffectStateWithEffectWithPlayer<any>.findOne({
            where: {
                gameId: req.query.gameId,
                effectId: `92c25276-8fd4-4888-999e-e8c0e958f21f`,
                playerId: player.id,
                isEnded: false,
            },
            include: [Effect, Player]
        })

        console.log(1);

        if (!effectState)
            return res.status(404).json({ error: `У тебя нету эффекта Револьверчик`, status: 404 })
        console.log(2);
        if (!_.isEqual(
            { id: effectState.id, variables: effectState.vars },
            { id: req.body.effectState.id, variables: req.body.effectState.vars }
        ))
            return res.status(400).json({ error: `Твое содержимое вопроса не совпадает с сервером. Обнови страницу и попробуй еще раз.`, status: 400 })
        console.log(3);
        try {
            if (effectState.vars?.result)
                return res.status(400).json({ error: `Ты уже выстрелил. Иди нахуй`, status: 400 })
            console.log(4);
            if (req.body.reject) {
                console.log(5);
                effectState.vars = {
                    ...(effectState.vars || {}),
                    message: `Ссыкло...`,
                    rejected: true
                }
                await effectState.save()
                console.log(6);
                res.send({
                    message: `Ссыкло...`,
                })
            } else {
                console.log(7);
                const result = Math.ceil(Math.random() * 6)
                effectState.vars = {
                    ...(effectState.vars || {}),
                    result,
                    message: result !== 6 ? `Повезло повезло` : `Ты сдох...`
                }
                console.log(8);
                const gamePlayer = await GamePlayer.findOne({
                    where: {
                        gameId: req.query.gameId,
                        playerId: player.id,
                    }
                }) as GamePlayer
                console.log(9);
                if (result !== 6)
                    gamePlayer.points += 30
                else
                    await GameEffectStateWithEffectWithPlayer.create({
                        gameId: req.query.gameId,
                        effectId: `385f9834-6205-4f38-a2bc-28f142a9b2b1`,//48
                        playerId: player.id,
                    })
                effectState.save()
                gamePlayer.save()
                console.log(10);
                console.log(player);
                console.log(effectState);

                const event = GameEvent.create({
                    gameId: req.query.gameId,
                    playerId: player.id,
                    effectId: effectState.effect.id,
                    imageId: effectState.effect.imageId,
                    type: result !== 6 ? 'shootSuccess' : 'shootDeath',
                })
                res.send({
                    message: result !== 6 ? `Повезло повезло` : `Ты сдох...`,
                    result
                })
                console.log(11);
            }
        } catch (error: any) {
            console.error(error);

            return res.status(400).send(error.message)
        }

    })
    .handler(commonErrorHandlers)