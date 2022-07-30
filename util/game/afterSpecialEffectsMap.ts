import _ from "lodash";
import { GameEffectState } from "../../database/db";

type GenericObject = { [key: string]: any };
const afterSpecialEffectsMap = new Map<number, (playerId: number) => Promise<GameEffectState | undefined>>()
// //!1
// afterSpecialEffectsMap.set(1, async (playerId: number) => {
//     const effect = await db.newEffectState(playerId, 36, {
//         question: 'Выберите игрока и негативный эффект который хотите на него наложить',
//         players: (await db.getPlayers()).filter(x => x.id != playerId),
//         effects: (await db.getEffects({ cooldown: 0, is_negative: true })).filter(x => x.groupId < 40 || x.groupId >= 50)
//     })
//     return effect
// })
// //!2
// afterSpecialEffectsMap.set(2, async (playerId: number) => {
//     const effect = await db.newEffectState(playerId, 37, {
//         question: 'Выберите игрока и положительный эффект который хотите на него наложить',
//         players: (await db.getPlayers()).filter(x => x.id != playerId),
//         effects: (await db.getEffects({ cooldown: 0, is_positive: true })).filter(x => x.groupId < 40 || x.groupId >= 50)
//     })
//     return effect

// })
// //!3
// afterSpecialEffectsMap.set(3, async (playerId: number) => {
//     const lastTask = await db.getPlayerLastTask(playerId)
//     broadcastEvent(`post:new`, {
//         post: await db.newPost('effectcustom', {
//             pattern: `Следующий ролл {player} будет на колесе {owner} по причине {effect}`,
//             variables: {
//                 playerId,
//                 ownerId: await db.getWheelOwnerId(lastTask.wheelItem.wheelId),
//                 effectId: 3
//             },
//         } as IPostCustom['variables'])
//     })
//     return await db.newEffectState(playerId, 3, { wheelId: lastTask.wheelItem.wheelId })
// })
// //!4
// afterSpecialEffectsMap.set(4, async (playerId: number) => {
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
// afterSpecialEffectsMap.set(5, async (playerId: number) => {
//     return await db.newEffectState(playerId, 5)
// })
// //!6
// afterSpecialEffectsMap.set(6, async (playerId: number) => {
//     return await db.newEffectState(playerId, 6)
// })
// //!7
// afterSpecialEffectsMap.set(7, async (playerId: number) => {
//     return await db.newEffectState(playerId, 7)
// })
// //!8
// afterSpecialEffectsMap.set(8, async (playerId: number) => {
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
// afterSpecialEffectsMap.set(9, async (playerId: number) => {
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
// afterSpecialEffectsMap.set(10, async (playerId: number) => {
//     const players = (await db.getPlayers())
//     const otherPlayers = players.filter(x => x.id !== playerId)
//     const player = otherPlayers[Math.floor(Math.random() * otherPlayers.length)]
//     return await db.newEffectState(playerId, 40, {
//         question: `Выбери чье колесо в следующий раз будет крутить %PLAYERNAME%`,
//         player,
//         players: players.filter(x => x.id !== player.id)
//     })
// })
// //!11
// afterSpecialEffectsMap.set(11, async (playerId: number) => {
//     return await db.newEffectState(playerId, 35)
// })
// //!12
// afterSpecialEffectsMap.set(12, async (playerId: number) => {
//     return undefined
// })
// //!13
// afterSpecialEffectsMap.set(13, async (playerId: number) => {
//     return await db.newEffectState(playerId, 41, {
//         question: `Выбери кто будет крутить твое колесо в следующем ролле`,
//         players: (await db.getPlayers()).filter(x => x.id !== playerId)
//     })
// })
// //!14
// afterSpecialEffectsMap.set(14, async (playerId: number) => {
//     const wheels = applyDisabled(await db.getWheels(), await db.getPlayerTasksIds(playerId))
//     const availableWheels = wheels.filter(w => w.ownerId !== playerId && w.items?.find(x => !x.disabled))
//     const selectedWheel = availableWheels[Math.floor(Math.random() * availableWheels.length)]
//     broadcastEvent(`post:new`, {
//         post: await db.newPost('effectcustom', {
//             pattern: `Следующий ролл {player} будет на колесе {owner} по причине {effect}`,
//             variables: {
//                 playerId,
//                 ownerId: selectedWheel.ownerId,
//                 effectId: 14
//             },
//         } as IPostCustom['variables'])
//     })
//     return await db.newEffectState(playerId, 32, { wheelId: selectedWheel.id })
// })
// //!15
// afterSpecialEffectsMap.set(15, async (playerId: number) => {
//     const secretState = await db.newSecretState(playerId, 15)
//     broadcastEvent('secret:new', {
//         idPlayer: playerId,
//         secret: secretState
//     })
//     return await db.newEffectState(playerId, 47, { secretStateId: secretState.id })
// })
// //!16
// afterSpecialEffectsMap.set(16, async (playerId: number) => {
//     const secretState = await db.newSecretState(playerId, 16)
//     broadcastEvent('secret:new', {
//         idPlayer: playerId,
//         secret: secretState
//     })
//     return await db.newEffectState(playerId, 47, { secretStateId: secretState.id })
// })
// //!17
// afterSpecialEffectsMap.set(17, async (playerId: number) => {
//     await addPoints(playerId, 15, `Привалило`)
//     return undefined
// })
// //!18
// afterSpecialEffectsMap.set(18, async (playerId: number) => {
//     await removePoints(playerId, 15, `На пенек сел`)
//     return undefined
// })
// //!19
// afterSpecialEffectsMap.set(19, async (playerId: number) => {
//     const cardState = await db.newCardState(playerId, 19)
//     broadcastEvent('card:new', {
//         idPlayer: playerId,
//         card: cardState
//     })
//     return undefined
// })
// //!20
// afterSpecialEffectsMap.set(20, async (playerId: number) => {
//     const effect = await db.newEffectState(playerId, 47)
//     const secretState = await db.newSecretState(playerId, 20, { turnsLeft: 3, startEffectId: effect.id })
//     broadcastEvent('secret:new', {
//         idPlayer: playerId,
//         secret: secretState
//     })
//     return effect
// })
// //!21
// afterSpecialEffectsMap.set(21, async (playerId: number) => {
//     const newEffects = await db.newEffectState(playerId, 42, {
//         question: `Выбери 1-3 чисел, если не зассал`,
//         is21: true,
//     })
//     return newEffects
// })
// //!22
// afterSpecialEffectsMap.set(22, async (playerId: number) => {
//     const newEffects = await db.newEffectState(playerId, 43, {
//         question: `СТРЕЛЯЕМ?? `,
//         is22: true,
//     })
//     return newEffects
// })
// //!23
// afterSpecialEffectsMap.set(23, async (playerId: number) => {
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
// afterSpecialEffectsMap.set(24, async (playerId: number) => {
//     const cardState = await db.newCardState(playerId, 24)
//     broadcastEvent('card:new', {
//         idPlayer: playerId,
//         card: cardState
//     })
//     return undefined
// })
// //!25
// afterSpecialEffectsMap.set(25, async (playerId: number) => {
//     const cardState = await db.newCardState(playerId, 25)
//     broadcastEvent('card:new', {
//         idPlayer: playerId,
//         card: cardState
//     })
//     return undefined
// })
// //!26
// afterSpecialEffectsMap.set(26, async (playerId: number) => {
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
// afterSpecialEffectsMap.set(28, async (playerId: number) => {
//     const secretState = await db.newSecretState(playerId, 28, { turnsLeft: 3 })
//     broadcastEvent('secret:new', {
//         idPlayer: playerId,
//         secret: secretState
//     })
//     return await db.newEffectState(playerId, 47, { secretStateId: secretState.id })
// })
// //!34
// afterSpecialEffectsMap.set(34, async (playerId: number) => {
//     const secretState = await db.newSecretState(playerId, 34)
//     broadcastEvent('secret:new', {
//         idPlayer: playerId,
//         secret: secretState
//     })
//     return await db.newEffectState(playerId, 47, { secretStateId: secretState.id })
// })
// //!45
// afterSpecialEffectsMap.set(45, async (playerId: number) => {
//     const cardState = await db.newCardState(playerId, 45)
//     broadcastEvent('card:new', {
//         idPlayer: playerId,
//         card: cardState
//     })
//     return undefined
// })
// //!46
// afterSpecialEffectsMap.set(46, async (playerId: number) => {
//     const cardState = await db.newCardState(playerId, 46)
//     broadcastEvent('card:new', {
//         idPlayer: playerId,
//         card: cardState
//     })
//     return undefined
// })






export default afterSpecialEffectsMap