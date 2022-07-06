import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { Routes, Route } from 'react-router-dom'
import { IEffectState } from '../../util/interfaces'
import useWindowDimensions from '../../util/useWindowDimensions'
import { fetchEffects, selectEffects } from '../effects/effectsSlice'
import { selectMyPlayer, fetchMyPlayer } from '../me/myPlayerSlice'
import { selectPlayers, fetchPlayers } from '../players/playersSlice'
import { fetchWheels } from '../wheels/wheelsSlice'
import QuestionModal from './modals/QuestionModal'
import { fetchMyCards, selectMyCards } from './myCardsSlice'
import { selectMyEffects, fetchMyEffects } from './myEffectsSlice'
import { fetchMySecrets, selectMySecrets } from './mySecretsSlice'
import { selectMyTask, fetchMyTask } from './myTaskSlice'

import PlayMenu from './pages/PlayMenu'
import SpinEffectWheel from './pages/SpinEffectWheel'
import SpinPlayerWheel from './pages/SpinPlayerWheel'

interface Props {

}
export default function Game(props: Props) {
    const { height } = useWindowDimensions()
    const maxCardHeight = height
    const myTask = useSelector(selectMyTask)
    const myPlayer = useSelector(selectMyPlayer)
    const players = useSelector(selectPlayers)
    const myEffects = useSelector(selectMyEffects)
    const mySecrets = useSelector(selectMySecrets)
    const myCards = useSelector(selectMyCards)
    const effects = useSelector(selectEffects)
    const dispatch = useDispatch()
    useEffect(() => {
        if (myTask.status === 'idle')
            dispatch(fetchMyTask())
    }, [dispatch, myTask.status])
    useEffect(() => {
        if (myPlayer.status === 'idle')
            dispatch(fetchMyPlayer())
    }, [dispatch, myPlayer.status])
    useEffect(() => {
        if (players.status === 'idle')
            dispatch(fetchPlayers())
    }, [dispatch, players.status])
    useEffect(() => {
        if (myEffects.status === 'idle')
            dispatch(fetchMyEffects())
    }, [dispatch, myEffects.status])
    useEffect(() => {
        if (mySecrets.status === 'idle')
            dispatch(fetchMySecrets())
    }, [dispatch, mySecrets.status])
    useEffect(() => {
        if (myCards.status === 'idle')
            dispatch(fetchMyCards())
    }, [dispatch, myCards.status])
    useEffect(() => {
        if (effects.status === 'idle') {
            dispatch(fetchEffects())
        }
    }, [effects.status, dispatch])
    const [question, setQuestion] = useState<IEffectState | undefined>()
    useEffect(() => {
        setQuestion(undefined)
        const q = myEffects.effects?.find(x => x.variables?.question)
        setQuestion(q)
    }, [myEffects.effects])
    function handleOkPressed() {
        setQuestion(undefined)
        const q = myEffects.effects?.find(x => x.variables?.question && question?.id !== x.id)
        setQuestion(q)
    }
    return (
        <Routes>
            <Route path='/game/spin'>
                <SpinPlayerWheel height={maxCardHeight} />
            </Route>
            <Route path='/game/play'>
                <Modal contentClassName='bg-dark' show={!!question} animation={true} centered>
                    {question && <QuestionModal effectState={question} effectVars={question.variables as any} onOk={handleOkPressed} />}
                </Modal>
                <PlayMenu height={maxCardHeight} />
            </Route>
            <Route path='/game/effects'>
                <SpinEffectWheel height={maxCardHeight} />
            </Route>
        </Routes>
    )
}