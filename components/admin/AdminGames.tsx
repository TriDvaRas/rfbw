import { useState } from 'react';
import {
    Alert,
    Button, Card, Col, Form, Modal, Row, Table
} from 'react-bootstrap';
import useGames from '../../data/useGames';
import { Game, GamePlayer, GameWheel } from '../../database/db';
import GamePreview from '../game/GamePreview';
import LoadingDots from '../LoadingDots';
import axios, { AxiosError } from 'axios';
//@ts-ignore
import DateTimePicker from 'react-datetime-picker/dist/entry.nostyle';
import useGamePlayers from '../../data/useGamePlayers';
import { ApiError } from '../../types/common-api';
import { parseApiError } from '../../util/error';
import ImageUpload from '../ImageUpload';
import GamePlayerPreview from '../player/GamePlayerPreview';
import NewButton from '../NewButton';
import useAllPlayers from '../../data/useAllPlayers';
import useAllWheels from '../../data/useAllWheels';
import useGameWheels from '../../data/useGameWheels';
import GameWheelPreview from '../wheel/GameWheelPreview';

interface Props {
    cardHeight: number;
}
export default function AdminGames(props: Props) {
    const games = useGames()
    const [editGame, setEditGame] = useState<Game | undefined>(undefined)
    const gamePlayers = useGamePlayers(editGame?.id)
    const players = useAllPlayers()
    const gameWheels = useGameWheels(editGame?.id)
    const wheels = useAllWheels()
    const [isImageUploading, setIsImageUploading] = useState(false)

    const [error, setError] = useState<ApiError | undefined>()
    const [isSaving, setIsSaving] = useState(false)

    const [showAddPlayerModal, setShowAddPlayerModal] = useState(false)
    const [newPlayerId, setNewPlayerId] = useState<string | undefined>()

    const [showAddWheelModal, setShowAddWheelModal] = useState(false)
    const [newWheelId, setNewWheelId] = useState<string | undefined>()
    return (
        <Row>
            <Col lg={12}>
                <Card
                    bg='dark'
                    text='light'
                    className="my-3 me-3 w-100"
                >
                    <Card.Header><h3>Игры</h3></Card.Header>
                    <div >
                        {!games.games ? <LoadingDots /> : <Table variant="dark" className='mb-0 '>
                            <thead className='bg-dark-700'>
                                <tr>
                                    <th>id</th>
                                    <th>Name</th>
                                    <th>start</th>
                                    <th>end</th>
                                    <th>ImageId</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {games.games.map(game =>
                                    <tr key={game.id}>
                                        <td className='td-min-width'>{game.id}</td>
                                        <td>{game.name}</td>
                                        <td>{game.startsAt}</td>
                                        <td>{game.endsAt}</td>
                                        <td className='td-min-width'>{game.imageId}</td>
                                        <td className='td-min-width m-0 p-0'>
                                            <Button
                                                variant={`primary`}
                                                className=' py-0 my-2 mx-3'
                                                onClick={() => setEditGame(game)}>
                                                Edjt
                                            </Button>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>}
                    </div>
                </Card>
            </Col>

            {editGame && <Col lg={12}>
                <Card
                    bg='dark'
                    text='light'
                    className="my-3 me-3 w-100"
                >
                    <Card.Body>
                        <GamePreview game={editGame} />
                        <Form>
                            <Form.Group className='mb-3'>
                                <Form.Label>Название</Form.Label>
                                <Form.Control as={'input'} value={editGame.name || ''} onChange={(e) => setEditGame({ ...editGame, name: e.target.value } as Game)} />
                            </Form.Group>
                            <Form.Group >
                                <Form.Label>Картинка</Form.Label>
                                <ImageUpload
                                    imageType='game'
                                    onUploadStarted={() => setIsImageUploading(true)}
                                    onError={(err) => {
                                        setIsImageUploading(false)
                                        setError(err)
                                    }}
                                    onUploaded={(image) => {
                                        setIsImageUploading(false)
                                        setEditGame({ ...editGame, imageId: image.id } as Game)
                                    }}

                                />
                            </Form.Group>
                            <Form.Group >
                                <Form.Label>Старт</Form.Label>
                                <DateTimePicker onChange={(e: Date) => { setEditGame({ ...editGame, startsAt: e.toISOString() } as Game) }} value={new Date(editGame.startsAt)} />
                            </Form.Group>
                            <Form.Group >
                                <Form.Label>Конец</Form.Label>
                                <DateTimePicker onChange={(e: Date) => { setEditGame({ ...editGame, endsAt: e.toISOString() } as Game) }} value={new Date(editGame.endsAt)} />
                            </Form.Group>
                            <Form.Group >
                                <Button disabled={isSaving} onClick={() => {
                                    setError(undefined)
                                    setIsSaving(true)
                                    axios.patch<Game>(`/api/games/${editGame.id}`, editGame).then((data) => {
                                        setIsSaving(false)
                                    }).catch((err: AxiosError<ApiError>) => {
                                        setIsSaving(false)
                                        setError(parseApiError(err))
                                    })
                                }}>Save</Button>
                            </Form.Group>
                            {
                                error && <Form.Group className='mb-3'><Alert className='mb-0' variant={'danger'}>
                                    {error.error}
                                </Alert></Form.Group>
                            }
                        </Form>
                    </Card.Body>
                </Card>
            </Col>}

            {editGame && gamePlayers.players && <Col lg={12}>
                <Card
                    bg='dark'
                    text='light'
                    className="my-3 me-3 w-100"
                >
                    <Card.Header>Игроки</Card.Header>
                    <Card.Body>
                        {gamePlayers.players.map(x => <GamePlayerPreview key={x.playerId} gamePlayer={x} />)}
                        <NewButton onClick={() => setShowAddPlayerModal(true)} />
                    </Card.Body>
                </Card>
                <Modal
                    size='lg'
                    show={showAddPlayerModal}
                    contentClassName='border-dark shadow'
                    centered={true}
                    onHide={() => setShowAddPlayerModal(false)}
                >
                    <Modal.Header className='bg-dark-700 text-light border-dark'>
                        <Modal.Title>Adding player to {editGame.name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className='bg-dark-750 text-light'>
                        <Form>
                            <Form.Group  >
                                <Form.Label>Player</Form.Label>
                                {
                                    players.players ? <Form.Select value={newPlayerId} onChange={e => setNewPlayerId(e.target.value)}>
                                        <option disabled selected={!newPlayerId}> Select Player...</option>
                                        {players.players.map(p => <option disabled={!!gamePlayers.players?.find(x => x.playerId == p.id)} key={p.id} value={p.id}>{p.name}</option>)}
                                    </Form.Select> : <LoadingDots />
                                }

                            </Form.Group>
                            <Button className='mt-3'
                                disabled={isSaving}
                                onClick={() => {
                                    if (!newPlayerId)
                                        return
                                    setError(undefined)
                                    setIsSaving(true)
                                    axios.post<GamePlayer>(`/api/games/${editGame.id}/players`, {
                                        playerId: newPlayerId,
                                        gameId: editGame.id
                                    }).then((data) => {
                                        setIsSaving(false)
                                        gamePlayers.mutate([...(gamePlayers.players || []), data.data])
                                        setNewPlayerId(undefined)
                                        setShowAddPlayerModal(false)
                                    }).catch((err: AxiosError<ApiError>) => {
                                        setIsSaving(false)
                                        setError(parseApiError(err))
                                    })
                                }}>Add</Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            </Col>}

            {editGame && gameWheels.wheels && <Col lg={12}>
                <Card
                    bg='dark'
                    text='light'
                    className="my-3 me-3 w-100"
                >
                    <Card.Header>Game Wheels</Card.Header>
                    <Card.Body>
                        {gameWheels.wheels.map(x => <GameWheelPreview key={x.wheelId} gameWheel={x} />)}
                        <NewButton onClick={() => setShowAddWheelModal(true)} />
                    </Card.Body>
                </Card>
                <Modal
                    size='lg'
                    show={showAddWheelModal}
                    contentClassName='border-dark shadow'
                    centered={true}
                    onHide={() => setShowAddWheelModal(false)}
                >
                    <Modal.Header className='bg-dark-700 text-light border-dark'>
                        <Modal.Title>Adding wheel to {editGame.name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className='bg-dark-750 text-light'>
                        <Form>
                            <Form.Group  >
                                <Form.Label>Wheel</Form.Label>
                                {/* {`${newWheelId}`} */}
                                {
                                    wheels.wheels ? <Form.Select onChange={e => setNewWheelId(e.target.value)}>
                                        <option disabled selected={!newWheelId}> Select Wheel...</option>
                                        {wheels.wheels.map(w => <option disabled={!!gameWheels.wheels?.find(x => x.wheelId == w.id)} key={w.id} value={w.id}>{w.title}</option>)}
                                    </Form.Select> : <LoadingDots />
                                }
                            </Form.Group>
                            <Button className='mt-3'
                                disabled={isSaving}
                                onClick={() => {
                                    if (!newWheelId)
                                        return
                                    setError(undefined)
                                    setIsSaving(true)
                                    axios.post<GameWheel>(`/api/games/${editGame.id}/wheels`, {
                                        wheelId: newWheelId,
                                        gameId: editGame.id
                                    }).then((data) => {
                                        setIsSaving(false)
                                        gameWheels.mutate([...(gameWheels.wheels || []), data.data])
                                        setNewWheelId(undefined)
                                        setShowAddWheelModal(false)
                                    }).catch((err: AxiosError<ApiError>) => {
                                        setIsSaving(false)
                                        setError(parseApiError(err))
                                    })
                                }}>Add</Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            </Col>}

        </Row >
    )
}


