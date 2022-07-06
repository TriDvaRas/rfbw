import axios from 'axios'
import React, { useState } from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import Scrollbars from 'react-custom-scrollbars-2'
import { useDispatch } from 'react-redux'
import { ICardState } from '../../../util/interfaces'
import EffectCard from '../../effects/EffectCard'
import { newToast } from '../../toasts/toastsSlice'

interface Props {
    cards: ICardState[];
    onAccept: Function;
}
export default function MyCardsModal(props: Props) {
    const { cards, onAccept } = props
    const [isLoading, setIsLoading] = useState(false)
    const dispatch = useDispatch()
    function onUseCard(card: ICardState) {
        setIsLoading(true)
        axios.post(`/api/game/useCard`, { cardId: card.id })
            .then((response) => {
                dispatch(newToast({
                    id: Math.random(),
                    date: `${Date.now()}`,
                    type: 'info',
                    title: 'Использовал',
                    autohide: 10000,
                    text: `${response.data}`,
                }))
                setIsLoading(false)
            },
                (err) => {
                    dispatch(newToast({
                        id: Math.random(),
                        date: `${Date.now()}`,
                        type: 'error',
                        title: 'Ошибка',
                        text: err.response.data,
                    }))
                    setIsLoading(false)
                })
    }
    return (
        <Card className='bg-dark text-light'>
            <Scrollbars autoHeight autoHeightMin={200} autoHeightMax={650}>
                <Card.Body>
                    <Row>
                        {
                            cards.map(card => <Col sm={12} md={6} lg={4}>
                                <EffectCard key={card.id} className='my-3' effect={card.effect} onOk={() => onUseCard(card)} okDisabled={isLoading} okText='Использовать' />
                            </Col>).reverse()
                        }
                    </Row>
                </Card.Body>
            </Scrollbars>
        </Card>
    )
}