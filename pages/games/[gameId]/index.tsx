import axios from 'axios';
import { useSession } from 'next-auth/react';
import Head from "next/head";
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Alert, Button, Card, Col, Collapse, Form, Modal, Row } from 'react-bootstrap';
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
import CoopCard from '../../../components/game/CoopCard';
import useGameCoopTasks from '../../../data/useGameCoopTasks';
import GetSocketLayout from '../../../layouts/socket';
import ReactTimeago from 'react-timeago';
//@ts-ignore
import ruLocale from 'react-timeago/lib/language-strings/ru'
//@ts-ignore
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter'
import PlayerEffectsList from '../../../components/effect/PlayerEffectsList';
const formatter = buildFormatter(ruLocale)

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
    const childTasks = useGameCoopTasks(activeTask?.gameId, activeTask?.id)

    const [error, setError] = useState<ApiError | undefined>(undefined)
    const [isLoading, setIsLoading] = useState(false)
    const [showEndModal, setShowEndModal] = useState(false)
    const [showEndCoopModal, setShowEndCoopModal] = useState(false)
    const [showDropModal, setShowDropModal] = useState(false)
    const [showSkipModal, setShowSkipModal] = useState(false)
    const player = gamePlayers.players?.find(p => p.playerId == session.data?.user.id)
    const [unfinishedCoopTaskIds, setUnfinishedCoopTaskIds] = useState<string[]>([])
    const [showEffects, setShowEffects] = useState<boolean>(false)
    //#region handlers
    function revalidateAll() {
        playerTasks.mutate(undefined)
        gamePlayers.mutate(undefined)
        events.mutate(undefined)
        playerEffects.mutate(undefined)
    }
    function handleEnd(type: 'end' | 'drop' | 'skip' | 'endCoop') {
        if (!activeTask || !session.data || !childTasks.tasks)
            return

        setError(undefined)
        setIsLoading(true)
        if (activeTask.fromCoop)
            axios.post<GameTaskEndResult>(`/api/games/${gameId}/coop/${activeTask.coopParentId}/leave`, {
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
        else if (type == 'endCoop')
            axios.post<GameTaskEndResult>(`/api/games/${gameId}/coop/${activeTask.id}/end`, {
                wheelItemId: activeTask.wheelItemId,
                finishedChildrenIds: childTasks.tasks.filter(x => !unfinishedCoopTaskIds.includes(x.id)).map(x => x.id)
            })
                .then(res => res.data)
                .then((result) => {
                    setShowEndCoopModal(false)
                    setIsLoading(false)
                    revalidateAll()
                },
                    (err) => {
                        setError(parseApiError(err))
                    })
        else
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
    const question = playerEffects.states?.sort((a, b) => new Date(b.createdAt) > new Date(a.createdAt) ? -1 : 0).find(x => x.vars?.question) as GameEffectStateWithEffectWithPlayer<EffectStateQuestionVars> | undefined
    const now = new Date()
    const gameIsActive = game.game && new Date(game.game.startsAt) < now && now < new Date(game.game.endsAt)
    const gameEnded = game.game && Date.parse(game.game.endsAt) - Date.now()
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
                    {gameIsActive == false && game.game && gameEnded !== undefined && gameEnded > 0 &&
                        <Col xs={12} className='d-flex justify-content-center'>
                            <Card bg='dark' className='mb-3' style={{ borderRadius: '16px' }}>
                                <Card.Body>
                                    <Card.Title className='text-center'>К чему собственно спешка? Битва начнется</Card.Title>
                                    <h1 className='text-center'><ReactTimeago date={game.game?.startsAt} formatter={formatter} /></h1>
                                </Card.Body>
                            </Card>
                        </Col>}
                    {game.game && gameEnded && gameEnded > 0 && gameEnded < 3600000 && < Col xs={12} className='d-flex justify-content-center'>
                        <Card bg='dark' className='mb-3' style={{ borderRadius: '16px' }}>
                            <Card.Body>
                                <Card.Title className='text-center'>Вот теперь спешка уместна. Битва закончится</Card.Title>
                                <h1 className='text-center'><ReactTimeago date={game.game.endsAt} formatter={formatter} /></h1>
                            </Card.Body>
                        </Card>
                    </Col>}
                    {game.game && gameEnded && gameEnded < 0 && < Col xs={12} className='d-flex justify-content-center'>
                        <Card bg='dark' className='mb-3' style={{ borderRadius: '16px' }}>
                            <Card.Body>
                                <Card.Title className='text-center'>К чему собственно спешка? Битва закончилась</Card.Title>
                                <h1 className='text-center'><ReactTimeago date={game.game.endsAt} formatter={formatter} /></h1>
                            </Card.Body>
                        </Card>
                    </Col>}
                    {/* playerTask */}

                    {gamePLayer && gameIsActive &&
                        <Col xl={6} className='mb-5'>
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
                            {activeTask && childTasks.tasks &&
                                (
                                    activeTask.fromCoop ?
                                        <Col xl={12} className='mt-2 d-flex align-items-center justify-content-center'>
                                            {/* <Button disabled className='me-2' variant='secondary'>Завершить</Button> */}
                                            {/* <Button onClick={() => setShowSkipModal(true)} className='me-2' variant='warning'>Реролл</Button> */}
                                            <Button onClick={() => setShowDropModal(true)} className='me-2' variant='danger'>Покинуть кооп</Button>
                                        </Col>
                                        :
                                        childTasks.tasks.filter(x => !x.result).length > 0 ?
                                            <Col xl={12} className='mt-2 d-flex align-items-center justify-content-center'>
                                                <Button onClick={() => setShowEndCoopModal(true)} className='me-2'>Завершить кооп</Button>
                                                <Button disabled className='me-2' variant='secondary'>Реролл</Button>
                                                <Button disabled className='me-2' variant='secondary'>Дроп</Button>
                                            </Col>
                                            :
                                            <Col xl={12} className='mt-2 d-flex align-items-center justify-content-center'>
                                                <Button onClick={() => setShowEndModal(true)} className='me-2'>Завершить</Button>
                                                <Button onClick={() => setShowSkipModal(true)} className='me-2' variant='warning' disabled={activeTaskItem.item?.wheelId === '5a698d76-5676-4f2e-934e-c98791ad58ca'}>Реролл</Button>
                                                <Button onClick={() => setShowDropModal(true)} className='me-2' variant='danger'>Дроп</Button>
                                            </Col>
                                )
                            }
                        </Col>
                    }
                    {/* effects */}
                    {gamePLayer && gameIsActive && <Col xl={6} className='mb-3'>
                        <h1 className='ms-3 mb-3'>Эффекты</h1>
                        <div className='px-3 d-flex flex-wrap'>
                            {playerEffects.states?.length === 0}
                            {!playerEffects.states ? <LoadingDots /> : playerEffects.states?.map(x => <EffectStatePreview key={x.id} className='mb-3 me-2' effectState={x} />)}
                        </div>
                    </Col>}
                    {/* coop */}
                    {gamePLayer && <Collapse in={activeTaskItem.item && (
                        (activeTaskItem.item.hasCoop && activeTaskItem.item.maxCoopPlayers > 1)
                        || activeTaskItem.item.type !== 'game'
                    )}>
                        <Col xl={12} className='mb-3'>
                            <h1 className='ms-3 mb-3'>Кооп</h1>
                            {gamePlayers.players && activeTask && activeTaskItem.item && <CoopCard item={activeTaskItem.item} currentTask={activeTask} players={gamePlayers.players} />}
                        </Col>
                    </Collapse>}
                    {/* Stats */}
                    <Col className='mt-5 mb-3'>
                        <div className='d-flex'>
                            <h1 className='ms-3 mb-3 me-auto'>Участники</h1>
                            <Button variant='secondary' className='my-auto' onClick={() => setShowEffects(!showEffects)}>Эффекты</Button>
                        </div>
                        {gamePlayers.players?.sort((a, b) => b.points - a.points).map(gp => <div key={gp.playerId}>
                            <GamePlayerStats className='mb-3' gamePlayer={gp} />
                            <Collapse appear in={showEffects}>
                                <div>
                                    {<PlayerEffectsList gameId={gameId} playerId={gp.playerId} />}
                                </div>
                            </Collapse>
                        </div>)}
                    </Col>
                    {/* Events */}
                    {events.events?.length !== 0 && <Col xl={3} className='mt-5  mb-3'>
                        <h1 className='ms-3 mb-3'>История</h1>
                        {events.events?.map(x => <GameEventPreview key={x.id} className='mb-3' gameEvent={x} />)}
                        {events.events && events.canLoadMore ? <Button variant='outline-secondary' disabled={events.isLoading || events.isLoadingMore} className='text-light w-100' onClick={() => {
                            events.loadMore()
                        }}>{events.isLoadingMore ? <LoadingDots size='sm' /> : 'Еще'}</Button> : null}
                    </Col>}



                    {/* //!MODALS */}
                    {/* end coop */}
                    <Modal contentClassName='border-dark shadow' show={!!showEndCoopModal && !!activeTaskItem} animation={true} centered >
                        <Modal.Header className='bg-dark-750 text-light border-dark'><h3>Завершение кооп контента</h3></Modal.Header>
                        <Modal.Body className='bg-dark text-light border-dark'>
                            <Card.Title ><b>Выбери завершивших игроков</b></Card.Title>
                            <div className='d-flex '>
                                <h4>{player?.player.name}</h4>
                                <Form.Check className='ms-auto mt-1' type={'switch'} label='' disabled defaultChecked={true} />

                            </div>
                            {
                                childTasks.tasks?.map(x => {
                                    const gp = gamePlayers.players?.find(p => p.playerId == x.playerId)
                                    return gp ? <div key={x.playerId} className='d-flex '>
                                        <h4>{gp.player.name}</h4>
                                        <Form.Check className='ms-auto mt-1' type={'switch'} label='' disabled={isLoading} defaultChecked={true} onChange={e => {
                                            if (e.target.checked)
                                                setUnfinishedCoopTaskIds(unfinishedCoopTaskIds.filter(id => id !== x.id))
                                            else
                                                setUnfinishedCoopTaskIds([...unfinishedCoopTaskIds, x.id])
                                            // handleChange({ locked: e.target.checked })
                                        }} />

                                    </div> : <div key={x.playerId} />
                                })
                            }
                            {

                            }
                            {
                                activeTaskItem.item && (
                                    activeTaskItem.item.wheelId === '5a698d76-5676-4f2e-934e-c98791ad58ca' ?
                                        <div className='mt-1'>
                                            Каждый завершивший игрок получит <b className='text-warning'>{formatPointsString(Math.round(activeTaskItem.item.hours * 10 * ((childTasks.tasks?.length || 0) - unfinishedCoopTaskIds.length + 1) / activeTaskItem.item.maxCoopPlayers))}</b>. Собрав полный кооп можно получить <b className='text-success'>{formatPointsString(activeTaskItem.item.hours * 10)}</b>.
                                            При обнружении абуза или наеба собутыльников ты потеряешь полученные за завершение очки (<b className='text-danger'>{formatPointsString(Math.round(activeTaskItem.item.hours * 10 * ((childTasks.tasks?.length || 0) - unfinishedCoopTaskIds.length + 1) / activeTaskItem.item.maxCoopPlayers))}</b>) и уплатишь штраф (<b className='text-danger'>{formatPointsString(activeTaskItem.item.hours * 10)}</b>)
                                        </div> :
                                        <div className='mt-1'>
                                            Каждый завершивший игрок получит <b className='text-success'>{formatPointsString(activeTaskItem.item.hours * 10)}</b>.
                                            При обнружении абуза или наеба собутыльников ты потеряешь полученные за завершение очки (<b className='text-danger'>{formatPointsString(activeTaskItem.item.hours * 10)}</b>) и уплатишь штраф (<b className='text-danger'>{formatPointsString(activeTaskItem.item.hours * 10)}</b>)
                                        </div>)
                            }

                            {
                                error && <Alert className='mb-0 my-2' variant={'danger'}>
                                    {error.error}
                                </Alert>
                            }
                        </Modal.Body>
                        <Modal.Footer className='bg-dark-750 text-light border-dark'>
                            <Button variant='secondary' disabled={isLoading} className='float-right mx-3' onClick={() => setShowEndCoopModal(false)}>Отмена</Button>
                            <Button variant='primary' disabled={isLoading} className='float-right' onClick={() => handleEnd('endCoop')}>Завершить</Button>
                        </Modal.Footer>
                    </Modal>
                    {/* end */}
                    <Modal contentClassName='border-dark shadow' show={!!showEndModal && !!activeTaskItem} animation={true} centered >
                        <Modal.Header className='bg-dark-750 text-light border-dark'><h3>Завершение контента</h3></Modal.Header>
                        <Modal.Body className='bg-dark text-light border-dark'>
                            {
                                activeTaskItem.item && (
                                    activeTaskItem.item.wheelId === '5a698d76-5676-4f2e-934e-c98791ad58ca' ?
                                        <div >
                                            За завершение ты получишь только <b className='text-warning'>{formatPointsString(Math.round(activeTaskItem.item.hours * 10 / activeTaskItem.item.maxCoopPlayers))}</b>. Собрав полный кооп можно получить <b className='text-success'>{formatPointsString(activeTaskItem.item.hours * 10)}</b>.
                                            При обнаружении абуза ты потеряешь полученные за завершение очки (<b className='text-danger'>{formatPointsString(Math.round(activeTaskItem.item.hours * 10 / activeTaskItem.item.maxCoopPlayers))}</b>) и уплатишь штраф (<b className='text-danger'>{formatPointsString(activeTaskItem.item.hours * 10)}</b>)
                                        </div> :
                                        <div >
                                            За завершение ты получишь <b className='text-success'>{formatPointsString(activeTaskItem.item.hours * 10)}</b>.
                                            При обнаружении абуза ты потеряешь полученные за завершение очки (<b className='text-danger'>{formatPointsString(activeTaskItem.item.hours * 10)}</b>) и уплатишь штраф (<b className='text-danger'>{formatPointsString(activeTaskItem.item.hours * 10)}</b>)
                                        </div>
                                )
                            }

                            {
                                error && <Alert className='mb-0 my-2' variant={'danger'}>
                                    {error.error}
                                </Alert>
                            }
                        </Modal.Body>
                        <Modal.Footer className='bg-dark-750 text-light border-dark'>
                            <Button variant='secondary' disabled={isLoading} className='float-right mx-3' onClick={() => setShowEndModal(false)}>Отмена</Button>
                            <Button variant='primary' disabled={isLoading} className='float-right' onClick={() => handleEnd('end')}>Завершить</Button>
                        </Modal.Footer>
                    </Modal>
                    {/* drop */}
                    <Modal contentClassName='border-dark shadow' show={!!showDropModal && !!activeTaskItem} animation={true} centered >
                        <Modal.Header className='bg-dark-750 text-light border-dark'><h3>Дроп контента</h3></Modal.Header>
                        <Modal.Body className='bg-dark text-light border-dark'>
                            {
                                activeTaskItem.item && activeTask &&
                                (
                                    activeTask.fromCoop ?
                                        <div >
                                            После выхода из коопа текущий контент вернется на колесо. <b>Вы не сможете вернуться в кооп который вы уже покинули.</b>
                                        </div>
                                        :
                                        activeTaskItem.item.wheelId === '5a698d76-5676-4f2e-934e-c98791ad58ca' ?
                                            <div >
                                                За дроп групповой мастурбации ты ничего не потеряешь.
                                            </div>
                                            :
                                            (playerEffects.states?.find(x => x.effect.lid == 19) ?
                                                <div >
                                                    За дроп ты потеряешь <b className='text-warning'>0 очков</b> и эффект <b className='text-success'>Подкуп судьи</b>.
                                                </div> :
                                                <div>За дроп ты потеряешь <b className='text-danger'>{formatPointsString(activeTaskItem.item.hours * 5)}</b>.</div>
                                            )
                                )

                            }
                            {
                                error && <Alert className='mb-0 my-2' variant={'danger'}>
                                    {error.error}
                                </Alert>
                            }
                        </Modal.Body >
                        <Modal.Footer className='bg-dark-750 text-light border-dark'>
                            <Button variant='secondary' disabled={isLoading} className='float-right mx-3' onClick={() => setShowDropModal(false)}>Отмена</Button>
                            <Button variant='danger' disabled={isLoading} className='float-right' onClick={() => handleEnd('drop')}>Завершить</Button>
                        </Modal.Footer>
                    </Modal>
                    {/* skip */}
                    <Modal contentClassName='border-dark shadow' show={!!showSkipModal && !!activeTaskItem} animation={true} centered >
                        <Modal.Header className='bg-dark-750 text-light border-dark'><h3>Реролл контента</h3></Modal.Header>
                        <Modal.Body className='bg-dark text-light border-dark'>
                            {
                                activeTaskItem.item && <div className='bg-dark text-light border-dark'>
                                    За реролл ты не потеряешь очков, но должен будешь доказать что уже играл/смотрел данный контент (если кто то доебется).
                                    После реролла нельзя сменить колесо игрока для следующего прокрута.
                                    При обнружении абуза ты потеряешь  <b className='text-danger'>{formatPointsString(activeTaskItem.item.hours * 10)}</b>.
                                </div>
                            }
                            {
                                error && <Alert className='mb-0 my-2' variant={'danger'}>
                                    {error.error}
                                </Alert>
                            }
                        </Modal.Body>
                        <Modal.Footer className='bg-dark-750 text-light border-dark'>
                            <Button variant='secondary' disabled={isLoading} className='float-right mx-3' onClick={() => setShowSkipModal(false)}>Отмена</Button>
                            <Button variant='danger' disabled={isLoading} className='float-right' onClick={() => handleEnd('skip')}>Завершить</Button>
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
GameHome.getLayout = GetSocketLayout
export default GameHome
