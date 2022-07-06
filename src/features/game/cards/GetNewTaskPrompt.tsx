import React from 'react'
import { Card, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

interface Props {
    effectPrompt?: boolean;
}
export default function GetNewTaskPrompt(props: Props) {
    return (
        <Card className='bg-dark text-light'>
            <Card.Header><h3>Текущий контент</h3></Card.Header>
            <Card.Body className='m-auto '>
                {
                    props.effectPrompt ?
                        <Link to='/game/effects'><Button className='my-4 ' variant='info'><b>Крутить Колесо Событий</b></Button></Link> :
                        <Link to='/game/spin'><Button className='my-4' variant='primary'><b>Крутить Колесо Игрока</b></Button></Link>
                }
            </Card.Body>
        </Card>
    )
}