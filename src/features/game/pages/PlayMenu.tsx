import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Container, Modal, Row } from 'react-bootstrap'
import Scrollbars from 'react-custom-scrollbars-2'
import { useDispatch, useSelector } from 'react-redux'
import LoadingDots from '../../../components/LoadingDots'
import { fetchMyPlayer, selectMyPlayer } from '../../me/myPlayerSlice'
import PlayerAboutCard from '../../playerAbout/PlayerAboutCard'
import { fetchPlayers, selectPlayers } from '../../players/playersSlice'
import { newToast } from '../../toasts/toastsSlice'
import DropModal from '../modals/DropModal'
import EndModal from '../modals/EndModal'
import GetNewTaskPrompt from '../cards/GetNewTaskPrompt'
import MyStatsHistory from '../cards/MyStatsHistory'
import RerollModal from '../modals/RerollModal'
import TaskPreview from '../cards/TaskPreview'
import { fetchMyTask, selectMyTask, updateTask } from '../myTaskSlice'
import { fetchMyEffects, selectMyEffects } from '../myEffectsSlice'
import { selectMySecrets } from '../mySecretsSlice'
import { selectMyCards } from '../myCardsSlice'
import MyEffectsModal from '../modals/MyEffectsModal'
import MyCardsModal from '../modals/MyCardsModal'
import MySecretsModal from '../modals/MySecretsModal'
import PostsHistory from '../cards/PostsHistory'
import { selectEffects } from '../../effects/effectsSlice'

interface Props {
    height: number;
}
export default function PlayMenu(props: Props) {
    const myTask = useSelector(selectMyTask)
    const myPlayer = useSelector(selectMyPlayer)
    const players = useSelector(selectPlayers)
    const myEffects = useSelector(selectMyEffects)
    const mySecrets = useSelector(selectMySecrets)
    const myCards = useSelector(selectMyCards)
    const effects = useSelector(selectEffects)
    const dispatch = useDispatch()

    const [showEndModal, setShowEndModal] = useState(false)
    const [showDropModal, setShowDropModal] = useState(false)
    const [showRerollModal, setShowRerollModal] = useState(false)
    const [showMyEffectsModal, setShowMyEffectsModal] = useState(false)
    const [showMyCardsModal, setShowMyCardsModal] = useState(false)
    const [showMySecretsModal, setShowMySecretsModal] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    function handleEndTask() {
        setIsLoading(true)
        axios.post(`/api/game/endtask`)
            .then((response) => {
                setShowEndModal(false)
                dispatch(updateTask({ id: -1, wheelItem: undefined }))
                dispatch(newToast({
                    id: Math.random(),
                    date: `${Date.now()}`,
                    type: 'success',
                    title: 'Контент Завершен',
                    autohide: 10000,
                    text: `+${response.data.addedPoints} очков (${response.data.newPoints} всего)`,
                }))
                setIsLoading(false)
            },
                (err) => {
                    dispatch(newToast({
                        id: Math.random(),
                        date: `${Date.now()}`,
                        type: 'error',
                        title: 'Ошибка',
                        text: err.response.data,
                    }))
                    setIsLoading(false)
                })
    }
    function handleDropTask() {
        setIsLoading(true)
        axios.post(`/api/game/droptask`)
            .then((response) => {
                setShowDropModal(false)
                if (response.status === 248) {
                    dispatch(updateTask({ skippable: false }))
                    dispatch(newToast({
                        id: Math.random(),
                        date: `${Date.now()}`,
                        type: 'info',
                        title: 'Пососешщ, ок?',
                        autohide: 10000,
                        text: `${response.data}`,
                    }))
                }
                else {
                    dispatch(updateTask({ id: -1, wheelItem: undefined }))

                    dispatch(newToast({
                        id: Math.random(),
                        date: `${Date.now()}`,
                        type: 'success',
                        title: 'Дроп произведен',
                        autohide: 10000,
                        text: `-${response.data.addedPoints} очков (${response.data.newPoints} всего)`,
                    }))
                }
                setIsLoading(false)
            },
                (err) => {
                    setIsLoading(false)
                    dispatch(newToast({
                        id: Math.random(),
                        date: `${Date.now()}`,
                        type: 'error',
                        title: 'Ошибка',
                        text: err.response.data,
                    }))
                })
    }
    function handleRerollTask() {
        setIsLoading(true)
        setShowRerollModal(false)
        axios.post(`/api/game/rerolltask`)
            .then((response) => {
                setShowDropModal(false)
                dispatch(updateTask({ id: -1, wheelItem: undefined }))
                dispatch(newToast({
                    id: Math.random(),
                    date: `${Date.now()}`,
                    type: 'success',
                    title: 'Реролл произведен',
                    autohide: 10000,
                    text: `-${response.data.addedPoints} очков (${response.data.newPoints} всего)`,
                }))
                setIsLoading(false)
            },
                (err) => {
                    dispatch(newToast({
                        id: Math.random(),
                        date: `${Date.now()}`,
                        type: 'error',
                        title: 'Ошибка',
                        text: err.response.data,
                    }))
                    setIsLoading(false)
                })
    }
    const betterPlayers = players.players?.filter(x => myPlayer.player && x.points > myPlayer.player.points)
    return <Scrollbars autoHeight autoHeightMin={props.height} autoHeightMax={props.height}>
        <Container className='my-3' fluid>
            <Modal contentClassName='bg-dark' show={showEndModal} animation={true} centered >
                {showEndModal && myTask.task && <EndModal
                    isLoading={isLoading}
                    task={myTask.task.wheelItem}
                    onCancel={() => setShowEndModal(false)}
                    onAccept={handleEndTask}
                />}
            </Modal>
            <Modal contentClassName='bg-dark' show={showDropModal} animation={true} centered >
                {showDropModal && myTask.task && <DropModal
                    isLoading={isLoading}
                    task={myTask.task.wheelItem}
                    onCancel={() => setShowDropModal(false)}
                    onAccept={handleDropTask}
                    free={!!myEffects.effects?.find(x => x.effect.id === 51)}
                />}
            </Modal>
            <Modal contentClassName='bg-dark' show={showRerollModal} animation={true} centered >
                {showRerollModal && myTask.task && <RerollModal
                    isLoading={isLoading}
                    task={myTask.task.wheelItem}
                    onCancel={() => setShowRerollModal(false)}
                    onAccept={handleRerollTask}
                />}
            </Modal>
            <Modal contentClassName='bg-dark' show={showMyEffectsModal && myEffects.effects && myEffects.effects.length > 0} animation={true} centered size='xl' onHide={() => setShowMyEffectsModal(false)}>
                {showMyEffectsModal && myEffects.effects && <MyEffectsModal
                    effects={myEffects.effects}
                    onAccept={() => setShowMyEffectsModal(false)}
                />}
            </Modal>
            <Modal contentClassName='bg-dark' show={showMyCardsModal && myCards.cards && myCards.cards.length > 0} animation={true} centered size='xl' onHide={() => setShowMyCardsModal(false)}>
                {showMyCardsModal && myCards.cards && <MyCardsModal
                    cards={myCards.cards}
                    onAccept={() => setShowMyCardsModal(false)}
                />}
            </Modal>
            <Modal contentClassName='bg-dark' show={showMySecretsModal && mySecrets.secrets && mySecrets.secrets.length > 0} animation={true} centered size='xl' onHide={() => setShowMySecretsModal(false)}>
                {showMySecretsModal && mySecrets.secrets && <MySecretsModal
                    secrets={mySecrets.secrets}
                    onAccept={() => setShowMySecretsModal(false)}
                />}
            </Modal>
            <Row>
                <Col md={3} xs={12}>
                    {myTask.task && myEffects.effects ? (myTask.task.wheelItem ?
                        <TaskPreview headerText='Текущий контент' task={myTask.task.wheelItem} /> :
                        <GetNewTaskPrompt effectPrompt={myEffects.effects.find(x => x.effect?.id === 35) ? true : false} />) :
                        <LoadingDots />
                    }
                    <Card className='bg-dark  mt-3'>
                        <Card.Header><h3>Кнопки</h3></Card.Header>
                        <Card.Body>
                            {myTask.task?.wheelItem &&
                                <Button disabled={!myTask.task?.wheelItem} variant="primary" className='float-right w-100 mb-3' onClick={() => setShowEndModal(true)}>Завершить</Button>
                            }
                            {myTask.task?.wheelItem && myTask.task.skippable &&
                                <Button disabled={!myTask.task?.wheelItem} variant="danger" className='float-right w-100 mb-3' onClick={() => setShowRerollModal(true)}>Реролл</Button>
                            }
                            {myTask.task?.wheelItem && myTask.task.skippable &&
                                <Button disabled={!myTask.task?.wheelItem} variant={myEffects.effects?.find(x => x.effect.id === 51) ? `warning` : `danger`} className='float-right w-100 mb-3' onClick={() => setShowDropModal(true)}>Дроп</Button>
                            }
                            <Button disabled={!myEffects.effects || myEffects.effects.length === 0} variant="secondary"
                                onClick={() => setShowMyEffectsModal(true)}
                                className='float-right w-100 mb-3'
                            >
                                Мои эффекты ({myEffects.effects ? myEffects.effects.length : `...`})
                            </Button>
                            <Button disabled={!myCards.cards || myCards.cards.length === 0} variant="secondary"
                                onClick={() => setShowMyCardsModal(true)}
                                className='border-info float-right w-100 mb-3'
                            >
                                Мои карточки ({myCards.cards ? myCards.cards.length : `...`})
                            </Button>
                            <Button disabled={!mySecrets.secrets || mySecrets.secrets.length === 0} variant="secondary"
                                onClick={() => setShowMySecretsModal(true)}
                                className='border-warning float-right w-100 mb-3'
                            >
                                Мои секреты ({mySecrets.secrets ? mySecrets.secrets.length : `...`})
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={7} md={6} xs={12}>
                    <PostsHistory players={players.players} effects={effects.effects} />
                    <MyStatsHistory players={players.players} />
                </Col>
                <Col xl={2} md={3} xs={12}>
                    {myPlayer.player ?
                        <PlayerAboutCard
                            player={myPlayer.player}
                            points
                            place={betterPlayers?.length} /> :
                        <LoadingDots />}
                </Col>
            </Row>
        </Container >
    </Scrollbars>
}