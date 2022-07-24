import { useSession } from 'next-auth/react';
import Head from "next/head";
import { useRouter } from 'next/router';
import { Alert, Button, Col, Collapse, Modal, Row } from 'react-bootstrap';
import GamePreview from "../../../components/game/GamePreview";
import LoadingDots from "../../../components/LoadingDots";
import { NotAPlayerCard } from "../../../components/NotAPlayerCard";
import useGame from '../../../data/useGame';
import GetGameLayout from "../../../layouts/game";
import { NextPageWithLayout } from "../../_app";
import PHCard from '../../../util/PHCard';
import GetThinLayout from '../../../layouts/thin';
import usePlayerTasks from '../../../data/usePlayerTasks';
import WheelItemPreview from '../../../components/wheelItem/WheelItemPreview';
import TaskWheelItemPreview from '../../../components/wheelItem/TaskWheelItemPreview';
import useWheelItem from '../../../data/useWheelItem';
import NewButton from '../../../components/NewButton';
import { useState } from 'react';
import { formatPointsString } from '../../../util/lines';
import axios from 'axios';
import { GameTaskEndResult } from '../../../types/game';
import { parseApiError } from '../../../util/error';
import { ApiError } from '../../../types/common-api';

const GameHome: NextPageWithLayout = () => {
    const session = useSession()
    const router = useRouter()
    const gameId = router.query.gameId as string
    const game = useGame(gameId)
    const playerTasks = usePlayerTasks(gameId, session.data?.user.id)
    const activeTasks = playerTasks.tasks?.filter(x => !x.result)
    const activeTask = activeTasks && activeTasks[0]
    const activeTaskItem = useWheelItem(activeTask?.wheelItemId)


    const [error, setError] = useState<ApiError | undefined>(undefined)
    const [isLoading, setIsLoading] = useState(false)
    const [showEndModal, setShowEndModal] = useState(false)

    if (game.error) {
        return game.error.status == 433 ? <NotAPlayerCard /> :
            <Alert className='mb-0' variant={'danger'}>
                {game.error.error}
            </Alert>
    }
    //#region handlers
    function handleEnd() {
        if (!activeTask || !session.data)
            return
        setError(undefined)
        setIsLoading(true)
        axios.post<GameTaskEndResult>(`/api/games/${gameId}/players/${session.data.user.id}/tasks/end`, {
            wheelItemId: activeTask.wheelItemId,
        })
            .then(res => res.data)
            .then((result) => {
                setShowEndModal(false)
                setIsLoading(false)
                playerTasks.mutate(undefined)
            },
                (err) => {
                    setError(parseApiError(err))
                })
    }
    //#endregion
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
                    <Col xl={6} className='mb-3'>
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
                                <Button onClick={() => { }} disabled className='me-2' variant='secondary'>Скип</Button>
                                <Button onClick={() => { }} disabled className='me-2' variant='danger'>Дроп</Button>
                                <Button onClick={() => { }} disabled className='me-2' variant='danger'>Реролл</Button>
                            </Col>
                        }
                    </Col>
                    <Col xl={6} className='mb-3'>
                        <PHCard height={activeTask ? 'calc(288px + 0.5rem)' : 250} >
                            <div>Эффекты еще не изобрели</div>
                            <i className="fs-1 bi bi-emoji-smile"></i>
                        </PHCard>
                    </Col>

                    <Collapse in={activeTaskItem.item && (activeTaskItem.item.hasCoop && activeTaskItem.item.maxCoopPlayers > 1 || activeTaskItem.item.type !== 'game')}>
                        <Col xl={12} className='mb-3'>
                            <PHCard height={150} >
                                <div>Кооп тоже</div>
                                <i className="fs-1 bi bi-emoji-smile"></i>
                            </PHCard>
                        </Col>
                    </Collapse>
                    <Col xl={9} className='mb-3'>
                        <PHCard height={880} >
                            <div>И стату</div>
                            <i className="fs-1 bi bi-emoji-smile"></i>
                        </PHCard>
                    </Col>
                    <Col xl={3} className='mb-3'>
                        <PHCard height={880} >
                            <div>А тут я забыл уже что должно быть</div>
                            <i className="fs-1 bi bi-emoji-smile-upside-down"></i>
                        </PHCard>
                    </Col>
                    <Modal contentClassName='border-dark shadow' show={!!showEndModal && !!activeTaskItem} animation={true} centered >
                        <Modal.Header className='bg-dark-750 text-light border-dark'><h3>Завершение контента</h3></Modal.Header>
                        {
                            activeTaskItem.item && <Modal.Body className='bg-dark text-light border-dark'>
                                За завершение ты получишь <b className='text-success'>{formatPointsString(activeTaskItem.item.hours * 10)}</b>.
                                При обнружении абуза ты потеряешь полученные за завершение очки (<b className='text-danger'>{formatPointsString(activeTaskItem.item.hours * 10)}</b>) и уплатишь штраф (<b className='text-danger'>{formatPointsString(activeTaskItem.item.hours * 10)}</b>)
                            </Modal.Body>
                        }

                        <Modal.Footer className='bg-dark-750 text-light border-dark'>
                            <Button variant='primary' disabled={isLoading} className='float-right' onClick={() => handleEnd()}>Завершить</Button>
                            <Button variant='secondary' disabled={isLoading} className='float-right mx-3' onClick={() => setShowEndModal(false)}>Отмена</Button>
                        </Modal.Footer>

                    </Modal>
                </Row>
        }
    </>
}
GameHome.getLayout = GetThinLayout
export default GameHome
