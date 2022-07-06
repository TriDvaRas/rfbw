/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars*/
import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as MyTask from '../game/myTaskSlice'
import * as MyPlayer from '../me/myPlayerSlice'
import * as MyWheel from '../me/myWheelSlice'
import * as Players from '../players/playersSlice'
import { getUserInfo } from '../userinfo/userInfoSlice'
import * as Wheels from '../wheels/wheelsSlice'
import * as StatsHistory from '../charts/statsHistorySlice'
import * as MyEffects from '../game/myEffectsSlice'
import * as MySecrets from '../game/mySecretsSlice'
import * as MyCards from '../game/myCardsSlice'
import { Socket } from 'socket.io-client'
import * as Effects from '../effects/effectsSlice'
import * as Posts from '../game/postsSlice'
export const useSocket = (socket: Socket<any, any>): void => {
    const dispatch = useDispatch()

    const userinfo = useSelector(getUserInfo)

    const players = useSelector(Players.selectPlayers)
    const myPlayer = useSelector(MyPlayer.selectMyPlayer)

    const wheels = useSelector(Wheels.selectWheels)
    const myWheel = useSelector(MyWheel.selectMyWheel)

    const myTask = useSelector(MyTask.selectMyTask)
    const myEffects = useSelector(MyEffects.selectMyEffects)
    const effects = useSelector(Effects.selectEffects)

    useEffect(() => {

        socket.on(`player:updateinfo`, (data:any) => {
            if (myPlayer.player && myPlayer.player.id === data.id) {
                dispatch(MyPlayer.updateMyPlayer(data))
            }
            dispatch(Players.updatePlayer(data))

        })
        socket.on(`wheel:updateinfo`, (data:any) => {
            if (myWheel.wheel && myWheel.wheel.id === data.id) {
                if (data.border) dispatch(MyWheel.updateBorder(data.border))
                if (data.background) dispatch(MyWheel.updateBackground(data.background))
                if (data.dot) dispatch(MyWheel.updateDot(data.dot))
                if (data.pointer) dispatch(MyWheel.updatePointer(data.pointer))
            }
            dispatch(Wheels.updateWheel(data))
        })
        socket.on(`wheelitem:updateinfo`, (data:any) => {
            if (myWheel.wheel && myWheel.wheel.id === data.wheelId) {
                dispatch(MyWheel.updateItem({ item: data }))
            }
            dispatch(Wheels.updateItem({
                wheelId: data.wheelId,
                item: data,
            }))
        })
        socket.on(`wheelitem:add`, (data:any) => {

            dispatch(Wheels.addItem({
                wheelId: data.wheelId,
                item: data,
            }))
        })
        socket.on(`wheelitem:delete`, (data:any) => {
            dispatch(Wheels.deleteItem(data))
        })
        socket.on(`task:new`, (data:any) => {
            //TODO notify all users

            if (myPlayer.player && myPlayer.player.id === data.idPlayer) {
                dispatch(MyTask.updateTask(data.task))
                dispatch(Wheels.updateItem({
                    wheelId: data.task.wheelItem.wheelId,
                    item: { id: data.task.wheelItem.id, disabled: true },
                }))
            }
        })
        socket.on(`task:end`, (data:any) => {
            //TODO notify all users

            if (myPlayer.player && myPlayer.player.id === data.idPlayer) {
                dispatch(MyTask.setTask(data.task))
                dispatch(MyPlayer.updateMyPlayer({ points: data.points, ended: data.ended }))
            }
            dispatch(Players.updatePlayer({ id: data.idPlayer, points: data.points, ended: data.ended }))
        })
        socket.on(`task:reroll`, (data:any) => {
            //TODO notify all users

            if (myPlayer.player && myPlayer.player.id === data.idPlayer) {
                dispatch(MyTask.setTask(data.task))
                dispatch(MyPlayer.updateMyPlayer({ points: data.points, rerolled: data.rerolled }))
            }
            dispatch(Players.updatePlayer({ id: data.idPlayer, points: data.points, rerolled: data.rerolled }))
        })
        socket.on(`task:drop`, (data:any) => {
            //TODO notify all users

            if (myPlayer.player && myPlayer.player.id === data.idPlayer) {
                dispatch(MyTask.setTask(data.task))
                dispatch(MyPlayer.updateMyPlayer({ points: data.points, dropped: data.dropped }))
            }
            dispatch(Players.updatePlayer({ id: data.idPlayer, points: data.points, dropped: data.dropped }))
        })
        socket.on(`stats:new`, (data:any) => {
            dispatch(StatsHistory.addStat(data))
        })
        socket.on(`effect:new`, (data:any) => {
            if (myPlayer.player && myPlayer.player.id === data.idPlayer)
                dispatch(MyEffects.addEffect(data.effect))
        })
        socket.on(`effect:updatevars`, (data:any) => {
            if (myPlayer.player && myPlayer.player.id === data.idPlayer)
                dispatch(MyEffects.updateEffectVars(data))
        })
        socket.on(`secret:new`, (data:any) => {
            if (myPlayer.player && myPlayer.player.id === data.idPlayer)
                dispatch(MySecrets.addSecret(data.secret))
        })
        socket.on(`card:new`, (data:any) => {
            if (myPlayer.player && myPlayer.player.id === data.idPlayer)
                dispatch(MyCards.addCard(data.card))
        })
        socket.on(`effects:new`, (data:any) => {
            for (const effect of data.effects) {
                if (myPlayer.player && myPlayer.player.id === effect.player.id)
                    dispatch(MyEffects.addEffect(effect))
            }
        })
        socket.on(`effect:end`, (data:any) => {
            if (myPlayer.player && myPlayer.player.id === data.idPlayer) {
                const { effectId, effectStateId } = data
                dispatch(MyEffects.endEffect({ effectId, effectStateId }))
            }
        })
        socket.on(`card:end`, (data:any) => {
            if (myPlayer.player && myPlayer.player.id === data.idPlayer) {
                const { cardId, cardStateId } = data
                dispatch(MyCards.endCard({ cardId, cardStateId }))
            }
        })
        socket.on(`secret:end`, (data:any) => {
            if (myPlayer.player && myPlayer.player.id === data.idPlayer) {
                dispatch(MySecrets.endSecret({ secretStateId: data.secretStateId }))
            }
        })
        socket.on(`effectswheel:update`, (data:any) => {
            dispatch(Effects.updateEffects(data.effects))
        })
        socket.on(`post:new`, (data:any) => {
            dispatch(Posts.addPost(data.post))
        })
        return () => {
            socket.off()
        }
    }, [dispatch, effects.isSpinning, myPlayer.player, myWheel.wheel, socket])

    return
}