import React from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import Scrollbars from 'react-custom-scrollbars-2'
import { ISecretState } from '../../../util/interfaces'
import EffectCard from '../../effects/EffectCard'

interface Props {
    secrets: ISecretState[];
    onAccept: Function;
}
export default function MySecretsModal(props: Props) {
    const { secrets, onAccept } = props
    return (
        <Card className='bg-dark text-light'>
            <Scrollbars autoHeight autoHeightMin={200} autoHeightMax={650}>
                <Card.Body>
                    <Row>
                        {
                            secrets.map(secret => <Col sm={12} md={6} lg={4}>
                                <EffectCard key={secret.id} className='my-3' effect={secret.effect} />
                            </Col>).reverse()
                        }
                    </Row>
                </Card.Body>
            </Scrollbars>

        </Card>
    )
}