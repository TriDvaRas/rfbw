import React from 'react';
import {
    Button, Card
} from 'react-bootstrap';
import Scrollbars from 'react-custom-scrollbars-2';
import { NavLink,  } from 'react-router-dom';

interface Props {
    cardHeight: number;
}
export default function MeNavCard(props: Props) {

    return (
        <Card
            bg='dark'
            text='light'
            className=" w-100 m-3"
        >
            <Card.Header><h3>Кнопачки всякие</h3></Card.Header>
            <Scrollbars autoHeight autoHeightMin={props.cardHeight - 68}>
                <div className='p-3'>
                    <NavLink to='/me/wheel'>
                        <Button variant='secondary' className={`shadow w-100 mb-3`}>
                            {'Мое колесо'}
                        </Button>
                    </NavLink>
                    <Button variant='secondary' className={`shadow w-100 mb-3`} href='/auth/logout'>
                        {'Выйти(из аккаунта)'}
                    </Button>
                </div>

            </Scrollbars>
        </Card>
    )
}