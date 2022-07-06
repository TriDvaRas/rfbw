import axios from 'axios';
import React, { useEffect, useState } from 'react'

import {
    Row,
    Col,
    Container
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import LoadingDots from '../../components/LoadingDots';
import PlayerAboutCard from '../playerAbout/PlayerAboutCard';
import PlayerAboutCardEdit from '../playerAbout/PlayerAboutCardEdit';
import { newToast } from '../toasts/toastsSlice';
import MeNavCard from './MeNavCard';
import { fetchMyPlayer, selectMyPlayer } from './myPlayerSlice';

interface Props {
    maxCardHeight: number;
}

export default function MePlayerEditor(props: Props) {
    const { maxCardHeight } = props
    const myPlayer = useSelector(selectMyPlayer)
    const dispatch = useDispatch()
    // const [player, setPlayer] = useState(myPlayer.player)
    const [isSaving, setIsSaving] = useState(false)
    const player = myPlayer.player
    useEffect(() => {
        if (myPlayer.status === 'idle') {
            dispatch(fetchMyPlayer())
        }
    }, [myPlayer.status, dispatch])
    // useEffect(() => {
    //     setPlayer(myPlayer.player)
    // }, [myPlayer.player])
    function handleSave(newData: { name: string, about: string, picture?: string }) {
        setIsSaving(true)
        axios.post(`/api/players/me`, newData, {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }).then(
            () => {
                setIsSaving(false)
                dispatch(newToast({
                    id: Math.random(),
                    date: `${Date.now()}`,
                    type: 'success',
                    title: 'Сохранил',
                    autohide: 5000
                }))
            },
            (err) => {
                setIsSaving(false)
                dispatch(newToast({
                    id: Math.random(),
                    date: `${Date.now()}`,
                    type: 'error',
                    title: 'Ошибка',
                    text: err.response.data,
                }))
            })
    }
    return (
        <Container fluid>
            <Row className="">
                <Col md={3} xs={12} className=" " >
                    {
                        player ?
                            <PlayerAboutCard player={player} /> :
                            <LoadingDots />
                    }
                </Col>
                <Col md={6} xs={12} className='px-0'>
                    {
                        player ?
                            <PlayerAboutCardEdit onSave={handleSave} player={player} isSaving={isSaving} /> :
                            <LoadingDots />
                    }
                </Col>
                <Col md={3} xs={12}>
                    <MeNavCard cardHeight={maxCardHeight - 32} />
                </Col>
            </Row>
        </Container>
    )
}