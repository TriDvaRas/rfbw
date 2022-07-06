import React from 'react';
import {
    Col, Row
} from 'react-bootstrap';
import useWindowDimensions from '../util/useWindowDimensions';


export default function Home() {
    const { height } = useWindowDimensions()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const maxCardHeight = height - 32
    return (
        <Row className="mh-100">
            <Col md={3} xs={12} className="" >
                {/* <PostsList cardHeight={maxCardHeight} /> */}
                <h3>Тут ничего интересного?</h3>
                <h3>А чего ты ждал?</h3>
                <h3>Что то будет...</h3>
                <h6> а когда....</h6>
            </Col>
            <Col md={4} xs={12}>
                {/* <h1>СВИНЯ КУПИ СЕРВАК!!!</h1> */}
            </Col>
            <Col md={5} xs={12}>
                {/* <h1>Залогинься и напиши Диме что бы дал создавать колесо ебучее </h1> */}
            </Col>
        </Row>
    )
}