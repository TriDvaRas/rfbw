import React, { useEffect } from 'react';
import {
    Col, Container, Row
} from 'react-bootstrap';
import Scrollbars from 'react-custom-scrollbars-2';
import { useDispatch, useSelector } from 'react-redux';
import LoadingDots from '../../components/LoadingDots';
import PlayerAboutCard from '../playerAbout/PlayerAboutCard';
import { fetchPlayers, selectPlayers } from './playersSlice';

interface Props {
    height: number;
}
export default function PlayersList(props: Props) {
    const players = useSelector(selectPlayers)
    const dispatch = useDispatch()
    useEffect(() => {
        if (players.status === 'idle') {
            dispatch(fetchPlayers())
        }
    }, [players.status, dispatch])
    return (
        <Scrollbars
            renderTrackHorizontal={() => <div className='hidden'></div>}
            autoHide={true}
            autoHeight
            autoHeightMax={props.height}
            autoHeightMin={props.height}>
            <Container fluid className='pb-3'>
                <Row className="">
                    {
                        !players.players ?
                            <LoadingDots /> :
                            players.players.map(player =>
                                <Col xl={3} md={4} sm={6} xs={12} >
                                    <PlayerAboutCard player={player} />
                                </Col>)
                    }
                </Row>
            </Container>
        </Scrollbars>

    )
}

