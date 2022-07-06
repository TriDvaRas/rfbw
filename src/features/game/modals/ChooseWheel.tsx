import React from 'react'
import { Button, Card, Col, Row } from 'react-bootstrap'
import LoadingDots from '../../../components/LoadingDots'
import { IWheel } from '../../../util/interfaces'

interface Props {
    wheels: Array<IWheel> | undefined;
    onWheelSelect: Function;
}
export default function ChooseWheel(props: Props) {
    const { wheels, onWheelSelect } = props
    return (
        <Card className='bg-dark text-light'>
            <Card.Header>
                <h3>Чье колесо крутим?</h3>
            </Card.Header>
            <Card.Body>
                {wheels ?
                    <Row>
                        {wheels.map(wheel => <Col key={wheel.id} md={'6'} xs={12}><Button variant='secondary' onClick={() => onWheelSelect(wheel)} className='m-1 w-100'>{wheel.ownerName}</Button></Col>)}
                    </Row> :
                    <LoadingDots />
                }
            </Card.Body>
        </Card>
    )
}