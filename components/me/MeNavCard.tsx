import { useRouter } from 'next/router';
import { signOut } from "next-auth/react"
import React from 'react';
import {
    Button, Card
} from 'react-bootstrap';

interface Props {
    cardHeight: number;
}
export default function MeNavCard(props: Props) {
    const router = useRouter()
    return (
        <Card
            bg='dark'
            text='light'
            className=" w-100 m-3"
        >
            <Card.Header><h3>Кнопачки всякие</h3></Card.Header>
            <div style={{ height: props.cardHeight - 68 }}>
                <div className='p-3'>
                    <Button variant='secondary' className={`shadow w-100 mb-3`} onClick={() => router.push(`/wheeleditor`)}>
                        {'Редактор колес'}
                    </Button>
                    <Button variant='secondary' className={`shadow w-100 mb-3`} onClick={() => signOut()} >
                        {'Выйти(из аккаунта)'}
                    </Button>
                </div>
            </div>
        </Card >
    )
}