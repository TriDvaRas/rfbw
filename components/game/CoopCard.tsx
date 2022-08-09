import { useElementSize } from 'usehooks-ts';
import useImage from '../../data/useImage';
import { Effect, GamePlayerWithPlayer, GameTask, Image, Player, WheelItem } from '../../database/db';
import { effectColors } from '../../util/highlightColors';
import { getImageUrl } from '../../util/image';
import { getEffectTypeIcon } from '../../util/items';
import { highlightFgClasses } from '../../util/lines';
import { Row, Col, Card, Modal, Button, Alert, Spinner } from 'react-bootstrap';
import useGameCoopTasks from '../../data/useGameCoopTasks';
import LoadingDots from '../LoadingDots';
import TheImage from '../image/TheImage';
import players from '../../pages/api/admin/players';
import { useSession } from 'next-auth/react';
import useGameTask from '../../data/useGameTask';
import NewButton from '../NewButton';
import { useState } from 'react';
import { ApiError } from '../../types/common-api';
import axios from 'axios';
import { parseApiError } from '../../util/error';
import useGameCoopInvited from '../../data/useGameCoopInvited';

interface Props {
    onClick?: () => void;
    players: GamePlayerWithPlayer[]
    currentTask: GameTask
    item: WheelItem
    className?: string;
    shadow?: boolean
}
export default function CoopCard(props: Props) {
    const session = useSession()
    const { onClick, shadow, currentTask, players, item } = props
    const parentTask = useGameTask(currentTask.coopParentId || currentTask.id)
    const childTasks = useGameCoopTasks(parentTask.task?.gameId, parentTask.task?.id)
    const hostPlayer = players.find(x => x.playerId == parentTask.task?.playerId)
    const invitedPLayers = useGameCoopInvited(parentTask.task?.gameId, parentTask.task?.id)
    const [error, setError] = useState<ApiError | undefined>(undefined)
    const [loadingInviteIds, setLoadingInviteIds] = useState<string[]>([])
    const [showInviteModal, setShowInviteModal] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    return (
        <div
            className={` d-flex text-light bg-dark ${onClick ? `darken-bg-on-hover` : ``}   ${props.className ? props.className : ''}`}
            onClick={onClick}
            style={{
                borderRadius: '16px',
                overflow: 'hidden',
                cursor: onClick ? 'pointer' : undefined,
                textShadow: '#0008 0 0 5px',
                boxShadow: shadow ? ' #0007 0 0 15px' : undefined,
            }}>
            {childTasks.tasks && hostPlayer ? <Row className='p-3 pb-2'>
                <Col className='d-flex align-items-center justify-content-center flex-column'>
                    <Card bg='dark' style={{ height: '150px', width: '150px', border: 'none', borderRadius: '6px', overflow: 'hidden' }}>
                        <TheImage container='raw' imageId={hostPlayer.player.imageId} />
                    </Card>
                    <h5 className='mb-0'>{hostPlayer.player.name}👑</h5>
                </Col>

                {childTasks.tasks.map(task => {
                    const gp = (players.find(p => p.playerId == task.playerId) as GamePlayerWithPlayer)
                    return <Col key={task.id} style={{ opacity: task.result ? 0.3 : 1 }} className='d-flex align-items-center justify-content-center flex-column'>
                        <Card bg='dark' style={{ height: '150px', width: '150px', border: 'none', borderRadius: '6px', overflow: 'hidden' }}>
                            <TheImage container='raw' imageId={gp.player.imageId} />
                        </Card>
                        <h5 className='mb-0'>{gp.player.name}</h5>
                    </Col>
                })}
                {(childTasks.tasks.length + 1 < item.maxCoopPlayers || item.type !== 'game')
                    && hostPlayer.playerId == session.data?.user.id
                    && <Col className='d-flex align-items-center justify-content-center flex-column'>
                        <Card bg='dark' border='dark-700 fw-bold d-flex flex-column justify-content-center align-items-center  text-shadow'
                            onClick={() => setShowInviteModal(true)}
                            className='darken-bg-on-hover'
                            style={{ cursor: 'pointer', height: '150px', width: '150px' }}>
                            <div><i className=" fs-1 bi bi-plus-lg text-shadow"></i></div>
                        </Card>
                        <h5 className='mb-0'>{`\u200b`}</h5>
                    </Col>}
                <Modal
                    // size='lg'
                    show={showInviteModal}
                    contentClassName='border-dark shadow'
                    centered={true}
                    onHide={() => setShowInviteModal(false)}
                >
                    <Modal.Body className='bg-dark text-light'>
                        <Row className='p-3 pb-2'>
                            {
                                invitedPLayers.players ? players.filter(x => session.data?.user.id !== x.playerId).map(gp => {

                                    return <Col key={gp.playerId} className='d-flex align-items-center justify-content-center flex-column'>
                                        <Card bg='dark' style={{ height: '90px', width: '90px', border: 'none', borderRadius: '6px', overflow: 'hidden' }}>
                                            <TheImage container='raw' imageId={gp.player.imageId} />
                                        </Card>
                                        <h5 className=''>{gp.player.name}</h5>
                                        <Button variant={childTasks.tasks?.find(x => x.playerId == gp.playerId) ? 'success' : 'info'}
                                            disabled={((childTasks.tasks?.length || 0) >= item.maxCoopPlayers && item.type == 'game') || !!invitedPLayers.players?.find(x => x.playerId == gp.playerId) || loadingInviteIds.includes(gp.playerId) || !!childTasks.tasks?.find(x => x.playerId == gp.playerId)}

                                            onClick={() => {
                                                setError(undefined)
                                                setLoadingInviteIds([...loadingInviteIds, gp.playerId])
                                                axios.post<GamePlayerWithPlayer>(`/api/games/${currentTask.gameId}/coop/${currentTask.id}/invite`, {
                                                    playerId: gp.playerId
                                                })
                                                    .then(res => res.data)
                                                    .then((result) => {
                                                        setLoadingInviteIds(loadingInviteIds.filter(x => x !== gp.playerId))
                                                        invitedPLayers.mutate([...(invitedPLayers.players || []), result])
                                                    },
                                                        (err) => {
                                                            setLoadingInviteIds(loadingInviteIds.filter(x => x !== gp.playerId))
                                                            setError(parseApiError(err))
                                                        })
                                            }}>{invitedPLayers.players?.find(x => x.playerId == gp.playerId) ? `Приглашен` : loadingInviteIds.includes(gp.playerId) ? <Spinner animation='border' /> : childTasks.tasks?.find(x => x.playerId == gp.playerId) ? `Принял` : `Пригласить`}</Button>
                                    </Col>
                                }) : <LoadingDots />
                            }
                        </Row>
                        {
                            error && <Alert className='mb-0' variant={'danger'}>
                                {error.error}
                            </Alert>
                        }
                        <Button className='mt-3' disabled={isSaving} onClick={() => setShowInviteModal(false)}>Назад</Button>
                    </Modal.Body>
                </Modal>
            </Row> : <LoadingDots />
            }
        </div >
    )
}


