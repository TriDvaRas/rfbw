import type { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import { Game, GameWheel, Wheel, GamePlayer, WheelItem, GameEffect, Effect, Player, GameEffectStateWithEffectWithPlayer, GameEvent } from '../../../../database/db';
import commonErrorHandlers from '../../../../middleware/commonErrorHandlers';
import { ApiError } from '../../../../types/common-api';
import { GameStats } from '../../../../types/stats';
import { Op } from 'sequelize'
import requireApiSession from '../../../../middleware/requireApiSession';
import requirePlayer from '../../../../middleware/requirePlayer';
import _ from 'lodash';
import { GameRollDiceResult } from '../../../../types/game';
import { effectsConfig } from '../../../../config';


const router = createRouter<NextApiRequest, NextApiResponse<GameRollDiceResult | ApiError | null>>();

export default router
    .use(requireApiSession)
    .use(requirePlayer)
    .post(async (req, res) => {
        const user = req.session.user
        const player = await Player.findOne({ where: { id: user.id } }) as Player
        const effectState = await GameEffectStateWithEffectWithPlayer<any>.findOne({
            where: {
                gameId: req.query.gameId,
                effectId: `91c8d041-6db9-4c8a-a33a-f9c6cdc56bc0`,
                playerId: player.id,
                isEnded: false,
            },
            include: [Effect, Player]
        })
        if (!effectState)
            return res.status(404).json({ error: `У тебя нету эффекта Рулетка`, status: 404 })
        if (!_.isEqual(
            { id: effectState.id, variables: effectState.vars },
            { id: req.body.effectState.id, variables: req.body.effectState.vars }
        ))
            return res.status(400).json({ error: `Твое содержимое вопроса не совпадает с сервером. Обнови страницу и попробуй еще раз.`, status: 400 })
        try {
            if (effectState.vars?.result)
                return res.status(400).json({ error: `Ты уже кидал куб. Иди нахуй`, status: 400 })
            if (req.body.reject) {
                effectState.vars = {
                    ...(effectState.vars || {}),
                    message: `Ссыкло...`,
                    rejected: true
                }
                await effectState.save()
                await GameEvent.create({
                    gameId: req.query.gameId,
                    playerId: player.id,
                    effectId: effectState.effect.id,
                    imageId: effectState.effect.imageId,
                    type: 'rollDiceSkip',
                })
                res.send({
                    message: `Ссыкло...`,
                })
            } else {
                const result = Math.ceil(Math.random() * 6)
                effectState.vars = {
                    ...(effectState.vars || {}),
                    guess: req.body.selectedCubes,
                    result,
                    message: req.body.selectedCubes.includes(result) ? `Повезло` : `Не повезло`
                }
                const gamePlayer = await GamePlayer.findOne({
                    where: {
                        gameId: req.query.gameId,
                        playerId: player.id,
                    }
                }) as GamePlayer
                if (req.body.selectedCubes.includes(result))
                    gamePlayer.points += effectsConfig.diceWin / req.body.selectedCubes.length
                else
                    gamePlayer.points -= effectsConfig.diceLoss
                effectState.save()
                gamePlayer.save()
                await GameEvent.create({
                    gameId: req.query.gameId,
                    playerId: player.id,
                    effectId: effectState.effect.id,
                    imageId: effectState.effect.imageId,
                    type: req.body.selectedCubes.includes(result) ? 'rollDiceSuccess' : 'rollDiceFail',
                    pointsDelta: req.body.selectedCubes.includes(result) ? effectsConfig.diceWin / req.body.selectedCubes.length : -effectsConfig.diceLoss,
                    vars: {
                        guess: req.body.selectedCubes,
                        result: result
                    }
                })
                res.send({
                    message: req.body.selectedCubes.includes(result) ? `Повезло` : `Не повезло`,
                    result
                })
                res.socket.server.io?.emit('mutate', [
                    `^/api/games/${req.query.gameId}/events`,
                    `^/api/games/${req.query.gameId}/players`,
                    `^/api/players/${gamePlayer.playerId}`,
                ])
            }
        } catch (error: any) {
            console.error(error);

            return res.status(400).send(error.message)
        }

    })
    .handler(commonErrorHandlers)