import React from 'react'
import { Button, Card, Col, Row } from 'react-bootstrap'
import Scrollbars from 'react-custom-scrollbars-2'
import { IEffectState } from '../../../util/interfaces'
import EffectCard from '../../effects/EffectCard'

interface Props {
    effects: IEffectState[];
    onAccept: Function;
}
export default function MyEffectsModal(props: Props) {
    const { effects, onAccept } = props
    return (
        <Card className='bg-dark text-light'>
            <Scrollbars autoHeight autoHeightMin={200} autoHeightMax={650}>
                <Card.Body>
                    <Row>
                        {
                            effects.map(effect => <Col sm={12} md={6} lg={4}>
                                <EffectCard key={effect.id} className='my-3' effect={effect.effect} />
                            </Col>).reverse()
                        }
                    </Row>
                </Card.Body>
            </Scrollbars>
        </Card>
    )
}