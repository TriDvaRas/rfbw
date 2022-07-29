import { useSession } from 'next-auth/react';
import Head from "next/head";
import { useRouter } from 'next/router';
import { Alert, Button, Card, Col, Collapse, Modal, Row } from 'react-bootstrap';
import GamePreview from "../../../components/game/GamePreview";
import LoadingDots from "../../../components/LoadingDots";
import { NotAPlayerCard } from "../../../components/NotAPlayerCard";
import useGame from '../../../data/useGame';
import GetGameLayout from "../../../layouts/game";
import { NextPageWithLayout } from "../../_app";
import PHCard from '../../../util/PHCard';
import GetThinLayout from '../../../layouts/thin';
import usePlayerTasks from '../../../data/usePlayerTasks';
import WheelItemPreview from '../../../components/effect/EffectPreview';
import TaskWheelItemPreview from '../../../components/wheelItem/TaskWheelItemPreview';
import useWheelItem from '../../../data/useWheelItem';
import NewButton from '../../../components/NewButton';
import { useState } from 'react';
import { formatPointsString } from '../../../util/lines';
import axios from 'axios';
import { GameTaskEndResult } from '../../../types/game';
import { parseApiError } from '../../../util/error';
import { ApiError } from '../../../types/common-api';
import useGamePlayers from '../../../data/useGamePlayers';
import GamePlayerStats from '../../../components/player/GamePlayerStats';
import moment from 'moment';
import useGameEvents from '../../../data/useGameEvents';
import GameEventPreview from '../../../components/player/GameEventPreview';

const GameHome: NextPageWithLayout = () => {
    const session = useSession()
    const router = useRouter()
    const gameId = router.query.gameId as string
    const game = useGame(gameId)
    const playerTasks = usePlayerTasks(gameId, session.data?.user.id)
    const activeTasks = playerTasks.tasks?.filter(x => !x.result)
    const activeTask = activeTasks && activeTasks[0]
    const activeTaskItem = useWheelItem(activeTask?.wheelItemId)
    const gamePlayers = useGamePlayers(gameId)
    const events = useGameEvents(gameId)

    const [error, setError] = useState<ApiError | undefined>(undefined)
    const [isLoading, setIsLoading] = useState(false)
    const [showEndModal, setShowEndModal] = useState(false)
    const [showDropModal, setShowDropModal] = useState(false)
    const [showSkipModal, setShowSkipModal] = useState(false)

    //#region handlers
    function handleEnd(type: 'end' | 'drop' | 'skip') {
        if (!activeTask || !session.data)
            return
        setError(undefined)
        setIsLoading(true)
        axios.post<GameTaskEndResult>(`/api/games/${gameId}/players/${session.data.user.id}/tasks/${type}`, {
            wheelItemId: activeTask.wheelItemId,
        })
            .then(res => res.data)
            .then((result) => {
                setShowEndModal(false)
                setShowDropModal(false)
                setShowSkipModal(false)
                setIsLoading(false)
                playerTasks.mutate(undefined)
                gamePlayers.mutate(undefined)
                events.mutate(undefined)
            },
                (err) => {
                    setError(parseApiError(err))
                })
    }
    //#endregion
    if (game.error) {
        return game.error.status == 433 ? <NotAPlayerCard /> :
            <Alert className='mb-0' variant={'danger'}>
                {game.error.error}
            </Alert>
    }
    if (!gamePlayers.players)
        return <LoadingDots />
    const gamePLayer = gamePlayers.players.find(x => session.data && x.playerId == session.data.user.id)

    return <>
        <Head>
            <title>{game.game?.name || 'Игра'}</title>
        </Head>
        {
            session.status == 'loading' || game.loading ?
                <LoadingDots /> :
                <Row >
                    <Col xl={12} >
                        {game.game && <GamePreview game={game.game} />}
                    </Col>
                    {/* playerTask */}
                    {gamePLayer && <Col xl={6} className='mb-3'>
                        {
                            playerTasks.loading ? <PHCard loading height={250} /> :
                                activeTaskItem.item && <TaskWheelItemPreview className='m-0 p-0' height={250} item={activeTaskItem.item} />
                        }
                        {
                            activeTasks && !activeTask && <NewButton text={'Получить контент'} onClick={() => router.push(`/games/${gameId}/spin`)} />
                        }
                        {activeTask &&
                            <Col xl={12} className='mt-2 d-flex align-items-center justify-content-center'>
                                <Button onClick={() => setShowEndModal(true)} className='me-2'>Завершить</Button>
                                <Button onClick={() => setShowSkipModal(true)} className='me-2' variant='warning'>Реролл</Button>
                                <Button onClick={() => setShowDropModal(true)} className='me-2' variant='danger'>Дроп</Button>
                            </Col>
                        }
                    </Col>}
                    {/* effects */}
                    {gamePLayer && <Col xl={6} className='mb-3'>
                        <PHCard height={activeTask ? 'calc(288px + 0.5rem)' : 250} >
                            <div>Эффекты еще не изобрели</div>
                            <i className="fs-1 bi bi-emoji-smile"></i>
                        </PHCard>
                    </Col>}
                    {/* coop */}
                    {gamePLayer && <Collapse in={activeTaskItem.item && (activeTaskItem.item.hasCoop && activeTaskItem.item.maxCoopPlayers > 1 || activeTaskItem.item.type !== 'game')}>
                        <Col xl={12} className='mb-3'>
                            <PHCard height={150} >
                                <div>Кооп тоже</div>
                                <i className="fs-1 bi bi-emoji-smile"></i>
                            </PHCard>
                        </Col>
                    </Collapse>}
                    {/* Stats */}
                    <Col xl={9} className='mt-5 mb-3'>
                        <h1 className='ms-3 mb-3'>Участники</h1>
                        {gamePlayers.players?.sort((a, b) => b.points - a.points).map(gp => <GamePlayerStats key={gp.playerId} className='mb-3' gamePlayer={gp} />)}
                    </Col>
                    {/* Events */}
                    <Col xl={3} className='mt-5  mb-3'>
                        <h1 className='ms-3 mb-3'>События</h1>
                        {events.events?.map(x => <GameEventPreview key={x.id} className='mb-3' gameEvent={x} />)}
                    </Col>



                    {/* //!MODALS */}
                    {/* end */}
                    <Modal contentClassName='border-dark shadow' show={!!showEndModal && !!activeTaskItem} animation={true} centered >
                        <Modal.Header className='bg-dark-750 text-light border-dark'><h3>Завершение контента</h3></Modal.Header>
                        {
                            activeTaskItem.item && <Modal.Body className='bg-dark text-light border-dark'>
                                За завершение ты получишь <b className='text-success'>{formatPointsString(activeTaskItem.item.hours * 10)}</b>.
                                При обнружении абуза ты потеряешь полученные за завершение очки (<b className='text-danger'>{formatPointsString(activeTaskItem.item.hours * 10)}</b>) и уплатишь штраф (<b className='text-danger'>{formatPointsString(activeTaskItem.item.hours * 10)}</b>)
                            </Modal.Body>
                        }

                        <Modal.Footer className='bg-dark-750 text-light border-dark'>
                            <Button variant='primary' disabled={isLoading} className='float-right' onClick={() => handleEnd('end')}>Завершить</Button>
                            <Button variant='secondary' disabled={isLoading} className='float-right mx-3' onClick={() => setShowEndModal(false)}>Отмена</Button>
                        </Modal.Footer>
                    </Modal>
                    {/* drop */}
                    <Modal contentClassName='border-dark shadow' show={!!showDropModal && !!activeTaskItem} animation={true} centered >
                        <Modal.Header className='bg-dark-750 text-light border-dark'><h3>Дроп контента</h3></Modal.Header>
                        {
                            activeTaskItem.item && <Modal.Body className='bg-dark text-light border-dark'>
                                За дроп ты потеряешь <b className='text-danger'>{formatPointsString(activeTaskItem.item.hours * 5)}</b>.
                            </Modal.Body>
                        }

                        <Modal.Footer className='bg-dark-750 text-light border-dark'>
                            <Button variant='danger' disabled={isLoading} className='float-right' onClick={() => handleEnd('drop')}>Завершить</Button>
                            <Button variant='secondary' disabled={isLoading} className='float-right mx-3' onClick={() => setShowDropModal(false)}>Отмена</Button>
                        </Modal.Footer>
                    </Modal>
                    {/* skip */}
                    <Modal contentClassName='border-dark shadow' show={!!showSkipModal && !!activeTaskItem} animation={true} centered >
                        <Modal.Header className='bg-dark-750 text-light border-dark'><h3>Реролл контента</h3></Modal.Header>
                        {
                            activeTaskItem.item && <Modal.Body className='bg-dark text-light border-dark'>
                                За реролл ты не потеряешь очков, но ты должен будешь доказать что уже играл/смотрел данный контент (если кто то доебется).
                                После реролла нельзя сменить колесо игрока для следующего прокрута.
                                При обнружении абуза ты потеряешь  <b className='text-danger'>{formatPointsString(activeTaskItem.item.hours * 10)}</b>.
                            </Modal.Body>
                        }

                        <Modal.Footer className='bg-dark-750 text-light border-dark'>
                            <Button variant='danger' disabled={isLoading} className='float-right' onClick={() => handleEnd('skip')}>Завершить</Button>
                            <Button variant='secondary' disabled={isLoading} className='float-right mx-3' onClick={() => setShowSkipModal(false)}>Отмена</Button>
                        </Modal.Footer>
                    </Modal>
                </Row>
        }
    </>
}
GameHome.getLayout = GetThinLayout
export default GameHome
