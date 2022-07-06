import React from 'react'
import { Card, Button } from 'react-bootstrap'
import { IWheelItem } from '../../../util/interfaces'

interface Props {
    task: IWheelItem;
    onOk?: Function;
    headerText?: string;
}
export default function TaskPreview(props: Props) {
    const { task, onOk, headerText } = props
    return (
        <Card className='bg-dark text-light'>
            {headerText && <Card.Header><h3>{headerText}</h3></Card.Header>}
            <Card.Img variant="top" src={`/${task.image}`} />
            <Card.Body className='w-100'>
                <Card.Title>{task.title} ({task.hours*10} Очков)</Card.Title>
                <Card.Text>{task.comments}</Card.Text>
                {onOk && <Button variant="primary" className='float-right' onClick={(evt) => onOk(evt)}>Продолжить</Button>}
            </Card.Body>
        </Card>
    )
}