import { useRouter } from 'next/router';
import React from 'react';
import {
    Button, Card
} from 'react-bootstrap';

interface Props {
    cardHeight: number;
}
export default function AdminNavCard(props: Props) {
    let router = useRouter()
    const items: Array<{
        title: string;
        to: string;
    }> = [
            {
                title: "Правила",
                to: 'rules'
            },
            {
                title: "Люди",
                to: 'users'
            },
            {
                title: "Игроки",
                to: 'players'
            },
            {
                title: "Игры",
                to: 'games'
            },
            {
                title: "Эффекты",
                to: 'effects'
            },
        ]
    //TODO function testasButtanitas() {
    //     dispatch(newToast({
    //         id: Math.random(),
    //         date: `${Date.now()}`,
    //         type: Math.random() < 0.5 ? 'error' : 'success',
    //         title: 'Test',
    //         text: 'Rondo '.repeat(Math.floor(3 + Math.random() * 10)),
    //         // autohide: Math.random() * 10000
    //     }))
    // }
    return (
        <Card
            bg='dark'
            text='light'
            className="m-3 w-100 "
        >
            <Card.Header><h3>Админ Очка</h3></Card.Header>
            <div style={{ height: props.cardHeight - 68 }}>
                <div className='p-3'>
                    {items.map(item =>
                        <Button variant='secondary' className={`shadow w-100 mb-3 ${router.pathname === item.to ? `bg-secondary-active border-dark` : ``}`} key={item.to} onClick={() => router.push(`/admin/${item.to}`)}>
                            {item.title}
                        </Button>
                    )}
                    {/* <Button variant='secondary' className={`shadow w-100 mb-3 `} onClick={testasButtanitas}>
                        {'TЕstas Battunitas'}
                    </Button> */}
                </div>

            </div>
        </Card>
    )
}