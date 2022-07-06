import { useEffect } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import Scrollbars from "react-custom-scrollbars-2";
import { useDispatch, useSelector } from "react-redux";
import LoadingDots from "../../components/LoadingDots";
import { isNeutral } from "../../util/effects";
import EffectCard from "./EffectCard";
import { fetchEffects, selectEffects } from "./effectsSlice";

interface Props {
    height: number;
}

export default function Effects(props: Props) {
    const effects = useSelector(selectEffects)
    const dispatch = useDispatch()
    useEffect(() => {
        if (effects.status === 'idle') {
            dispatch(fetchEffects())
        }
    }, [effects.status, dispatch])
    return (
        <Scrollbars autoHeight autoHeightMin={props.height} autoHeightMax={props.height}>
            <Container fluid>
                {
                    !effects.effects ?
                        <LoadingDots /> :
                        <Row >
                            <Col className='py-3' xs={12}>
                                <Card className='bg-dark border-primary'>
                                    <Card.Header>
                                        <h3 className='mb-0 text-primary'>Пизитивные</h3>
                                    </Card.Header>
                                </Card>
                                <Row>
                                    {
                                        effects.effects.filter(x => x.isPositive && (x.groupId < 40 || x.groupId >= 50)).map(effect => <Col xl={3} md={6} xs={12}><EffectCard effect={effect} key={effect.id} /></Col>)
                                    }
                                </Row>
                            </Col>
                            <Col className='py-3' xs={12}>
                                <Card className='bg-dark border-secondary '>
                                    <Card.Header>
                                        <h3 className='mb-0 text-light '>Нейтральные</h3>
                                    </Card.Header>
                                </Card>
                                <Row>
                                    {
                                        effects.effects.filter(x => isNeutral(x) && (x.groupId < 40 || x.groupId >= 50)).map(effect => <Col xl={3} md={6} xs={12}><EffectCard effect={effect} key={effect.id} /></Col>)
                                    }
                                </Row>
                            </Col>
                            <Col className='py-3' xs={12}>
                                <Card className='bg-dark border-danger'>
                                    <Card.Header>
                                        <h3 className='mb-0 text-danger'>Ниггативные</h3>
                                    </Card.Header>
                                </Card>
                                <Row>
                                    {
                                        effects.effects.filter(x => x.isNegative && (x.groupId < 40 || x.groupId >= 50)).map(effect => <Col xl={3} md={6} xs={12}><EffectCard effect={effect} key={effect.id} /></Col>)
                                    }
                                </Row>
                            </Col>
                            <Col className='py-3' xs={12}>
                                <Card className='bg-dark border-info'>
                                    <Card.Header>
                                        <h3 className='mb-0 text-info'>Карточки</h3>
                                    </Card.Header>
                                </Card>
                                <Row>
                                    {
                                        effects.effects.filter(x => x.isCard && (x.groupId < 40 || x.groupId >= 50)).map(effect => <Col xl={3} md={6} xs={12}><EffectCard effect={effect} key={effect.id} /></Col>)
                                    }
                                </Row>
                            </Col>
                            <Col className='py-3' xs={12}>
                                <Card className='bg-dark border-warning '>
                                    <Card.Header>
                                        <h3 className='mb-0 text-warning '>Секреты</h3>
                                    </Card.Header>
                                </Card>
                                <Row>
                                    {
                                        effects.effects.filter(x => x.isSecret && (x.groupId < 40 || x.groupId >= 50)).map(effect => <Col xl={3} md={6} xs={12}><EffectCard effect={effect} key={effect.id} /></Col>)
                                    }
                                </Row>
                            </Col>
                        </Row>
                }
            </Container>
        </Scrollbars>
    )
};