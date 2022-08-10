import axios from 'axios';
import { useState } from 'react';
import {
    Alert,
    Button, Card, Col, Dropdown, DropdownButton, Form, InputGroup, Modal, Row, Table
} from 'react-bootstrap';
import useAllPlayers from '../../data/useAllPlayers';
import useGames from '../../data/useGames';
import { Game, Player } from '../../database/db';
import { ApiError } from '../../types/common-api';
import ImageWithPreview from '../ImageWithPreview';
import LoadingDots from '../LoadingDots';
import PlayerAboutCard from '../player/PlayerAboutCard';
import PlayerAboutCardEdit from '../player/PlayerAboutCardEdit';
import { parseApiError } from '../../util/error';

interface Props {
    cardHeight: number;
}
export default function AdminPlayers(props: Props) {
    const players = useAllPlayers()
    const [editPlayer, setEditPlayer] = useState<Player | undefined>(undefined)
    const [isSaving, setIsSaving] = useState(false)
    const [addPointsPlayer, setAddPointsPlayer] = useState<Player | undefined>(undefined)
    const [removePointsPlayer, setRemovePointsPlayer] = useState<Player | undefined>(undefined)
    const [error, setError] = useState<ApiError | undefined>(undefined)
    const games = useGames()
    const [selectedGameId, setSelectedGameId] = useState<string | undefined>(undefined)
    const [reason, setReason] = useState('')
    const [amount, setAmount] = useState(0)
    return (
        <Row>
            <Col lg={9}>
                <Card
                    bg='dark'
                    text='light'
                    className="my-3 me-3 w-100 h-100"
                    style={{ maxHeight: props.cardHeight }}
                >
                    <Card.Header><h3>Игроки</h3></Card.Header>
                    <div style={{ height: props.cardHeight - 68 }}>
                        {!players.players ? <LoadingDots /> : <Table variant="dark" className='mb-0 '>
                            <thead className='bg-dark-700'>
                                <tr>
                                    <th>id</th>
                                    <th>Name</th>
                                    <th>About</th>
                                    <th>ImageId</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {players.players.map(player =>
                                    <tr key={player.id}>
                                        <td className='td-min-width' style={{ fontSize: '50%' }}>{player.id}</td>
                                        <td>{player.name}</td>
                                        <td>{player.about}</td>
                                        <td className='td-min-width'>{player.imageId}</td>
                                        <td className='td-min-width m-0 p-0'>
                                            <Button
                                                variant={`primary`}
                                                className=' py-0 my-2 mx-3'
                                                onClick={() => setEditPlayer(player)}>
                                                Edjt
                                            </Button>
                                            <Button
                                                variant={`success`}
                                                className=' py-0 my-2 mx-0'
                                                onClick={() => setAddPointsPlayer(player)}>
                                                + P
                                            </Button>
                                            <Button
                                                variant={`danger`}
                                                className=' py-0 my-2 mx-3'
                                                onClick={() => setRemovePointsPlayer(player)}>
                                                - P
                                            </Button>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>}
                    </div>
                    <Modal size='lg' contentClassName='border-dark shadow' show={!!addPointsPlayer} animation={true} centered >
                        <Modal.Header className='bg-dark-750 text-light border-dark'><h3>+ ptsiks</h3></Modal.Header>
                        <Modal.Body className='bg-dark text-light border-dark'>

                            {
                                addPointsPlayer && <div className='bg-dark text-light border-dark'>
                                    {
                                        games.games && <Form.Select value={selectedGameId} onChange={(e) => setSelectedGameId(e.target.value)}>
                                            <option>CHOOSE GAME</option>
                                            {games.games.map(g => <option key={g.id} value={g.id}  >{g.name}</option>)}
                                        </Form.Select>
                                    }
                                    <InputGroup className="mb-3">
                                        <InputGroup.Text id="basic-addon3">
                                            {addPointsPlayer.name} получить мешок риса от Партия за
                                        </InputGroup.Text>
                                        <Form.Control id="basic-url" aria-describedby="basic-addon3" onChange={(e) => setReason(e.target.value)} />
                                    </InputGroup>
                                    <Form.Control id="basic-url" type='number' min={0} onChange={(e) => setAmount(+e.target.value)} />
                                </div>
                            }
                            {
                                error && <Alert className='mb-0 my-2' variant={'danger'}>
                                    {error.error}
                                </Alert>
                            }
                        </Modal.Body>
                        <Modal.Footer className='bg-dark-750 text-light border-dark'>
                            <Button variant='secondary' disabled={isSaving} className='float-right mx-3' onClick={() => setAddPointsPlayer(undefined)}>Отмена</Button>
                            <Button variant='danger' disabled={isSaving || !selectedGameId || !addPointsPlayer || !amount || !reason} className='float-right' onClick={() => {
                                if (!selectedGameId || !addPointsPlayer || !amount || !reason)
                                    return
                                axios.post(`/api/games/${selectedGameId}/players/${addPointsPlayer.id}/points/add`, {
                                    amount, reason
                                })
                                    .then(res => res.data)
                                    .then((result) => {
                                        setAddPointsPlayer(undefined)
                                    },
                                        (err) => {
                                            setError(parseApiError(err))
                                        })
                            }}>Yes.</Button>
                        </Modal.Footer>
                    </Modal>




                    <Modal size='lg' contentClassName='border-dark shadow' show={!!removePointsPlayer} animation={true} centered >
                        <Modal.Header className='bg-dark-750 text-light border-dark'><h3>- ptsiks</h3></Modal.Header>
                        <Modal.Body className='bg-dark text-light border-dark'>

                            {
                                removePointsPlayer && <div className='bg-dark text-light border-dark'>
                                    {
                                        games.games && <Form.Select value={selectedGameId} onChange={(e) => setSelectedGameId(e.target.value)}>
                                            <option>CHOOSE GAME</option>
                                            {games.games.map(g => <option key={g.id} value={g.id} >{g.name}</option>)}
                                        </Form.Select>
                                    }
                                    <InputGroup className="mb-3">
                                        <InputGroup.Text id="basic-addon3">
                                            {removePointsPlayer.name} вернуть Партия мешок риса за
                                        </InputGroup.Text>
                                        <Form.Control id="basic-url" aria-describedby="basic-addon3" onChange={(e) => setReason(e.target.value)} />
                                    </InputGroup>
                                    <Form.Control id="basic-url" type='number' min={0} onChange={(e) => setAmount(+e.target.value)} />
                                </div>
                            }
                            {
                                error && <Alert className='mb-0 my-2' variant={'danger'}>
                                    {error.error}
                                </Alert>
                            }
                        </Modal.Body>
                        <Modal.Footer className='bg-dark-750 text-light border-dark'>
                            <Button variant='secondary' disabled={isSaving} className='float-right mx-3' onClick={() => setRemovePointsPlayer(undefined)}>Отмена</Button>
                            <Button variant='danger' disabled={isSaving || !selectedGameId || !removePointsPlayer || !amount || !reason} className='float-right' onClick={() => {
                                if (!selectedGameId || !removePointsPlayer || !amount || !reason)
                                    return
                                axios.post(`/api/games/${selectedGameId}/players/${removePointsPlayer.id}/points/add`, {
                                    amount: -amount, reason
                                })
                                    .then(res => res.data)
                                    .then((result) => {
                                        setRemovePointsPlayer(undefined)
                                    },
                                        (err) => {
                                            setError(parseApiError(err))
                                        })
                            }}>Yes.</Button>
                        </Modal.Footer>
                    </Modal>
                </Card>
            </Col>
            <Col lg={3}>
                {
                    editPlayer ?
                        <PlayerAboutCard name={editPlayer.name} about={editPlayer.about} imageId={editPlayer.imageId} /> :
                        null
                }
                {
                    editPlayer ?
                        <PlayerAboutCardEdit onChange={(upd) => {
                            setEditPlayer({ ...editPlayer, ...upd } as Player)
                        }}
                            onCancel={() => {
                                setEditPlayer(undefined)
                            }}
                            player={editPlayer}
                            onSaved={() => { }}
                        /> :
                        null
                }
            </Col>
        </Row >
    )
}


