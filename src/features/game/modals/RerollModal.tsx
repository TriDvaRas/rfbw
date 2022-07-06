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
export default function RerollModal(props: Props) {
    const { task, onCancel, onAccept, isLoading } = props
    return (
        <Card className='bg-dark text-light'>
            <Card.Header><h3>Дроп контента</h3></Card.Header>
            <Card.Body>
                За реролл ты не потеряешь очков, но ты должен будешь доказать что уже играл/смотрел данный контент (если кто то доебется).
                После реролла нельзя сменить колесо игрока для следующего прокрута.
                При обнружении абуза ты потеряешь <span className='text-danger'>{formatPointsString(task.hours * 10)}</span>
            </Card.Body>
            <Card.Footer>
                <Button variant='danger' disabled={isLoading} className='float-right' onClick={() => onAccept()}>Реролл</Button>
                <Button variant='secondary' disabled={isLoading} className='float-right mx-3' onClick={() => onCancel()}>Отмена</Button>
            </Card.Footer>
        </Card>
    )
}