import axios from 'axios';
import $ from 'jquery';
import React, { useEffect, useState } from 'react';
import {
    Card, Col, Row, Table
} from 'react-bootstrap';
import Scrollbars from 'react-custom-scrollbars-2';
import { useDispatch, useSelector } from 'react-redux';
import ImageWithPreview from '../../components/ImageWithPreview';
import { IPlayer } from '../../util/interfaces';
import PlayerAboutCard from '../playerAbout/PlayerAboutCard';
import { newToast } from '../toasts/toastsSlice';
import AdminPlayerAboutCardEdit from './AdminPlayerAboutCardEdit';
import { fetchAPlayers, selectAPlayers } from './aPlayersSlice';
interface Props {
    cardHeight: number;
}
export default function AdminPlayers(props: Props) {
    const players = useSelector(selectAPlayers)
    const dispatch = useDispatch()
    const [selectedPlayer, setSelectedPlayer] = useState<IPlayer | null>(null)
    const [previewHeight, setPreviewHeight] = useState(0)
    const [isSaving, setIsSaving] = useState(false)
    useEffect(() => {
        if (players.status === 'idle') {
            dispatch(fetchAPlayers())
        }
    }, [players.status, dispatch])
    useEffect(() => {
        if (selectedPlayer)
            setSelectedPlayer(players.players?.find(x => x.id === selectedPlayer?.id) || null)
        setPreviewHeight($('#admin-player-preview')?.outerHeight() || 0)
    }, [players.players, selectedPlayer])
    useEffect(() => {
        setPreviewHeight($('#admin-player-preview')?.outerHeight() || 0)
    }, [props.cardHeight])
    function handleSave(newData: { name: string, about: string, picture?: string }) {
        setIsSaving(true)
        axios.post(`/api/admin/players`, newData, {
            headers: {
                'content-type': 'multipart/form-data'
            }
        })
            .then(() => {
                setIsSaving(false)
                dispatch(newToast({
                    id: Math.random(),
                    date: `${Date.now()}`,
                    type: 'success',
                    title: 'Сохранил',
                    autohide: 5000
                }))
            },
                (err) => {
                    setIsSaving(false)
                    dispatch(newToast({
                        id: Math.random(),
                        date: `${Date.now()}`,
                        type: 'error',
                        title: 'Ошибка',
                        text: err.response.data,
                    }))
                })
    }


    return (
        <Row>
            <Col xl={8} xs={12}>
                <Card
                    bg='dark'
                    text='light'
                    className="m-3 w-100 h-100"
                    style={{ maxHeight: props.cardHeight }}
                >
                    <Card.Header><h3>Игроки</h3></Card.Header>
                    <Scrollbars autoHeight autoHeightMin={props.cardHeight - 68}>
                        <Table variant="dark" hover className='mb-0 fs-1'>
                            <thead className='bg-dark-700'>
                                <tr>
                                    <th>Id</th>
                                    <th className='text-center'>Wh</th>
                                    <th colSpan={2} className='text-center'>Чел(DS)</th>
                                    <th colSpan={2} className='text-center td-min-width'>Твое Имя</th>
                                    <th>Об игроке</th>
                                    <th>Поинты</th>
                                </tr>
                            </thead>
                            <tbody>
                                {players.players?.map(player =>
                                    <tr onClick={() => setSelectedPlayer(player)} >
                                        <td className='td-min-width text-center'>{player.id}</td>
                                        <td className='td-min-width text-center'>{player.wheelId}</td>
                                        <td className='py-0 td-min-width'>
                                            <ImageWithPreview imageKey={`${player.userId}`} size={40} src={`https://cdn.discordapp.com/avatars/${player.userId}/${player.avatar}.png`} />
                                        </td>
                                        <td>{player.userTag}</td>
                                        <td className='py-0 td-min-width '>
                                            <ImageWithPreview imageKey={`${player.id}`} size={40} src={`${player.picture?.startsWith(`blob`) ? '' : '/'}${player.picture || 'errorAvatar.jpg'}`} />
                                        </td>
                                        <td>{player.name}</td>
                                        <td>{player.about}</td>
                                        <td className='td-min-width text-center'>{player.points || 0}</td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </Scrollbars>
                </Card>
            </Col>
            <Col xl={4} xs={12}>
                {!selectedPlayer || <PlayerAboutCard player={selectedPlayer} id='admin-player-preview' />}
                {!selectedPlayer || <AdminPlayerAboutCardEdit maxHeight={props.cardHeight - 18 - previewHeight} onSave={handleSave} player={selectedPlayer} isSaving={isSaving} />}
            </Col>
        </Row>
    )
}


