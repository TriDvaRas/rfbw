import _ from "lodash";
import { GameQuestionAnswerBody } from '../../pages/api/games/[gameId]/players/[playerId]/effects/answer/[effectStateId]';
import { GameEffectStateWithEffectWithPlayer, Effect, GameTask, Player, GameTaskWithWheelItem, WheelItem, Wheel, GameWheel, GamePlayer, GameWheelWithWheel, GameEvent } from '../../database/db';
import { EffectStateQuestionVars } from "../../types/effectStateVars";
import { Op } from 'sequelize';


type AnswerData = {
    selectedPlayerId?: number;
    selectedEffectId?: number;
    selectedScoreId?: number;
    selectedWheelId?: number;
    selectedWheelItemId?: number;
    [key: string]: any
};

const questionAnswerMap = new Map<number, (effectState: GameEffectStateWithEffectWithPlayer<EffectStateQuestionVars>, body: GameQuestionAnswerBody) => Promise<GameEffectStateWithEffectWithPlayer[] | GameEffectStateWithEffectWithPlayer | undefined>>()


questionAnswerMap.set(36, async (effectState, answerData) => {
    if (!answerData.selectedPlayerId)
        throw new Error(`Не выбран игрок`)
    if (!answerData.selectedEffectId)
        throw new Error(`Не выбран эффект`)
    const agressorId = effectState.player.id
    let targetId = answerData.selectedPlayerId

    const newEffects: GameEffectStateWithEffectWithPlayer[] = []
    const selectedEffect = await Effect.findOne({
        where: { id: answerData.selectedEffectId }
    })
    switch (selectedEffect?.lid) {
        case 3:
            const lastTask = await GameTaskWithWheelItem.findOne({
                where: {
                    gameId: effectState.gameId,
                    playerId: targetId,
                    fromCoop: false
                },
                order: [['createdAt', 'DESC']],
                include: WheelItem
            })
            if (lastTask) {
                const state = await GameEffectStateWithEffectWithPlayer<any>.create({
                    playerId: targetId,
                    gameId: effectState.gameId,
                    effectId: 'efd1f7ba-df8a-4617-ab70-c63a39a6b077',//3
                    vars: {
                        wheelId: lastTask.wheelitem.wheelId,
                    }
                }, { include: [Effect, Player] })
                newEffects.push(state)
                await GameEvent.create({
                    gameId: effectState.gameId,
                    playerId: targetId,
                    effectId: `efd1f7ba-df8a-4617-ab70-c63a39a6b077`,
                    imageId: effectState.effect.imageId,
                    type: 'effectAppliedBad',
                    vars: {
                        agressorId
                    }
                })
            }
            else
                throw new Error(`Этот игрок еще не крутил ни одного колеса. Нечего повторять... Выбери другого игрока или эффект`)
            break;
        case 14:
            //apply effect 32 with random wheel
            const gameWheels = await GameWheelWithWheel.findAll({
                where: {
                    gameId: effectState.gameId
                },
                include: {
                    model: Wheel,
                    required: true,
                    where: {
                        ownedById: { [Op.ne]: targetId, }
                    },
                    include: [
                        WheelItem
                    ]
                }
            }) as (GameWheel & { wheel: Wheel & { wheelitems: WheelItem[] } })[]

            const playerGameTasks = await GameTask.findAll({ where: { gameId: effectState.gameId, playerId: targetId } })
            const availableWheels = gameWheels.filter(w => w.wheel.wheelitems.filter(x => !playerGameTasks.find(y => y.wheelItemId === x.id)))
            if (availableWheels.length == 0)
                throw new Error('Игрок завершил все колеса. Выбери другого')
            const selectedWheel = availableWheels[Math.floor(Math.random() * availableWheels.length)]
            // newEffects.push(await db.newEffectState(targetId, 32, ))
            newEffects.push(await GameEffectStateWithEffectWithPlayer<any>.create({
                playerId: targetId,
                gameId: effectState.gameId,
                effectId: '203e0f75-7766-4aae-9693-a38bf58ac5a3',//32
                vars: { wheelId: selectedWheel.wheel.id }
            }, { include: [Effect, Player] }))
            await GameEvent.create({
                gameId: effectState.gameId,
                playerId: targetId,
                effectId: `b09a0b27-c856-4450-932e-8f254636978b`,
                imageId: selectedEffect.imageId,
                type: 'effectAppliedBad',
                vars: {
                    agressorId
                }
            })
            break;
        case 18:
            //subtract points 
            const targetPlayer = await GamePlayer.findOne({
                where: { gameId: effectState.gameId, playerId: targetId }
            })
            if (!targetPlayer)
                throw new Error(`Игрок не найден? Схуяли?`)
            targetPlayer.points -= 15
            await targetPlayer.save()
            await GameEvent.create({
                gameId: effectState.gameId,
                playerId: targetId,
                effectId: `d5907cf0-5aa3-4686-9115-56a2ab0ef8be`,
                imageId: selectedEffect.imageId,
                type: 'effectAppliedBad',
                pointsDelta: -15,
                vars: {
                    agressorId
                }
            })
            break;
        case 57:
            const state = await GameEffectStateWithEffectWithPlayer<any>.create({
                playerId: targetId,
                gameId: effectState.gameId,
                effectId: '167b9522-e824-4a7a-8a48-fbc917ccf852',//58
                vars: { wheelId: '40e070f0-2254-4099-af87-33a4bc2cdaed' }
            }, { include: [Effect, Player] })
            newEffects.push(state)
            await GameEvent.create({
                gameId: effectState.gameId,
                playerId: targetId,
                effectId: `16ab26b5-fa78-44f5-bde4-2187012bcac4`,
                imageId: selectedEffect.imageId,
                type: 'effectAppliedBad',
                vars: {
                    agressorId
                }
            })
            break;
        default:
            throw new Error(`Что ты выбрал, клоун?`)
    }

    return newEffects.length === 1 ? newEffects[0] : newEffects
})
questionAnswerMap.set(37, async (effectState, answerData) => {
    if (!answerData.selectedPlayerId)
        throw new Error(`Не выбран игрок`)
    if (!answerData.selectedEffectId)
        throw new Error(`Не выбран эффект`)
    const agressorId = effectState.player.id
    let targetId = answerData.selectedPlayerId
    const newEffects: GameEffectStateWithEffectWithPlayer[] = []

    const selectedEffect = await Effect.findOne({
        where: { id: answerData.selectedEffectId }
    })
    switch (selectedEffect?.lid) {
        case 10:
            //apply effect 40 with random player
            const otherPlayers = await GamePlayer.findAll({
                where: {
                    gameId: effectState.gameId,
                    playerId: { [Op.ne]: targetId }
                },
                include: Player
            })
            const player = otherPlayers[Math.floor(Math.random() * otherPlayers.length)]
            const wheels = await GameWheelWithWheel.findAll({
                where: {
                    gameId: effectState.gameId,
                },
                include: [{
                    model: Wheel,
                    required: true,
                    where: { ownedById: { [Op.ne]: player.playerId } }
                }]
            })
            await GameEffectStateWithEffectWithPlayer<EffectStateQuestionVars>.create({
                playerId: targetId,
                gameId: effectState.gameId,
                effectId: '8b27c779-d364-493c-a01a-529ecdbee017',//40
                vars: {
                    question: 'Выбери какое колесо в следующий раз будет крутить %PLAYERNAME%',
                    gamePlayer: player,
                    wheels
                } as EffectStateQuestionVars
            }, { include: [Effect, Player] })
            await GameEvent.create({
                gameId: effectState.gameId,
                playerId: targetId,
                effectId: `9d11e934-e2e3-4878-8d68-91f473e473ad`,
                imageId: selectedEffect.imageId,
                type: 'effectAppliedGood',
                vars: {
                    agressorId
                }
            })
            break;
        case 13:
            //apply effect 41 
            const players = await GamePlayer.findAll({
                where: {
                    gameId: effectState.gameId,
                    playerId: { [Op.ne]: targetId }
                },
                include: Player
            }) as (GamePlayer & { player: Player })[]
            newEffects.push(await GameEffectStateWithEffectWithPlayer<EffectStateQuestionVars>.create({
                playerId: targetId,
                gameId: effectState.gameId,
                effectId: '35d6674a-1117-4bdb-a763-7ee152a61632',//41
                vars: {
                    question: `Выбери кто будет крутить твое колесо в следующем ролле`,
                    players: players.map(x => x.player)
                }
            },
                { include: [Effect, Player] }
            ))
            await GameEvent.create({
                gameId: effectState.gameId,
                playerId: targetId,
                effectId: `63e8d70d-194d-44ad-b5a4-436ceafb5c07`,
                imageId: selectedEffect.imageId,
                type: 'effectAppliedGood',
                vars: {
                    agressorId
                }
            })
            break;
        case 17:
            //subtract points 
            const targetPlayer = await GamePlayer.findOne({
                where: { gameId: effectState.gameId, playerId: targetId }
            })
            if (!targetPlayer)
                throw new Error(`Игрок не найден? Схуяли?`)
            targetPlayer.points += 15
            await targetPlayer.save()
            await GameEvent.create({
                gameId: effectState.gameId,
                playerId: targetId,
                effectId: `450c5c15-1698-48a1-8192-2234166e8da8`,
                imageId: selectedEffect.imageId,
                type: 'effectAppliedGood',
                pointsDelta: 15,
                vars: {
                    agressorId
                }
            })
            break;
        case 19:
            //subtract points 
            const state = await GameEffectStateWithEffectWithPlayer<any>.create({
                playerId: targetId,
                gameId: effectState.gameId,
                effectId: 'c14bf560-b1b8-4172-8827-538dd0c75605',//58
            }, { include: [Effect, Player] })
            newEffects.push(state)
            await GameEvent.create({
                gameId: effectState.gameId,
                playerId: targetId,
                effectId: `c14bf560-b1b8-4172-8827-538dd0c75605`,
                imageId: selectedEffect.imageId,
                type: 'effectAppliedGood',
                vars: {
                    agressorId
                }
            })
            break;
        default:
            throw new Error(`Что ты выбрал, клоун?`)
    }


    return newEffects.length === 1 ? newEffects[0] : newEffects
})
// questionAnswerMap.set(38, async (effectState: IEffectState, answerData: AnswerData) => {
//     if (!answerData.selectedScoreId)
//         throw new Error(`Не выбрана оценка`)
//     const players = await db.getPlayers()
//     const lastTask = (await db.getPlayerLastTask(effectState.player.id)).wheelItem as IWheelItem
//     const scoreId = await db.newScore(effectState.player.id, lastTask.id, answerData.selectedScoreId)
//     await db.newClearTask({
//         type: 'guess',
//         clearAt: new Date(Date.now() + config.guessDuration),
//         variables: {
//             scoreId,
//             playerId: effectState.player.id,
//             contentName: lastTask.title,
//             score: answerData.selectedScoreId
//         }
//     })
//     broadcastEvent(`post:new`, {
//         post: await db.newPost('effectcustom', {
//             pattern: `{player} поставил оценку {content} Конец отгадывания: {timeago}`,
//             variables: {
//                 playerId: effectState.player.id,
//                 content: lastTask.title,
//                 timeago: new Date(Date.now() + config.guessDuration)
//             },
//         } as IPostCustom['variables'])
//     })
//     const newEffects = await db.newEffectStates(players.map(x => x.id).filter(x => x !== effectState.player.id), 39, {
//         question: `Угадай какую оценку поставил %PLAYERNAME% после завершения %CONTENTNAME%`,
//         scoreId,
//         player: players.find(x => x.id === effectState.player.id),
//         content: lastTask,
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
//     return newEffects
// })
// questionAnswerMap.set(39, async (effectState: IEffectState, answerData: AnswerData) => {
//     if (!answerData.selectedScoreId)
//         throw new Error(`Не выбрана оценка`)
//     const score = await db.getScore(effectState.variables.scoreId)
//     if (!score)
//         throw new Error(`Инвалид... блять... Не могу найти оценку чела... (ты не должен был здесь застрять если не лазил в код(в теории))`)

//     await db.newScoreGuess(effectState.player.id, score.id, answerData.selectedScoreId)
//     return undefined
// })
questionAnswerMap.set(40, async (effectState, answerData) => {
    if (!answerData.selectedWheelId)
        throw new Error(`Не выбрано колесо`)
    //apply 31 
    const wheelId = answerData.selectedWheelId
    const selectedEffect = await Effect.findOne({ where: { lid: 40 } }) as Effect
    const state = await GameEffectStateWithEffectWithPlayer<any>.create({
        playerId: effectState.vars.gamePlayer?.playerId,
        gameId: effectState.gameId,
        effectId: '1316f200-4c50-4387-9f2d-407eaa732f16',//31
        vars: { wheelId }
    }, { include: [Effect, Player] })
    await GameEvent.create({
        gameId: effectState.gameId,
        playerId: effectState.vars.gamePlayer?.playerId,
        effectId: `1316f200-4c50-4387-9f2d-407eaa732f16`,
        imageId: selectedEffect.imageId,
        type: 'effectApplied',
        vars: {
            agressorId: effectState.playerId
        }
    })
    return state
})
questionAnswerMap.set(41, async (effectState, answerData) => {
    if (!answerData.selectedPlayerId)
        throw new Error(`Не выбран игрок`)
    const selectedEffect = await Effect.findOne({ where: { lid: 41 } }) as Effect
    const state = await GameEffectStateWithEffectWithPlayer<any>.create({
        playerId: answerData.selectedPlayerId,
        gameId: effectState.gameId,
        effectId: '53feafb2-7177-41cb-b256-96c8e93627ba',//30
        vars: { wheelOwnerId: effectState.playerId }
    }, { include: [Effect, Player] })
    await GameEvent.create({
        gameId: effectState.gameId,
        playerId: answerData.selectedPlayerId,
        effectId: `53feafb2-7177-41cb-b256-96c8e93627ba`,
        imageId: selectedEffect.imageId,
        type: 'effectApplied',
        vars: {
            agressorId: effectState.playerId
        }
    })
    return state
})
questionAnswerMap.set(42, async (effectState, answerData) => {
    return undefined
})
questionAnswerMap.set(43, async (effectState, answerData) => {
    return undefined
})
// questionAnswerMap.set(44, async (effectState: IEffectState, answerData: AnswerData) => {
//     if (!answerData.selectedTypeId)
//         throw new Error(`Не выбран тип`)
//     switch (answerData.selectedTypeId) {
//         case 1:
//             broadcastEvent(`post:new`, {
//                 post: await db.newPost('effectcustom', {
//                     pattern: `Каблук {player} решает {selection}`,
//                     variables: {
//                         playerId: effectState.player.id,
//                         selection: `откупиться`
//                     },
//                 } as IPostCustom['variables'])
//             })
//             await addPoints(effectState.variables.player.id, 20, `Каблук`, true)
//             await removePoints(effectState.player.id, 20, `Каблук`)
//             return
//         case 2:
//             //apply effect 33
//             broadcastEvent(`post:new`, {
//                 post: await db.newPost('effectcustom', {
//                     pattern: `Каблук {player} решает {selection} {owner}`,
//                     variables: {
//                         playerId: effectState.player.id,
//                         ownerId: effectState.variables.player.id,
//                         selection: `играть на колесе`
//                     },
//                 } as IPostCustom['variables'])
//             })
//             broadcastEvent(`post:new`, {
//                 post: await db.newPost('effectcustom', {
//                     pattern: `Следующий ролл {player} будет на колесе {owner} по причине {effect}`,
//                     variables: {
//                         playerId: effectState.player.id,
//                         ownerId: effectState.variables.player.id,
//                         effectId: 23
//                     },
//                 } as IPostCustom['variables'])
//             })
//             return await db.newEffectState(effectState.player.id, 33, { wheelId: await db.getPlayerWheelId(effectState.variables.player.id) })
//         default:
//             break;


//     }
//     throw new Error(`?) (570-36)`)
// })
// questionAnswerMap.set(49, async (effectState: IEffectState, answerData: AnswerData) => {
//     return undefined
// })
// questionAnswerMap.set(52, async (effectState: IEffectState, answerData: AnswerData) => {
//     if (!answerData.selectedPlayerId)
//         throw new Error(`Не выбран игрок`)
//     //get selectedplayer secrets
//     const secrets = await db.getPlayerSecrets(answerData.selectedPlayerId)
//     await db.endEffectState(answerData.selectedPlayerId, 47, true)
//     broadcastEvent(`post:new`, {
//         post: await db.newPost('effectcustom', {
//             pattern: `{player} запустил сигнальную ракету в {target} и уничтожил все его секреты: {number} шт.`,
//             variables: {
//                 playerId: effectState.player.id,
//                 targetId: answerData.selectedPlayerId,
//                 effectId: 24,
//                 number: secrets.length
//             },
//         } as IPostCustom['variables'])
//     })
//     await Promise.all(secrets.map(async x => {
//         broadcastEvent(`secret:end`, {
//             idPlayer: answerData.selectedPlayerId,
//             secretStateId: x.id
//         })
//         broadcastEvent(`post:new`, {
//             post: await db.newPost('effectcustom', {
//                 pattern: `{target} теряет секрет {effect1} по причине {effect}`,
//                 variables: {
//                     targetId: answerData.selectedPlayerId,
//                     effectId: 24,
//                     effectId1: x.effect.id,
//                 },
//             } as IPostCustom['variables'])
//         })
//         broadcastEvent(`effect:end`, {
//             idPlayer: answerData.selectedPlayerId,
//             effectId: 47
//         })
//         return await db.endSecretId(x.id)
//     }))

//     broadcastEvent(`effect:new`, {
//         idPlayer: answerData.selectedPlayerId,
//         effect: await db.newEffectState(answerData.selectedPlayerId, 49, {
//             question: `%PLAYERNAME% уничтожил ваши секреты`,
//             player: effectState.player
//         })
//     })
//     return undefined
// })
// questionAnswerMap.set(54, async (effectState: IEffectState, answerData: AnswerData) => {
//     if (!answerData.selectedWheelId)
//         throw new Error(`Не выбрано колесо`)
//     if (!answerData.selectedWheelItemId)
//         throw new Error(`Не выбран контент`)
//     //APPLY SECRET
//     broadcastEvent(`post:new`, {
//         post: await db.newPost('effectcustom', {
//             pattern: `{player} использует {effect} и временно удаляет {itemName} с колеса {owner}`,
//             variables: {
//                 playerId: effectState.player.id,
//                 ownerId: effectState.player.id,
//                 effectId: 46,
//                 itemName: (await db.getWheelItem(answerData.selectedWheelItemId)).title,
//             },
//         } as IPostCustom['variables'])
//     })
//     //apply effect 40 with random player
//     return await db.newEffectState(effectState.player.id, 53, {
//         wheelId: answerData.selectedWheelId,
//         wheelItemId: answerData.selectedWheelItemId,
//     })
// })
export default questionAnswerMap