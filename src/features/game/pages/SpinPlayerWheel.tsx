import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Row, Col, Card, Container, Button, Modal } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { Navigate } from 'react-router-dom'
import LoadingDots from '../../../components/LoadingDots'
import { IWheel, IWheelItem } from '../../../util/interfaces'
import { fetchMyPlayer, selectMyPlayer } from '../../me/myPlayerSlice'
import { fetchPlayers, selectPlayers } from '../../players/playersSlice'
import { newToast } from '../../toasts/toastsSlice'
import Wheel from '../../wheel/Wheel'
import { selectWheels, fetchWheels } from '../../wheels/wheelsSlice'
import ChooseWheel from '../modals/ChooseWheel'
import TaskPreview from '../cards/TaskPreview'
import MyActiveEffects from '../cards/MyActiveEffects'
import { selectMyEffects, fetchMyEffects } from '../myEffectsSlice'
import { applyEffects } from '../../../util/effects'
import useWindowDimensions from '../../../util/useWindowDimensions'
import $ from 'jquery'
interface Props {
    height: number;
}
export default function SpinPlayerWheel(props: Props) {
    const { height } = props
    const wheels = useSelector(selectWheels)
    const myPlayer = useSelector(selectMyPlayer)
    const dispatch = useDispatch()
    const myEffects = useSelector(selectMyEffects)
    useEffect(() => {
        if (wheels.status === 'idle') {
            dispatch(fetchWheels())
        }
    }, [wheels.status, dispatch])


    const [selectedWheel, setSelectedWheel] = useState<IWheel | null>(null)

    const [selectItemId, setSelectItemId] = useState<number>()
    const [fullSpins, setFullSpins] = useState<number>()
    const [spinDuration, setSpinDuration] = useState<number>()
    const [result, setResult] = useState<IWheelItem>()

    const [prespin, setPrespin] = useState<boolean>(false)
    const [spin, setSpin] = useState<boolean>(false)
    const [showResult, setShowResult] = useState<boolean>(false)
    const [extraSpin, setExtraspin] = useState<number>(0)

    const [redirectTo, setRedirectTo] = useState<string>()
    const [filteredWheels, setFilteredWheels] = useState<Array<IWheel>>()


    const [controlsHeight, setControlsHeight] = useState(0)
    function handleSpin() {
        if (selectedWheel) {
            setPrespin(true)
            axios.post(`/api/game/spin`, {
                wheel: selectedWheel.id,
                items: selectedWheel.items?.map((item, i) => ({
                    id: item.id,
                    i,
                    disabled: item.disabled
                }))
            })
                .then((response) => {
                    setExtraspin((Math.sqrt(Math.random()) - 0.5) * .99)
                    setSelectItemId(response.data.selectItemId)
                    setFullSpins(response.data.fullSpins)
                    setSpinDuration(response.data.spinDuration)
                    setPrespin(false)
                    setSpin(true)
                    setTimeout(() => {
                        selectedWheel.items &&
                            setResult(selectedWheel.items[response.data.selectItemId] as IWheelItem)
                        setShowResult(true)
                    }, response.data.spinDuration * 1000 + 250)
                },
                    (err) => {
                        setPrespin(false)
                        dispatch(newToast({
                            id: Math.random(),
                            date: `${Date.now()}`,
                            type: 'error',
                            title: 'Ошибка',
                            text: err.response.data,
                        }))
                    })
        }
    }
    useEffect(() => {
        setControlsHeight($(`#spin-controls-card`)?.outerHeight() || 0)
    }, [height])
    function handleCancel() {
        setSelectedWheel(null)
        setPrespin(false)
        setSpin(false)
    }
    function handleOkPressed() {
        setShowResult(false)
        setTimeout(() => setRedirectTo('/game/play'), 200)
    }
    useEffect(() => {
        if (wheels.wheels && myEffects.effects && !selectedWheel) {
            
            setFilteredWheels(applyEffects(wheels.wheels, myEffects.effects).filter(x => x.ownerId !== myPlayer.player?.id))
        }
    }, [myEffects.effects, myPlayer.player?.id, selectedWheel, wheels.wheels])
    useEffect(() => {
        if (filteredWheels?.length === 1)
            setSelectedWheel(filteredWheels[0])
    }, [filteredWheels])
    return <Container className='my-0' fluid>
        {redirectTo && <Navigate to={redirectTo} />}
        <Modal contentClassName='bg-dark' show={showResult} animation={true} centered>
            {result && <TaskPreview task={result} onOk={handleOkPressed} />}
        </Modal>
        <Modal contentClassName='bg-dark' show={!selectedWheel} animation={true} centered >
            <ChooseWheel wheels={filteredWheels} onWheelSelect={setSelectedWheel} />
        </Modal>
        <Row>
            <Col md={8} xs={12}>
                < Card className='bg-dark my-3' >
                    <Wheel
                        items={selectedWheel?.items as Array<IWheelItem> || []}
                        height={height - 130}
                        borderColor={selectedWheel?.border}
                        wheelColor={selectedWheel?.background}
                        pointerColor={selectedWheel?.pointer}
                        dotColor={selectedWheel?.dot}
                        spinDuration={spinDuration}
                        fullSpins={fullSpins}
                        selectItemId={selectItemId}
                        spin={spin}
                        prespin={prespin}
                        extraSpin={extraSpin}
                    />
                </Card >
            </Col>
            <Col md={4} xs={12}>
                < Card className='bg-dark my-3' id='spin-controls-card' >
                    <Card.Header>
                        <h3>Я вам разрешаю крутить</h3>
                    </Card.Header>
                    <Card.Body>
                        <Button disabled={prespin || spin} variant='warning' className='w-100 mb-3 fs-2' onClick={() => handleSpin()}>Крутите барабан</Button>
                        <Button disabled={prespin || spin || filteredWheels?.length === 1} variant='secondary' className='w-100 ' onClick={() => handleCancel()}>Выбрать другое колесо</Button>
                        <Button disabled={prespin || spin} variant='secondary' className='w-100 mt-3' onClick={() => { setRedirectTo('/game/play') }}>Вернуться в меню</Button>
                    </Card.Body>
                </Card >
                <MyActiveEffects myEffects={myEffects.effects} maxHeight={height - 116 - controlsHeight} />
            </Col>
        </Row>
    </Container >
}