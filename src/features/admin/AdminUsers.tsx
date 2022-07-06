import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
    Button, Card, Table
} from 'react-bootstrap';
import Scrollbars from 'react-custom-scrollbars-2';
import { useDispatch, useSelector } from 'react-redux';
import ImageWithPreview from '../../components/ImageWithPreview';
import { newToast } from '../toasts/toastsSlice';
import { fetchUsers, selectUsers, setPlayer } from './usersSlice';

interface Props {
    cardHeight: number;
}
export default function AdminUsers(props: Props) {
    const users = useSelector(selectUsers)
    const dispatch = useDispatch()
    const [loadingIds, setLoadingIds] = useState<Array<string>>([])
    useEffect(() => {
        if (users.status === 'idle') {
            dispatch(fetchUsers())
        }
    }, [users.status, dispatch])

    function handleNewPlayer(userId: string) {
        setLoadingIds([...loadingIds, userId])
        axios.post(`/api/admin/users/addplayer`, {
            userId
        })
            .then(() => {
                dispatch(setPlayer(userId))
                dispatch(newToast({
                    id: Math.random(),
                    date: `${Date.now()}`,
                    type: 'success',
                    title: 'Игрок добавлен',
                    autohide: 5000
                }))
                setLoadingIds(loadingIds.filter(x => x !== userId))
            },
                (err) => {
                    dispatch(newToast({
                        id: Math.random(),
                        date: `${Date.now()}`,
                        type: 'error',
                        title: 'Ошибка',
                        text: err.response.data,
                    }))
                    setLoadingIds(loadingIds.filter(x => x !== userId))
                })
    }

    return (
        <Card
            bg='dark'
            text='light'
            className="m-3 w-100 h-100"
            style={{ maxHeight: props.cardHeight }}
        >
            <Card.Header><h3>Пользователи</h3></Card.Header>
            <Scrollbars autoHeight autoHeightMin={props.cardHeight - 68}>
                <Table variant="dark" className='mb-0 fs-1'>
                    <thead className='bg-dark-700'>
                        <tr>
                            <th>id</th>
                            <th></th>
                            <th>Чел</th>
                            <th>Админ?</th>
                            <th>Игрок?</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.users?.map(user =>
                            <tr>
                                <td className='td-min-width'>{user.id}</td>
                                <td className='py-0 td-min-width'>
                                    <ImageWithPreview imageKey={user.id} size={40} src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`}/>
                                </td>
                                <td>{user.tag}</td>
                                <td className='td-min-width'>{user.isAdmin ? <i className="bi bi-emoji-sunglasses"></i> : <i className="bi bi-emoji-neutral"></i>}</td>
                                <td className='td-min-width'>{user.isPlayer ? <i className="bi bi-emoji-sunglasses"></i> : <i className="bi bi-emoji-neutral"></i>}</td>
                                <td className=' m-0 p-0'>
                                    <Button variant='secondary' disabled={!!user.isPlayer || loadingIds.includes(user.id)} className=' my-1 mx-3' onClick={() => handleNewPlayer(user.id)}>
                                        {'Сделать игроком'}
                                    </Button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </Scrollbars>
        </Card>
    )
}


