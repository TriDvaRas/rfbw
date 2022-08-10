import type { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth/next'
import { createRouter } from 'next-connect'
import { Game, Wheel, Player, WheelItem, GameTask, GameEvent, Effect, GameEffect, GameEffectWithEffect, GameEffectState, GameEffectStateWithEffectWithPlayer } from '../../../../../database/db';
import commonErrorHandlers from '../../../../../middleware/commonErrorHandlers'
import requireApiSession from '../../../../../middleware/requireApiSession'
import requirePlayer from '../../../../../middleware/requirePlayer'
import { ApiError } from '../../../../../types/common-api'
import { authOptions } from "../../../auth/[...nextauth]"
import { Op } from 'sequelize';
import { GameSpinResult, GameSpinEffectResult } from '../../../../../types/game';
import _, { includes, result } from 'lodash';
import { effectsConfig } from '../../../../../config';
import afterSpecialEffectsMap from '../../../../../util/game/afterSpecialEffectsMap';



const router = createRouter<NextApiRequest, NextApiResponse<GameSpinEffectResult | ApiError | null>>();

export default router
    .use(requireApiSession)
    .use(requirePlayer)
    .post(async (req, res) => {
        const body: {
            activeWheelItemIds: string[]
        } = req.body
        try {
            const user = req.session.user
            const player = await Player.findOne({ where: { id: user.id } }) as Player

            const game = await Game.findOne({ where: { id: req.query.gameId } })
            if (!game) return res.status(400).json({ error: `Invalid gameId`, status: 400 })

            const playerActiveTask = await GameTask.findOne({
                where: {
                    gameId: req.query.gameId,
                    playerId: player.id,
                    result: null
                },
                order: [['fromCoop', 'DESC']]
            })
            if (playerActiveTask) return res.status(400).json({ error: `Что ты тут забыл? Ты еще прошлый контент не закончил`, status: 400 })
            const playerEffectStates = await GameEffectState.findAll({
                where: {
                    gameId: game.id,
                    playerId: player.id,
                    isEnded: false
                },
                include: [Effect, Player]
            }) as GameEffectStateWithEffectWithPlayer[]
            const effect35 = playerEffectStates.find(x => x.effect.lid == 35)
            if (!effect35)
                return res.status(400).json({ error: `Я тебе запрещаю это крутить`, status: 400 })

            const dEffects = await Effect.findAll({
                where: {
                    isDefault: true,
                }
            })
            const effectsWheelItems = await GameEffect.findAll({
                where: {
                    gameId: req.query.gameId,
                    isEnabled: true,
                    effectId: {
                        [Op.notIn]: dEffects.map(x => x.id)
                    }
                },
                include: Effect
            }) as GameEffectWithEffect[]
            if (!_.isEqual(effectsWheelItems.map(x => x.id).sort(), body.activeWheelItemIds.sort()))
                return res.status(400).json({ error: `Твое содержимое колеса не совпадает с сервером. Обнови страницу и попробуй еще раз.`, status: 400 })
            const activeItems = effectsWheelItems.filter(x => x.cooldown == 0)
            if (activeItems.length === 0)
                return res.status(400).json({ error: `Колесо пустое... А какого хуя собственно?)`, status: 400 })
            let cheat: number | undefined
            //!! --------------------------------------------
            cheat = 59
            //!! --------------------------------------------
            const resultItem = cheat && activeItems.find(x => x.effect.lid === cheat) || activeItems[Math.floor(activeItems.length * Math.random())] as GameEffectWithEffect
            const extraSpin = (Math.sqrt(Math.random()) - 0.5) * .99
            effect35.isEnded = true
            effect35.save()
            res.json({
                extraSpin,
                resultItemId: resultItem.id,
                playerId: user.id,
                gameId: req.query.gameIds as string,
            })
            const event = GameEvent.build({
                gameId: game.id,
                playerId: player.id,
                imageId: resultItem.effect.imageId,
                effectId: resultItem.effect.id,
                type: 'effectGained',
                pointsDelta: resultItem.effect.lid == 17 ? 15 : resultItem.effect.lid == 18 ? -15 : null,
            })
            // for (const lid of effectsConfig.afterSpinClears) {
            //     const st = await GameEffectStateWithEffectWithPlayer.findOne({
            //         where: {
            //             playerId: player.id,
            //             isEnded: false,
            //         },
            //         include: [{
            //             model: Effect,
            //             required: true,
            //             where: { lid }
            //         }, Player]
            //     })
            //     if (st) {
            //         st.isEnded = true
            //         st.save()
            //     }
            // }
            setTimeout(async () => {
                //TODO shuffle
                const fn = afterSpecialEffectsMap.get(resultItem.effect.lid)
                if (fn) {
                    const newEffect = await fn(game.id, player.id)
                }
                await event.save()
            }, (effectsConfig.spinDur) * 1000 - 200)
        } catch (error: any) {
            res.status(500).json({ error: error.message, status: 500 })
        }
    })
    .handler(commonErrorHandlers)