import { useState } from 'react';
import {
    Button, Card, Col, Row, Table
} from 'react-bootstrap';
import useAllPlayers from '../../data/useAllPlayers';
import { Player } from '../../database/db';
import ImageWithPreview from '../ImageWithPreview';
import LoadingDots from '../LoadingDots';
import PlayerAboutCard from '../player/PlayerAboutCard';
import PlayerAboutCardEdit from '../player/PlayerAboutCardEdit';

interface Props {
    cardHeight: number;
}
export default function AdminPlayers(props: Props) {
    const players = useAllPlayers()
    const [editPlayer, setEditPlayer] = useState<Player | undefined>(undefined)
    const [isSaving, setIsSaving] = useState(false)
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
                                        <td className='td-min-width'>{player.id}</td>
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
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>}
                    </div>
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


