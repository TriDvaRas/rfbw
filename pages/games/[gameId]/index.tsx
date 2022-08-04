import axios from 'axios';
import { useSession } from 'next-auth/react';
import Head from "next/head";
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Alert, Button, Col, Collapse, Modal, Row } from 'react-bootstrap';
import EffectStatePreview from '../../../components/effect/EffectStatePreview';
import GamePreview from "../../../components/game/GamePreview";
import LoadingDots from "../../../components/LoadingDots";
import NewButton from '../../../components/NewButton';
import { NotAPlayerCard } from "../../../components/NotAPlayerCard";
import GameEventPreview from '../../../components/player/GameEventPreview';
import GamePlayerStats from '../../../components/player/GamePlayerStats';
import TaskWheelItemPreview from '../../../components/wheelItem/TaskWheelItemPreview';
import useGame from '../../../data/useGame';
import useGameEvents from '../../../data/useGameEvents';
import useGamePlayers from '../../../data/useGamePlayers';
import usePlayerEffectStates from '../../../data/usePlayerEffects';
import usePlayerTasks from '../../../data/usePlayerTasks';
import useWheelItem from '../../../data/useWheelItem';
import GetThinLayout from '../../../layouts/thin';
import { ApiError } from '../../../types/common-api';
import { GameTaskEndResult } from '../../../types/game';
import { parseApiError } from '../../../util/error';
import { formatPointsString } from '../../../util/lines';
import PHCard from '../../../util/PHCard';
import { NextPageWithLayout } from "../../_app";
import { GameEffectState, GameEffectStateWithEffectWithPlayer } from '../../../database/db';
import { EffectStateQuestionVars } from '../../../types/effectStateVars';
import QuestionModal from '../../../components/game/QuestionModal';

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
    const playerEffects = usePlayerEffectStates(gameId, session.data?.user.id)

    const [error, setError] = useState<ApiError | undefined>(undefined)
    const [isLoading, setIsLoading] = useState(false)
    const [showEndModal, setShowEndModal] = useState(false)
    const [showDropModal, setShowDropModal] = useState(false)
    const [showSkipModal, setShowSkipModal] = useState(false)

    //#region handlers
    function revalidateAll() {
        playerTasks.mutate(undefined)
        gamePlayers.mutate(undefined)
        events.mutate(undefined)
        playerEffects.mutate(undefined)
    }
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
                revalidateAll()
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
    const canRollEffect = playerEffects.states?.find(x => x.effectId == '7c44ff0a-517c-49c2-be93-afb97b559a52')
    const question = playerEffects.states?.find(x => x.vars?.question) as GameEffectStateWithEffectWithPlayer<EffectStateQuestionVars> | undefined
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
                    {gamePLayer && <Col xl={6} className='mb-5'>
                        <h1 className='ms-3 mb-3'>Контент</h1>
                        {
                            playerTasks.loading ? <PHCard loading height={250} /> :
                                activeTaskItem.item && <TaskWheelItemPreview showComments className='m-0 p-0' height={200} item={activeTaskItem.item} />
                        }
                        {
                            activeTasks && !activeTask && (canRollEffect ?
                                <NewButton text={'Получить эффект'} className='mb-2' onClick={() => router.push(`/games/${gameId}/spineffects`)} /> :
                                <NewButton text={'Получить контент'} className='mb-2' onClick={() => router.push(`/games/${gameId}/spin`)} />)
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
                        <h1 className='ms-3 mb-3'>Эффекты</h1>
                        <div className='px-3 d-flex flex-wrap'>
                            {playerEffects.states?.length === 0}
                            {!playerEffects.states ? <LoadingDots /> : playerEffects.states?.map(x => <EffectStatePreview key={x.id} className='mb-3 me-2' effectState={x} />)}
                        </div>
                    </Col>}
                    {/* coop */}
                    {gamePLayer && <Collapse in={activeTaskItem.item && (activeTaskItem.item.hasCoop && activeTaskItem.item.maxCoopPlayers > 1 || activeTaskItem.item.type !== 'game')}>
                        <Col xl={12} className='mb-3'>
                            <PHCard height={150} >
                                <div>Кооп?</div>
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
                                За реролл ты не потеряешь очков, но должен будешь доказать что уже играл/смотрел данный контент (если кто то доебется).
                                После реролла нельзя сменить колесо игрока для следующего прокрута.
                                При обнружении абуза ты потеряешь  <b className='text-danger'>{formatPointsString(activeTaskItem.item.hours * 10)}</b>.
                            </Modal.Body>
                        }

                        <Modal.Footer className='bg-dark-750 text-light border-dark'>
                            <Button variant='danger' disabled={isLoading} className='float-right' onClick={() => handleEnd('skip')}>Завершить</Button>
                            <Button variant='secondary' disabled={isLoading} className='float-right mx-3' onClick={() => setShowSkipModal(false)}>Отмена</Button>
                        </Modal.Footer>
                    </Modal>
                    {/* question */}
                    <Modal contentClassName='bg-dark' show={!!question} animation={true} centered>
                        {question && <QuestionModal onOk={(e) => {
                            playerEffects.mutate(playerEffects.states?.filter(x => x.id !== e.id))
                            revalidateAll()
                        }} effectState={question} />}
                    </Modal>
                </Row>
        }
    </>
}
GameHome.getLayout = GetThinLayout
export default GameHome
