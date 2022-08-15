import type { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth/next'
import { createRouter } from 'next-connect'
import { Game, Wheel, Player, WheelItem, GameTask, GameEvent, Effect, GameEffectState, GameEffectStateWithEffectWithPlayer } from '../../../../database/db';
import commonErrorHandlers from '../../../../middleware/commonErrorHandlers'
import requireApiSession from '../../../../middleware/requireApiSession'
import requirePlayer from '../../../../middleware/requirePlayer'
import { ApiError } from '../../../../types/common-api'
import { authOptions } from "../../auth/[...nextauth]"
import { Op } from 'sequelize';
import { GameSpinResult } from '../../../../types/game';
import _, { result } from 'lodash';
import { filterWheelsWithEffects } from '../../../../util/game/wheelFilters';
import { effectsConfig } from '../../../../config';
import { filterWheelItemsWithEffects } from '../../../../util/game/wheelItemFilters';
import { schedule } from 'node-cron';
import requireActiveGame from '../../../../middleware/requireActiveGame';



const router = createRouter<NextApiRequest, NextApiResponse<GameSpinResult | ApiError | null>>();

export default router
    .use(requireApiSession)
    .use(requirePlayer)
    .use(requireActiveGame)
    .post(async (req, res) => {
        const body: {
            wheelId: string
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
            const states = await GameEffectStateWithEffectWithPlayer<any>.findAll({
                where: {
                    gameId: game.id,
                    playerId: player.id,
                    isEnded: false
                },
                include: [{
                    model: Effect,
                }, Player]
            })
            const effect35 = states.find(x => x.effect.lid === 35)
            if (effect35)
                return res.status(400).json({ error: `Я тебе запрещаю это крутить`, status: 400 })
            const effect48 = states.find(x => x.effect.lid === 48)
            if (effect48)
                return res.status(400).json({ error: `Сегодня ты трогаешь траву. Возвращайся завтра`, status: 400 })
            const effect98 = states.find(x => x.effect.lid === 98)
            if (effect98)
                return res.status(400).json({ error: `Ты уже крутишь колесо. Команда разработки RFBW (1 нечеловек) не несет ответственности за то что вы обновили страницу или попытались заабузить или что то залагало (что маловероятно(невозможно))`, status: 400 })

            const wheel = await Wheel.findOne({ where: { id: body.wheelId } })
            if (!wheel) return res.status(400).json({ error: `Invalid wheelId`, status: 400 })
            if (wheel.ownedById === req.session.user.id)
                return res.status(400).json({ error: `Ты не можешь крутить свое колесо. Команда разработки RFBW (1 нечеловек) не несет ответственности за то что вы обновили страницу или попытались заабузить или что то залагало (что маловероятно(невозможно))`, status: 400 })
            const allowedWheels = filterWheelsWithEffects([wheel], states)
            if (allowedWheels.length !== 1)
                return res.status(400).json({ error: `Я тебе запрещаю это крутить (читай правила)`, status: 400 })

            const wheelItems = await WheelItem.findAll({ where: { wheelId: wheel.id }, })
            const playerGameTasks = await GameTask.findAll({ where: { gameId: game.id, playerId: player.id } })
            const activeItems = filterWheelItemsWithEffects(wheelItems, states).filter(x => !playerGameTasks.find(y => y.wheelItemId === x.id))
            if (activeItems.length == 0) return res.status(400).json({ error: `Empty wheel`, status: 400 })

            if (!_.isEqual(activeItems.map(x => x.id).sort(), body.activeWheelItemIds.sort()))
                return res.status(400).json({ error: `Твое содержимое колеса не совпадает с сервером. Обнови страницу и попробуй еще раз.`, status: 400 })
            const resultItem = activeItems[Math.floor(activeItems.length * Math.random())] as WheelItem
            const extraSpin = (Math.sqrt(Math.random()) - 0.5) * .99
            const task = GameTask.build({
                gameId: game.id,
                wheelItemId: resultItem.id,
                playerId: player.id,
                fromCoop: false,
            })
            const spinnerEffect = await GameEffectStateWithEffectWithPlayer.create({
                gameId: req.query.gameId,
                effectId: `3f75c166-f092-4d82-9fa0-0bfa0034b3a8`,//98
                playerId: player.id,
            })
            res.json({
                extraSpin,
                resultItemId: resultItem.id,

                playerId: user.id,
                gameId: req.query.gameIds as string,
                wheelId: wheel.id,
            })
            const event = GameEvent.build({
                gameId: game.id,
                playerId: player.id,
                imageId: resultItem.imageId,
                taskId: task.id,
                type: 'contentRoll',
            })
            setTimeout(async () => {
                for (const lid of effectsConfig.afterSpinClears) {
                    const st = await GameEffectStateWithEffectWithPlayer.findOne({
                        where: {
                            playerId: player.id,
                            isEnded: false,
                        },
                        include: [{
                            model: Effect,
                            required: true,
                            where: { lid }
                        }, Player]
                    })
                    if (st) {
                        st.isEnded = true
                        await st.save()
                    }
                }
                spinnerEffect.isEnded = true
                await spinnerEffect.save()
                await task.save()
                await event.save()
                if (wheel.id === '5a698d76-5676-4f2e-934e-c98791ad58ca') {
                    await GameEffectState.create({
                        gameId: game.id,
                        playerId: player.id,
                        effectId: '98642bc6-9262-4454-9b78-e4c06f207b30', // (61) 
                    })
                }

            }, (wheel.prespinDuration) * 1000 + (wheel.spinDuration) * 1000)
        } catch (error: any) {
            res.status(500).json({ error: error.message, status: 500 })
        }
    })
    .handler(commonErrorHandlers)