import _ from "lodash";
import { GameQuestionAnswerBody } from '../../pages/api/games/[gameId]/players/[playerId]/effects/answer/[effectStateId]';
import { GameEffectStateWithEffectWithPlayer, Effect, GameTask, Player, GameTaskWithWheelItem, WheelItem, Wheel, GameWheel, GamePlayer } from '../../database/db';
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
    //APPLY SECRET
    // const secretFn = secretCheckMap.get(15)
    // const hasSecret = secretFn && await secretFn(agressorId, targetId)
    // if (hasSecret)
    //     targetId = agressorId
    //
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
                newEffects.push(await GameEffectStateWithEffectWithPlayer<any>.create({
                    playerId: targetId,
                    gameId: effectState.gameId,
                    effectId: 'efd1f7ba-df8a-4617-ab70-c63a39a6b077',//3
                    vars: {
                        wheelId: lastTask.wheelitem.wheelId,
                    }
                }, { include: [Effect, Player] }))
            }
            else
                throw new Error(`Этот игрок еще не крутил ни одного колеса. Нечего повторять... Выбери другого игрока или эффект`)
            break;
        case 8:
            // broadcastEvent(`post:new`, {
            //     post: await db.newPost('effectcustom', {
            //         pattern: `{player} применяет {effect} на {target} с помощью {effect1}`,
            //         variables: {
            //             playerId: agressorId,
            //             targetId,
            //             effectId: answerData.selectedEffectId,
            //             effectId1: 1,
            //         },
            //     } as IPostCustom['variables'])
            // })
            //apply effect
            const effect8 = await GameEffectStateWithEffectWithPlayer<any>.create({
                playerId: targetId,
                gameId: effectState.gameId,
                effectId: '53005511-48b6-43bf-b118-f702ecc0f4d2',//8
            }, { include: [Effect, Player] })
            const effect9 = await GameEffectStateWithEffectWithPlayer.findOne({
                where: {
                    playerId: targetId,
                    isEnded: false,
                },
                include: [{
                    model: Effect,
                    required: true,
                    where: { lid: 9 }
                }, Player]
            })
            if (effect9) {
                effect8.isEnded = true
                await effect8.save()
                effect9.isEnded = true
                await effect9.save()
                // broadcastEvent(`effect:end`, {
                //     idPlayer: targetId,
                //     effectId: 9
                // })
                // broadcastEvent(`post:new`, {
                //     post: await db.newPost('effectcustom', {
                //         pattern: `{target} теряет эффекты {effect} и {effect1} по причине {reason}`,
                //         variables: {
                //             targetId,
                //             effectId: 9,
                //             effectId1: 8,
                //             reason: `Леха укусил Крысу`
                //         },
                //     } as IPostCustom['variables'])
                // })
            }
            else
                newEffects.push(effect8)

            break;
        case 14:
            //apply effect 32 with random wheel
            const gameWheels = await GameWheel.findAll({
                where: {
                    gameId: effectState.gameId
                },
                include: {
                    model: Wheel,
                    required: true,
                    where: {
                        ownerId: { [Op.ne]: targetId, }
                    },
                    include: [
                        WheelItem
                    ]
                }
            }) as (GameWheel & { wheel: Wheel & { wheelItems: WheelItem[] } })[]
            const playerGameTasks = await GameTask.findAll({ where: { gameId: effectState.gameId, playerId: targetId } })
            const availableWheels = gameWheels.filter(w => w.wheel.wheelItems.filter(x => !playerGameTasks.find(y => y.wheelItemId === x.id)))
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
            // broadcastEvent(`post:new`, {
            //     post: await db.newPost('effectcustom', {
            //         pattern: `{player} применяет {effect} на {target} с помощью {effect1}`,
            //         variables: {
            //             playerId: agressorId,
            //             targetId,
            //             effectId: answerData.selectedEffectId,
            //             effectId1: 1,
            //         },
            //     } as IPostCustom['variables'])
            // })
            // broadcastEvent(`post:new`, {
            //     post: await db.newPost('effectcustom', {
            //         pattern: `Следующий ролл {target} будет на колесе {owner} по причине {effect}`,
            //         variables: {
            //             targetId,
            //             ownerId: selectedWheel.ownerId,
            //             effectId: 14
            //         },
            //     } as IPostCustom['variables'])
            // })
            break;
        case 18:
            //subtract points 
            // broadcastEvent(`post:new`, {
            //     post: await db.newPost('effectcustom', {
            //         pattern: `{player} применяет {effect} на {target} с помощью {effect1}`,
            //         variables: {
            //             playerId: agressorId,
            //             targetId,
            //             effectId: answerData.selectedEffectId,
            //             effectId1: 1,
            //         },
            //     } as IPostCustom['variables'])
            // })
            const targetPlayer = await GamePlayer.findOne({
                where: { gameId: effectState.gameId, playerId: targetId }
            })
            if (!targetPlayer)
                throw new Error(`Игрок не найден? Схуяли?`)
            targetPlayer.points -= 15
            await targetPlayer.save()
            break;
        case 23:
            //apply effect 44
            const players = await GamePlayer.findAll({
                where: {
                    gameId: effectState.gameId,
                    playerId: { [Op.ne]: targetId }
                },
                include: Player
            }) as (GamePlayer & { player: Player })[]
            const player = players[Math.floor(Math.random() * players.length)]
            newEffects.push(await GameEffectStateWithEffectWithPlayer<EffectStateQuestionVars>.create({
                playerId: targetId,
                gameId: effectState.gameId,
                effectId: 'a6a4cb24-81b5-4a47-9a2f-9e8987f29be1',//44
                vars: {
                    question: `Тебе необходимо стать каблуком игрока %PLAYERNAME%... Каблук должен играть на его колесе или может откупиться за 20 очков`,
                    player: player.player,
                    types: [{ id: 2, title: 'Буду играть на его колесе' }, { id: 1, title: 'Отдам ему 20 очков' }, { id: 3, title: 'Отсосу', meme: true }]
                } as EffectStateQuestionVars
            }, { include: [Effect, Player] }))
            break;
        case 26:
            throw new Error("Not implemented");

            // const cards = await db.getPlayerCards(targetId)
            // if (cards.length > 0) {
            //     // broadcastEvent(`post:new`, {
            //     //     post: await db.newPost('effectcustom', {
            //     //         pattern: `{player} применяет {effect} на {target} с помощью {effect1}`,
            //     //         variables: {
            //     //             playerId: agressorId,
            //     //             targetId,
            //     //             effectId: answerData.selectedEffectId,
            //     //             effectId1: 1,
            //     //         },
            //     //     } as IPostCustom['variables'])
            //     // })
            //     const card = cards[_.random(0, cards.length - 1)]
            //     await db.endCardId(card.id)
            //     broadcastEvent(`post:new`, {
            //         post: await db.newPost('effectcustom', {
            //             pattern: `{target} теряет карточку {effect} по причине {effect1}`,
            //             variables: {
            //                 targetId,
            //                 effectId: card.effect.id,
            //                 effectId1: 26,
            //             },
            //         } as IPostCustom['variables'])
            //     })
            //     broadcastEvent('card:end', {
            //         idPlayer: targetId,
            //         cardStateId: card.id
            //     })
            // }
            // else
            //     throw new Error(`У этого игрока нет карточек`)
            break;
        default:
            throw new Error(`Что ты выбрал, клоун?`)
    }
    // if (![8, 14, 18, 26].includes(selectedEffect?.lid))
    //     broadcastEvent(`post:new`, {
    //         post: await db.newPost('effectcustom', {
    //             pattern: `{player} применяет {effect} на {target} с помощью {effect1}`,
    //             variables: {
    //                 playerId: agressorId,
    //                 targetId,
    //                 effectId: answerData.selectedEffectId,
    //                 effectId1: 1,
    //             },
    //         } as IPostCustom['variables'])
    //     })
    //TODO await rotateEffects(await db.getPlayableEffects(), await db.getEffect(answerData.selectedEffectId), targetId)
    //clear secret
    // if (hasSecret) {
    //     const fn = secretClearMap.get(15)
    //     if (fn)
    //         newEffects.push(await fn(answerData.selectedPlayerId, targetId))

    // }
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
    //APPLY SECRET
    // const secretFn = secretCheckMap.get(15)
    // const hasSecret = secretFn && await secretFn(agressorId, targetId)

    // if (hasSecret) {
    //     targetId = agressorId
    //     newEffects.push(await db.newEffectState(agressorId, 49, {
    //         question: `Сегодня твой день! Сработал секрет 'No U' и выбранный эффект применился к тебе`,
    //     }))
    // }
    //
    const selectedEffect = await Effect.findOne({
        where: { id: answerData.selectedEffectId }
    })
    switch (selectedEffect?.lid) {
        case 9:
            // broadcastEvent(`post:new`, {
            //     post: await db.newPost('effectcustom', {
            //         pattern: `{player} применяет {effect} на {target} с помощью {effect1}`,
            //         variables: {
            //             playerId: agressorId,
            //             targetId,
            //             effectId: answerData.selectedEffectId,
            //             effectId1: 2,
            //         },
            //     } as IPostCustom['variables'])
            // })
            //apply effect
            const effect9 = await GameEffectStateWithEffectWithPlayer<any>.create({
                playerId: targetId,
                gameId: effectState.gameId,
                effectId: '5676d81c-c0e2-4434-a01c-4649c99594b2',//9
            }, { include: [Effect, Player] })
            const effect8 = await GameEffectStateWithEffectWithPlayer.findOne({
                where: {
                    playerId: targetId,
                    isEnded: false,
                },
                include: [{
                    model: Effect,
                    required: true,
                    where: { lid: 8 }
                }, Player]
            })
            if (effect8) {
                effect9.isEnded = true
                await effect9.save()
                effect8.isEnded = true
                await effect8.save()
                // broadcastEvent(`effect:end`, {
                //     idPlayer: targetId,
                //     effectId: 9
                // })
                // broadcastEvent(`post:new`, {
                //     post: await db.newPost('effectcustom', {
                //         pattern: `{target} теряет эффекты {effect} и {effect1} по причине {reason}`,
                //         variables: {
                //             targetId,
                //             effectId: 9,
                //             effectId1: 8,
                //             reason: `Леха укусил Крысу`
                //         },
                //     } as IPostCustom['variables'])
                // })
            }
            else
                newEffects.push(effect9)
            // const effect8 = await GameEffectStateWithEffectWithPlayer<any>.create({
            //     playerId: targetId,
            //     gameId: effectState.gameId,
            //     effectId: '53005511-48b6-43bf-b118-f702ecc0f4d2',//8
            // }, { include: [Effect, Player] })
            // if (playerEffects.find(x => x.effect.id === 8)) {
            //     await db.endEffectState(targetId, 9)
            //     broadcastEvent(`effect:end`, {
            //         idPlayer: targetId,
            //         effectId: 8
            //     })
            //     broadcastEvent(`post:new`, {
            //         post: await db.newPost('effectcustom', {
            //             pattern: `{target} теряет эффекты {effect} и {effect1} по причине {reason}`,
            //             variables: {
            //                 targetId,
            //                 effectId: 8,
            //                 effectId1: 9,
            //                 reason: `Крыса укусила Ляху`
            //             },
            //         } as IPostCustom['variables'])
            //     })
            // }
            // else
            //     newEffects.push(await db.newEffectState(targetId, 9))
            break;
        case 10:
            //apply effect 40 with random player
            throw new Error("Not implemented");

            // const players = (await db.getPlayers())
            // const otherPlayers = players.filter(x => x.id !== targetId)
            // const player = otherPlayers[Math.floor(Math.random() * otherPlayers.length)]
            // newEffects.push(await db.newEffectState(targetId, 40, {
            //     question: `Выбери чье колесо в следующий раз будет крутить %PLAYERNAME%`,
            //     player,
            //     players: players.filter(x => x.id !== player.id)
            // }))
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
            }, { include: [Effect, Player] }))
        case 17:
            //subtract points 
            const targetPlayer = await GamePlayer.findOne({
                where: { gameId: effectState.gameId, playerId: targetId }
            })
            if (!targetPlayer)
                throw new Error(`Игрок не найден? Схуяли?`)
            targetPlayer.points += 15
            await targetPlayer.save()
            break;
    }
    // if (![9, 17].includes(answerData.selectedEffectId))
    //     broadcastEvent(`post:new`, {
    //         post: await db.newPost('effectcustom', {
    //             pattern: `{player} применяет {effect} на {target} с помощью {effect1}`,
    //             variables: {
    //                 playerId: agressorId,
    //                 targetId,
    //                 effectId: answerData.selectedEffectId,
    //                 effectId1: 2,
    //             },
    //         } as IPostCustom['variables'])
    //     })
    // await rotateEffects(await db.getPlayableEffects(), await db.getEffect(answerData.selectedEffectId), targetId)
    //clear secret
    // if (hasSecret) {
    //     const fn = secretClearMap.get(15)
    //     if (fn)
    //         newEffects.push(await fn(answerData.selectedPlayerId, targetId, true))
    // }
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
// questionAnswerMap.set(40, async (effectState: IEffectState, answerData: AnswerData) => {
//     if (!answerData.selectedPlayerId)
//         throw new Error(`Не выбран игрок`)
//     //apply 31 
//     const wheelId = await db.getPlayerWheelId(answerData.selectedPlayerId)
//     if (!wheelId)
//         throw new Error(`Инвалид игрок (игрок инвалид(как))`)
//     broadcastEvent(`post:new`, {
//         post: await db.newPost('effectcustom', {
//             pattern: `{player} применяет {effect} на {target} выбрав колесо {owner}`,
//             variables: {
//                 playerId: effectState.player.id,
//                 ownerId: answerData.selectedPlayerId,
//                 targetId: effectState.variables.player.id,
//                 effectId: 10,
//             },
//         } as IPostCustom['variables'])
//     })
//     broadcastEvent(`post:new`, {
//         post: await db.newPost('effectcustom', {
//             pattern: `Следующий ролл {target} будет на колесе {owner} по причине {effect}`,
//             variables: {
//                 targetId: effectState.variables.player.id,
//                 ownerId: answerData.selectedPlayerId,
//                 effectId: 10
//             },
//         } as IPostCustom['variables'])
//     })
//     return await db.newEffectState(effectState.variables.player.id, 31, { wheelId })
// })
// questionAnswerMap.set(41, async (effectState: IEffectState, answerData: AnswerData) => {
//     if (!answerData.selectedPlayerId)
//         throw new Error(`Не выбран игрок`)
//     //apply 31 
//     const wheelId = await db.getPlayerWheelId(effectState.player.id)
//     broadcastEvent(`post:new`, {
//         post: await db.newPost('effectcustom', {
//             pattern: `{player} применяет {effect} на {target} `,
//             variables: {
//                 playerId: effectState.player.id,
//                 targetId: answerData.selectedPlayerId,
//                 effectId: 13,
//             },
//         } as IPostCustom['variables'])
//     })
//     broadcastEvent(`post:new`, {
//         post: await db.newPost('effectcustom', {
//             pattern: `Следующий ролл {target} будет на колесе {owner} по причине {effect}`,
//             variables: {
//                 targetId: answerData.selectedPlayerId,
//                 ownerId: effectState.player.id,
//                 effectId: 13
//             },
//         } as IPostCustom['variables'])
//     })
//     if (!wheelId)
//         throw new Error(`Инвалид игрок (игрок инвалид(как))`)
//     return await db.newEffectState(answerData.selectedPlayerId, 30, { wheelId })
// })
// questionAnswerMap.set(42, async (effectState: IEffectState, answerData: AnswerData) => {
//     return undefined
// })
// questionAnswerMap.set(43, async (effectState: IEffectState, answerData: AnswerData) => {
//     return undefined
// })
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