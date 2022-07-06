import React from 'react'
import { Card, Button } from 'react-bootstrap'
import { IWheelItem } from '../../../util/interfaces'
import { formatPointsString } from '../../../util/lines'

interface Props {
    task: IWheelItem;
    onCancel: Function;
    onAccept: Function;
    isLoading: boolean;
}
export default function EndModal(props: Props) {
    const { task, onAccept, onCancel,isLoading } = props
    return (
        <Card className='bg-dark text-light'>
            <Card.Header><h3>Завершение контента</h3></Card.Header>
            <Card.Body>
                За завершение ты получишь <span className='text-success'>{formatPointsString(task.hours * 10)}</span>.
                При обнружении абуза ты потеряешь полученные за завершение очки (<span className='text-danger'>{formatPointsString(task.hours * 10)}</span>) и уплатишь штраф (<span className='text-danger'>{formatPointsString(task.hours * 10)}</span>)
            </Card.Body>
            <Card.Footer>
                <Button variant='primary' disabled={isLoading} className='float-right' onClick={() => onAccept()}>Завершить</Button>
                <Button variant='secondary' disabled={isLoading} className='float-right mx-3' onClick={() => onCancel()}>Отмена</Button>
            </Card.Footer>
        </Card>
    )
}