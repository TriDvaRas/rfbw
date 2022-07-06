import React from 'react'
import { Card, Button } from 'react-bootstrap'
import { IWheelItem } from '../../../util/interfaces'
import { formatPointsString } from '../../../util/lines'

interface Props {
    task: IWheelItem;
    onCancel: Function;
    onAccept: Function;
    isLoading: boolean;
    free?: boolean;
}
export default function DropModal(props: Props) {
    const { task, onCancel, onAccept, isLoading, free } = props
    return (
        <Card className='bg-dark text-light'>
            <Card.Header><h3>Дроп контента</h3></Card.Header>
            <Card.Body>
                {free ?
                    <div> За дроп ты <span className='text-primary'>НЕ потеряешь</span> очков.</div> :
                    <div> За дроп ты потеряешь <span className='text-danger'>{formatPointsString(Math.floor(task.hours * 5))}</span>.</div>}

            </Card.Body>
            <Card.Footer>
                <Button variant='danger' disabled={isLoading} className='float-right' onClick={() => onAccept()}>Дроп</Button>
                <Button variant='secondary' disabled={isLoading} className='float-right mx-3' onClick={() => onCancel()}>Отмена</Button>
            </Card.Footer>
        </Card>
    )
}