import React from 'react';
import {
    Button, Card
} from 'react-bootstrap';
import Scrollbars from 'react-custom-scrollbars-2';
import { useDispatch } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import { newToast } from '../toasts/toastsSlice';

interface Props {
    cardHeight: number;
}
export default function AdminNavCard(props: Props) {
    let location = useLocation()
    const items: Array<{
        title: string;
        to: string;
    }> = [
            {
                title: "Люди",
                to: 'users'
            },
            {
                title: "Игроки",
                to: 'players'
            },
            {
                title: "Колеса(не торч)",
                to: 'wheels'
            },
            {
                title: "Бананы",
                to: 'items'
            },
            {
                title: "Правила",
                to: 'rules'
            },
            {
                title: "Эффекст",
                to: 'effects'
            },
        ]
    const dispatch = useDispatch()
    function testasButtanitas() {
        dispatch(newToast({
            id: Math.random(),
            date: `${Date.now()}`,
            type: Math.random() < 0.5 ? 'error' : 'success',
            title: 'Test',
            text: 'Rondo '.repeat(Math.floor(3 + Math.random() * 10)),
            // autohide: Math.random() * 10000
        }))
    }
    return (
        <Card
            bg='dark'
            text='light'
            className="m-3 w-100 "
        >
            <Card.Header><h3>Админ Очка</h3></Card.Header>
            <Scrollbars autoHeight autoHeightMin={props.cardHeight - 68}>
                <div className='p-3'>
                    {items.map(item =>
                        <NavLink to={`${item.to}`}>
                            <Button variant='secondary' className={`shadow w-100 mb-3 ${location.pathname === item.to ? `bg-secondary-active border-dark` : ``}`}>
                                {item.title}
                            </Button>
                        </NavLink>
                    )}
                    <Button variant='secondary' className={`shadow w-100 mb-3 `} onClick={testasButtanitas}>
                        {'TЕstas Battunitas'}
                    </Button>
                </div>

            </Scrollbars>
        </Card>
    )
}