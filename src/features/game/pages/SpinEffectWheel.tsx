import axios from 'axios'
import $ from 'jquery'
import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Container, Modal, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { IEffect } from '../../../util/interfaces'
import EffectCard from '../../effects/EffectCard'
import { selectEffects, setEffectsWheelSpinning } from '../../effects/effectsSlice'
import { selectMyPlayer } from '../../me/myPlayerSlice'
import { newToast } from '../../toasts/toastsSlice'
import EffectsWheel from '../../wheel/EffectsWheel'
import MyActiveEffects from '../cards/MyActiveEffects'
import { selectMyEffects } from '../myEffectsSlice'
interface Props {
    height: number;
}
export default function SpinEffectWheel(props: Props) {
    const { height } = props
    const effects = useSelector(selectEffects)
    const myPlayer = useSelector(selectMyPlayer)
    const dispatch = useDispatch()
    const myEffects = useSelector(selectMyEffects)


    const [selectItemId, setSelectItemId] = useState<number>()
    const [fullSpins, setFullSpins] = useState<number>()
    const [spinDuration, setSpinDuration] = useState<number>()
    const [result, setResult] = useState<IEffect | null>()

    const [prespin, setPrespin] = useState<boolean>(false)
    const [spin, setSpin] = useState<boolean>(false)
    const [showResult, setShowResult] = useState<boolean>(false)
    const [extraSpin, setExtraspin] = useState<number>(0)


    const [redirectTo, setRedirectTo] = useState<string>()


    const [controlsHeight, setControlsHeight] = useState(0)
    function handleSpin() {
        dispatch(setEffectsWheelSpinning(true))
        setPrespin(true)
        const playableEffects = effects.effects?.filter(x => x.groupId < 40 || x.groupId >= 50).filter(x => x.cooldown === 0).sort((a, b) => a.shuffleValue - b.shuffleValue) || []
        axios.post(`/api/game/spineffects`, {
            effects: playableEffects.map((effect, i) => ({
                id: effect.id,
                i,
                cooldown: effect.cooldown
            }))
        })
            .then((response) => {
                setExtraspin(0.95 / (1 + Math.exp(9 * (0.5 - Math.random()))) - 0.5)
                setSelectItemId(response.data.selectItemId)
                setFullSpins(response.data.fullSpins)
                setSpinDuration(response.data.spinDuration)
                setPrespin(false)
                setSpin(true)
                setTimeout(() => {
                    effects.effects &&
                        setResult(playableEffects[response.data.selectItemId] as IEffect)
                    setShowResult(true)
                }, response.data.spinDuration * 1000 + 250)
            },
                (err) => {
                    dispatch(setEffectsWheelSpinning(false))
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
    useEffect(() => {
        setControlsHeight($(`#spin-controls-card`)?.outerHeight() || 0)
    }, [height])
    function handleOkPressed() {
        setShowResult(false)
        setTimeout(() => {
            if (!myEffects.effects?.find(x => x.effect.id === 35))
                setRedirectTo('/game/play')
            else {
                setSpin(false)
                // setSelectItemId(0)
                // setFullSpins(0)
                // setSpinDuration(0)
                setResult(null)
            }
            dispatch(setEffectsWheelSpinning(false))
        }, 200)
    }

    return <Container className='my-0' fluid>
        {redirectTo && <Navigate to={redirectTo} />}
        <Modal contentClassName='bg-dark text-light' show={showResult} animation={true} centered>
            {result && <EffectCard effect={result} onOk={handleOkPressed} />}
        </Modal>

        <Row>
            <Col md={8} xs={12}>
                < Card className='bg-dark my-3' >
                    <EffectsWheel
                        items={effects.effects?.filter(x => (x.groupId < 40 || x.groupId >= 50)).filter(x => x.cooldown === 0).sort((a, b) => a.shuffleValue - b.shuffleValue) || []}
                        height={height - 130}
                        borderColor={'#ffff'}
                        pointerColor={'#FF7113'}
                        dotColor={'#FF7113'}
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
                        <Button disabled={prespin || spin} variant='secondary' className='w-100 mt-3' onClick={() => { setRedirectTo('/game/play') }}>Вернуться в меню</Button>
                    </Card.Body>
                </Card >
                <MyActiveEffects myEffects={myEffects.effects} maxHeight={height - 116 - controlsHeight} />
            </Col>
        </Row>
    </Container >
}