import { Op } from 'sequelize';
import { Effect, GameEffectStateWithEffectWithPlayer, GameEffectWithEffect, GamePlayer, Player, GameEffectState, WheelItem, GameTaskWithWheelItem, GameWheel, GameWheelWithWheel, Wheel } from '../../database/db';
import { EffectStateQuestionVars } from '../../types/effectStateVars';

const afterSpecialEffectsMap = new Map<number, (gameId: string, playerId: string) => Promise<GameEffectStateWithEffectWithPlayer | undefined>>()
// //!1
afterSpecialEffectsMap.set(1, async (gameId, playerId) => {
    const effect = await GameEffectStateWithEffectWithPlayer<EffectStateQuestionVars>.create({
        playerId,
        gameId,
        effectId: '572f34fa-ce8f-4b79-86ca-b09fb6cae034',//36
        vars: {
            question: 'Выберите игрока и негативный эффект который хотите на него наложить',
            players: (await GamePlayer.findAll({
                where: {
                    gameId,
                    playerId: { [Op.ne]: playerId }
                },
                include: Player
            })),
            effects: await GameEffectWithEffect.findAll({
                where: {
                    gameId,
                    isEnabled: true,
                },
                include: {
                    model: Effect,
                    required: true,
                    where: {
                        type: 'negative',
                        isDefault: false
                    }
                }
            })

        } as EffectStateQuestionVars
    }, { include: [Effect, Player] })
    return effect as GameEffectStateWithEffectWithPlayer<EffectStateQuestionVars>
})
// //!2
afterSpecialEffectsMap.set(2, async (gameId, playerId) => {
    const effect = await GameEffectStateWithEffectWithPlayer<EffectStateQuestionVars>.create({
        playerId,
        gameId,
        effectId: '0f17a70c-0177-4162-b827-009ad9ae2034',//37
        vars: {
            question: 'Выберите игрока и положительный эффект который хотите на него наложить',
            players: (await GamePlayer.findAll({
                where: {
                    gameId,
                    playerId: { [Op.ne]: playerId }
                },
                include: Player
            })),
            effects: await GameEffectWithEffect.findAll({
                where: {
                    gameId,
                    isEnabled: true,
                },
                include: {
                    model: Effect,
                    required: true,
                    where: {
                        type: 'positive',
                        isDefault: false
                    }
                }
            })
        } as EffectStateQuestionVars
    }, { include: [Effect, Player] })
    return effect as GameEffectStateWithEffectWithPlayer<EffectStateQuestionVars>
})
// //!3
afterSpecialEffectsMap.set(3, async (gameId, playerId) => {
    const lastTask = await GameTaskWithWheelItem.findOne({
        where: {
            gameId,
            playerId: playerId,
            fromCoop: false
        },
        order: [['createdAt', 'DESC']],
        include: WheelItem
    })

    if (lastTask) {
        return await GameEffectStateWithEffectWithPlayer<any>.create({
            playerId,
            gameId,
            effectId: 'efd1f7ba-df8a-4617-ab70-c63a39a6b077',//3
            vars: {
                wheelId: lastTask.wheelitem.wheelId,
            }
        }, { include: [Effect, Player] })
    }
})
// //!4
// afterSpecialEffectsMap.set(4, async (gameId, playerId) => {
//     const effect = await db.newEffectState(playerId, 38, {
//         question: `Поставь оценку только что завершенному контенту`,
//         scores: [
//             { id: 1, title: `1` },
//             { id: 2, title: `2` },
//             { id: 3, title: `3` },
//             { id: 4, title: `4` },
//             { id: 5, title: `5` },
//             { id: 6, title: `6` },
//             { id: 7, title: `7` },
//             { id: 8, title: `8` },
//             { id: 9, title: `9` },
//             { id: 10, title: `10` },
//         ]
//     })
//     return effect
// })
// //!5
afterSpecialEffectsMap.set(5, async (gameId, playerId) => {
    return await GameEffectStateWithEffectWithPlayer<any>.create({
        playerId,
        gameId,
        effectId: '7da49e4b-7430-420c-bfb2-557437e17904',//5
    }, { include: [Effect, Player] })
})
// //!6
afterSpecialEffectsMap.set(6, async (gameId, playerId) => {
    return await GameEffectStateWithEffectWithPlayer<any>.create({
        playerId,
        gameId,
        effectId: '5a61a31c-088a-4a07-a4b4-f7039d9be23c',//6
    }, { include: [Effect, Player] })
})
// //!7
afterSpecialEffectsMap.set(7, async (gameId, playerId) => {
    return await GameEffectStateWithEffectWithPlayer<any>.create({
        playerId,
        gameId,
        effectId: 'bc3186d6-0d24-41e0-a81c-934cc765feba',//7
    }, { include: [Effect, Player] })
})
// //!8
// afterSpecialEffectsMap.set(8, async (gameId, playerId) => {
//     const playerEffects = await db.getPlayerEffects(playerId)
//     if (playerEffects.find(x => x.effect.id === 9)) {
//         await db.endEffectState(playerId, 9)
//         broadcastEvent(`effect:end`, {
//             idPlayer: playerId,
//             effectId: 9
//         })
//         broadcastEvent(`post:new`, {
//             post: await db.newPost('effectcustom', {
//                 pattern: `{player} теряет эффекты {effect} и {effect1} по причине {reason}`,
//                 variables: {
//                     playerId,
//                     effectId: 9,
//                     effectId1: 8,
//                     reason: `Леха укусил Крысу`
//                 },
//             } as IPostCustom['variables'])
//         })
//     }
//     else
//         return await db.newEffectState(playerId, 8)
// })
// //!9
// afterSpecialEffectsMap.set(9, async (gameId, playerId) => {
//     const playerEffects = await db.getPlayerEffects(playerId)
//     if (playerEffects.find(x => x.effect.id === 8)) {
//         await db.endEffectState(playerId, 9)
//         broadcastEvent(`effect:end`, {
//             idPlayer: playerId,
//             effectId: 8
//         })
//         broadcastEvent(`post:new`, {
//             post: await db.newPost('effectcustom', {
//                 pattern: `{player} теряет эффекты {effect} и {effect1} по причине {reason}`,
//                 variables: {
//                     playerId,
//                     effectId: 8,
//                     effectId1: 9,
//                     reason: `Крыса укусила Ляху`
//                 },
//             } as IPostCustom['variables'])
//         })
//     }
//     else
//         return await db.newEffectState(playerId, 9)
// })
// //!10
afterSpecialEffectsMap.set(10, async (gameId, playerId) => {
    const otherPlayers = await GamePlayer.findAll({
        where: {
            gameId,
            playerId: { [Op.ne]: playerId }
        },
        include: Player
    })
    const player = otherPlayers[Math.floor(Math.random() * otherPlayers.length)]
    const wheels = await GameWheelWithWheel.findAll({
        where: {
            gameId,
        },
        include: [{
            model: Wheel,
            required: true,
            where: { ownedById: { [Op.ne]: player.playerId } }
        }]
    })
    return await GameEffectStateWithEffectWithPlayer<EffectStateQuestionVars>.create({
        playerId,
        gameId,
        effectId: '8b27c779-d364-493c-a01a-529ecdbee017',//40
        vars: {
            question: 'Выбери какое колесо в следующий раз будет крутить %PLAYERNAME%',
            gamePlayer: player,
            wheels
        } as EffectStateQuestionVars
    }, { include: [Effect, Player] })
})
// //!11
afterSpecialEffectsMap.set(11, async (gameId, playerId) => {
    return await GameEffectStateWithEffectWithPlayer<any>.create({
        gameId, playerId,
        effectId: '7c44ff0a-517c-49c2-be93-afb97b559a52', // (35) allow effect wheel spin
    })
})
// //!12
afterSpecialEffectsMap.set(12, async (gameId, playerId) => {
    return undefined
})
// //!13
afterSpecialEffectsMap.set(13, async (gameId, playerId) => {
    return await GameEffectStateWithEffectWithPlayer<EffectStateQuestionVars>.create({
        playerId,
        gameId,
        effectId: '35d6674a-1117-4bdb-a763-7ee152a61632',//41
        vars: {
            question: `Выбери кто будет крутить твое колесо в следующем ролле`,
            players: await GamePlayer.findAll({
                where: {
                    gameId,
                    playerId: { [Op.ne]: playerId }
                },
                include: Player
            }),
        } as EffectStateQuestionVars
    }, { include: [Effect, Player] })
})
// //!14
afterSpecialEffectsMap.set(14, async (gameId, playerId) => {
    const wheels: GameWheelWithWheel[] = await GameWheelWithWheel.findAll({
        where: {
            gameId,
        },
        include: [{
            model: Wheel,
            required: true,
            where: { ownedById: { [Op.ne]: playerId } }
        }]
    })
    const selectedWheel = wheels[Math.floor(Math.random() * wheels.length)]

    return await GameEffectStateWithEffectWithPlayer<any>.create({
        playerId,
        gameId,
        effectId: '203e0f75-7766-4aae-9693-a38bf58ac5a3',//32
        vars: { wheelId: selectedWheel.wheelId }
    }, { include: [Effect, Player] })
})
// //!15
// afterSpecialEffectsMap.set(15, async (gameId, playerId) => {
//     const secretState = await db.newSecretState(playerId, 15)
//     broadcastEvent('secret:new', {
//         idPlayer: playerId,
//         secret: secretState
//     })
//     return await db.newEffectState(playerId, 47, { secretStateId: secretState.id })
// })
// //!16
// afterSpecialEffectsMap.set(16, async (gameId, playerId) => {
//     const secretState = await db.newSecretState(playerId, 16)
//     broadcastEvent('secret:new', {
//         idPlayer: playerId,
//         secret: secretState
//     })
//     return await db.newEffectState(playerId, 47, { secretStateId: secretState.id })
// })
// //!17
afterSpecialEffectsMap.set(17, async (gameId, playerId) => {
    const targetPlayer = await GamePlayer.findOne({
        where: { gameId, playerId }
    })
    if (!targetPlayer)
        throw new Error(`Игрок не найден? Схуяли?`)
    targetPlayer.points += 15
    await targetPlayer.save()
    return undefined
})
// //!18
afterSpecialEffectsMap.set(18, async (gameId, playerId) => {
    const targetPlayer = await GamePlayer.findOne({
        where: { gameId, playerId }
    })
    if (!targetPlayer)
        throw new Error(`Игрок не найден? Схуяли?`)
    targetPlayer.points -= 15
    await targetPlayer.save()
    return undefined
})
// //!19
afterSpecialEffectsMap.set(19, async (gameId, playerId) => {
    return await GameEffectStateWithEffectWithPlayer<any>.create({
        playerId,
        gameId,
        effectId: 'c14bf560-b1b8-4172-8827-538dd0c75605',//19
    }, { include: [Effect, Player] })
})
// //!20
// afterSpecialEffectsMap.set(20, async (gameId, playerId) => {
//     const effect = await db.newEffectState(playerId, 47)
//     const secretState = await db.newSecretState(playerId, 20, { turnsLeft: 3, startEffectId: effect.id })
//     broadcastEvent('secret:new', {
//         idPlayer: playerId,
//         secret: secretState
//     })
//     return effect
// })
// //!21
afterSpecialEffectsMap.set(21, async (gameId, playerId) => {
    return await GameEffectStateWithEffectWithPlayer<any>.create({
        playerId,
        gameId,
        effectId: '91c8d041-6db9-4c8a-a33a-f9c6cdc56bc0', //42
        vars: {
            question: `Выбери 1-3 чисел, если не зассал`,
            is21: true,
        }
    }, { include: [Effect, Player] })
})
// //!22
afterSpecialEffectsMap.set(22, async (gameId, playerId) => {
    return await GameEffectStateWithEffectWithPlayer<any>.create({
        playerId,
        gameId,
        effectId: '92c25276-8fd4-4888-999e-e8c0e958f21f', //43
        vars: {
            question: `СТРЕЛЯЕМ??`,
            is21: true,
        }
    }, { include: [Effect, Player] })
})
// //!23
// afterSpecialEffectsMap.set(23, async (gameId, playerId) => {
//     const players = (await db.getPlayers()).filter(x => x.id != playerId)
//     const player = players[Math.floor(Math.random() * players.length)]
//     const effect = await db.newEffectState(playerId, 44, {
//         question: `Тебе необходимо стать каблуком игрока %PLAYERNAME%... Каблук должен играть на его колесе или может откупиться за 20 очков`,
//         player,
//         types: [{ id: 2, title: 'Буду играть на его колесе' }, { id: 1, title: 'Отдам ему 20 очков' }, { id: 3, title: 'Отсосу', meme: true }]
//     })
//     return effect
// })
// //!24
// afterSpecialEffectsMap.set(24, async (gameId, playerId) => {
//     const cardState = await db.newCardState(playerId, 24)
//     broadcastEvent('card:new', {
//         idPlayer: playerId,
//         card: cardState
//     })
//     return undefined
// })
// //!25
// afterSpecialEffectsMap.set(25, async (gameId, playerId) => {
//     const cardState = await db.newCardState(playerId, 25)
//     broadcastEvent('card:new', {
//         idPlayer: playerId,
//         card: cardState
//     })
//     return undefined
// })
// //!26
// afterSpecialEffectsMap.set(26, async (gameId, playerId) => {
//     const cards = await db.getPlayerCards(playerId)
//     let card
//     if (cards.length > 0) {
//         card = cards[_.random(0, cards.length - 1)]
//         await db.endCardId(card.id)
//         broadcastEvent(`post:new`, {
//             post: await db.newPost('effectcustom', {
//                 pattern: `{target} теряет карточку {effect} по причине {effect1}`,
//                 variables: {
//                     targetId: playerId,
//                     effectId: card.effect.id,
//                     effectId1: 26,
//                 },
//             } as IPostCustom['variables'])
//         })
//         broadcastEvent('card:end', {
//             idPlayer: playerId,
//             cardStateId: card.id
//         })
//     }
//     else
//         broadcastEvent(`post:new`, {
//             post: await db.newPost('effectcustom', {
//                 pattern: `{target} не теряет карточку по причине {reason}`,
//                 variables: {
//                     targetId: playerId,
//                     reason: `нету карточек`,
//                 },
//             } as IPostCustom['variables'])
//         })
//     return undefined
// })
// //!27
// //!28
// afterSpecialEffectsMap.set(28, async (gameId, playerId) => {
//     const secretState = await db.newSecretState(playerId, 28, { turnsLeft: 3 })
//     broadcastEvent('secret:new', {
//         idPlayer: playerId,
//         secret: secretState
//     })
//     return await db.newEffectState(playerId, 47, { secretStateId: secretState.id })
// })
// //!34
// afterSpecialEffectsMap.set(34, async (gameId, playerId) => {
//     const secretState = await db.newSecretState(playerId, 34)
//     broadcastEvent('secret:new', {
//         idPlayer: playerId,
//         secret: secretState
//     })
//     return await db.newEffectState(playerId, 47, { secretStateId: secretState.id })
// })
// //!45
// afterSpecialEffectsMap.set(45, async (gameId, playerId) => {
//     const cardState = await db.newCardState(playerId, 45)
//     broadcastEvent('card:new', {
//         idPlayer: playerId,
//         card: cardState
//     })
//     return undefined
// })
// //!46
// afterSpecialEffectsMap.set(46, async (gameId, playerId) => {
//     const cardState = await db.newCardState(playerId, 46)
//     broadcastEvent('card:new', {
//         idPlayer: playerId,
//         card: cardState
//     })
//     return undefined
// })
// //!57
afterSpecialEffectsMap.set(57, async (gameId, playerId) => {
    return await GameEffectStateWithEffectWithPlayer<any>.create({
        playerId,
        gameId,
        effectId: '167b9522-e824-4a7a-8a48-fbc917ccf852',//58
        vars: { wheelId: '40e070f0-2254-4099-af87-33a4bc2cdaed' }
    }, { include: [Effect, Player] })
})
// //!59
afterSpecialEffectsMap.set(59, async (gameId, playerId) => {
    return await GameEffectStateWithEffectWithPlayer<any>.create({
        playerId,
        gameId,
        effectId: '83a3eb91-4ea8-4b31-bbe4-4196a2b0446d',//60
        vars: { wheelId: '5a698d76-5676-4f2e-934e-c98791ad58ca' }
    }, { include: [Effect, Player] })
})






export default afterSpecialEffectsMap