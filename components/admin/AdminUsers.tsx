import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
    Button, Card, Table
} from 'react-bootstrap';
import ImageWithPreview from '../../components/ImageWithPreview';
import useAllUsers from '../../data/useAllUsers';
import { User } from '../../database/db';
import AdminPlayerifyModal from './AdminPlayerifyModal';
import LoadingDots from '../LoadingDots';

interface Props {
    cardHeight: number;
}
export default function AdminUsers(props: Props) {
    const users = useAllUsers()
    const [playerifyUser, setPlayerifyUser] = useState<User | undefined>(undefined)
    const [isSaving, setIsSaving] = useState(false)
    return (
        <Card
            bg='dark'
            text='light'
            className="my-3 me-3 w-100 h-100"
            style={{ maxHeight: props.cardHeight }}
        >
            <Card.Header><h3>Пользователи</h3></Card.Header>
            <div style={{ height: props.cardHeight - 68 }}>
                {!users.users ? <LoadingDots /> : <Table variant="dark" className='mb-0 '>
                    <thead className='bg-dark-700'>
                        <tr>
                            <th>id</th>
                            <th></th>
                            <th>Name</th>
                            <th>DisplayName</th>
                            <th>ADM</th>
                            <th>PLR</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.users.map(user =>
                            <tr key={user.id}>
                                <td className='td-min-width'>{user.id}</td>
                                <td className='py-0 td-min-width'>
                                    <ImageWithPreview imageKey={user.id} size={35} src={`https://cdn.discordapp.com/avatars/${user.discordId}/${user.image}.png`} />
                                </td>
                                <td>{user.name}</td>
                                <td>{user.displayName}</td>
                                <td className='td-min-width text-center'>{user.isAdmin ? <i className="bi bi-emoji-sunglasses"></i> : <i className="bi bi-emoji-neutral"></i>}</td>
                                <td className='td-min-width text-center'>{user.isPlayer ? <i className="bi bi-emoji-sunglasses"></i> : <i className="bi bi-emoji-neutral"></i>}</td>
                                <td className=' m-0 p-0'>
                                    <Button
                                        variant={isSaving ? 'secondary' : !user.isPlayer ? 'primary' : 'danger'}
                                        disabled={!!user.isPlayer || isSaving}
                                        className=' py-0 my-2 mx-3'
                                        onClick={() => setPlayerifyUser(user)}>
                                        {user.isPlayer ? 'Ban' : 'Playerify'}
                                    </Button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>}
                <AdminPlayerifyModal
                    show={!!playerifyUser}
                    isSaving={isSaving}
                    setIsSaving={setIsSaving}
                    sourceUser={playerifyUser}
                    onCancel={() => {
                        setPlayerifyUser(undefined)
                    }}
                    onSaved={(player) => {
                        if (users.users) {
                            (users.users.find(x => x.id == player.id) as User).isPlayer = true
                            users.mutate(users.users)
                        }
                        setPlayerifyUser(undefined)
                    }}
                />
            </div>
        </Card>
    )
}


