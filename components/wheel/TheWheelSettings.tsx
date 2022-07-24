import { Card, Alert, Row, Col, Form, Button, Badge, Spinner } from 'react-bootstrap';
import { useWindowSize } from 'usehooks-ts';
import { Audio, Wheel, WheelItem } from '../../database/db';
import TheWheelSlice from './TheWheelSlice';
import useWheel from '../../data/useWheel';
import LoadingDots from '../LoadingDots';
import ColorPicker from '../ColorPicker';
import { IColor } from '../ColorPicker';
import hexRgb from 'hex-rgb';
import { useState } from 'react';
import { ApiError } from '../../types/common-api';
import { parseApiError } from '../../util/error';
import { useRef } from 'react';
import AudioUpload from '../AudioUpload';
import ReactAudioPlayer from 'react-audio-player';
import useDelayedState from 'use-delayed-state';
import { useSession } from 'next-auth/react';

interface Props {
    wheel: Wheel
    maxHeight: number
    onUpdate?: (upd: Partial<Wheel>) => void
    onReset?: () => void
    onSave?: () => Promise<any>
    doTestSpin?: (stop?: boolean) => void
}

export default function TheWheelSettings(props: Props) {
    const { wheel, onUpdate, maxHeight, onReset, onSave, doTestSpin } = props
    const session = useSession()
    const border = hexRgb(wheel.borderColor || `#fff`)
    const bg = hexRgb(wheel.backgroundColor || `#fff`)
    const dot = hexRgb(wheel.dotColor || `#fff`)
    const pointer = hexRgb(wheel.pointerColor || `#fff`)
    const [isSaving, setIsSaving] = useState(false)
    const [isAudioUploading, setIsAudioUploading] = useState(false)
    const [error, setError] = useState<ApiError | undefined>()
    const [audioStopTimeoutId, setAudioStopTimeoutId] = useState<any>()

    const [isTestSpinning, setIsTestSpinning] = useState(false)
    const [allowTestSpin, setAllowTestSpin, cancelSetAllowTestSpin] = useDelayedState(true)
    const formRef = useRef<HTMLFormElement>()
    const [validated, setValidated] = useState(false)

    const audioRef = useRef<HTMLAudioElement>(null);

    function handleColorUpdate(field: 'dotColor' | 'backgroundColor' | 'borderColor' | 'pointerColor', color: IColor) {
        const upd: Partial<Wheel> = {}
        upd[field] = color.hex
        if (onUpdate)
            onUpdate(upd)
    }
    function handleChange(upd: Partial<Wheel>) {
        if (onUpdate)
            onUpdate(upd)
    }
    function handleSubmit(event: any) {
        event.preventDefault();
        event.stopPropagation();
    };
    function handleSave(event: any) {
        const form = formRef.current as any
        console.log(form);
        if (form.checkValidity() === false) {
            setValidated(true);
        }
        else {
            setIsSaving(true)
            onSave && onSave().then(() => {
                setIsSaving(false)
            }).catch((err) => {
                setError(parseApiError(err))
                setIsSaving(false)
            })
        }
    };

    const minSpinCount = 98
    const maxSpinCount = 3425
    const minSpinDuration = 30
    const maxSpinDuration = 300
    const minSpinDelay = 0
    const maxSpinDelay = 70
    return (
        <Card
            bg='dark'
            text='light'
            className="h-100 m-3 "
            border={"dark"}
            style={{ maxHeight }}
        >
            <Card.Body className="" style={{ overflow: 'auto' }}>
                <Form onSubmit={handleSubmit} ref={formRef as any} validated={validated}>
                    <Row>
                        {wheel.locked && <Alert variant='warning'>
                            Я вам запрещаю редактировать это колесо
                        </Alert>}
                        <Col xl={12} lg={12} sm={12} xs={12} className='mb-3'>
                            <div className='d-inline-flex'>
                                <h4>Название колеса</h4>
                                <Badge className='ms-1 m-auto'>New</Badge>
                            </div>
                            <Form.Control disabled={wheel.locked || isAudioUploading || isSaving} required placeholder="Всмысле пустое?)" maxLength={64} defaultValue={wheel.title} onChange={(e) => handleChange({ title: e.target.value })} />
                        </Col>
                        <Col xl={6} lg={3} sm={6} xs={12} className='mb-3'>
                            <h4>Обводка</h4>
                            <ColorPicker
                                disabled={wheel.locked || isAudioUploading || isSaving}
                                placement='right'
                                onChange={(color) => handleColorUpdate('borderColor', color)}
                                onPicked={(color) => handleColorUpdate('borderColor', color)}
                                defColor={{ rgb: { r: border.red, g: border.green, b: border.blue }, hex: wheel.borderColor || '#fff' }}
                            />
                        </Col>
                        <Col xl={6} lg={3} sm={6} xs={12} className='mb-3'>
                            <h4>Фон</h4>
                            <ColorPicker
                                disabled={wheel.locked || isAudioUploading || isSaving}
                                placement='right'
                                onChange={(color) => handleColorUpdate('backgroundColor', color)}
                                onPicked={(color) => handleColorUpdate('backgroundColor', color)}
                                defColor={{ rgb: { r: bg.red, g: bg.green, b: bg.blue }, hex: wheel.backgroundColor || '#fff' }}
                            />
                        </Col>
                        <Col xl={6} lg={3} sm={6} xs={12} className='mb-3'>
                            <h4>Точка</h4>
                            <ColorPicker
                                disabled={wheel.locked || isAudioUploading || isSaving}
                                placement='right'
                                onChange={(color) => handleColorUpdate('dotColor', color)}
                                onPicked={(color) => handleColorUpdate('dotColor', color)}
                                defColor={{ rgb: { r: dot.red, g: dot.green, b: dot.blue }, hex: wheel.dotColor || '#fff' }}
                            />
                        </Col>
                        <Col xl={6} lg={3} sm={6} xs={12} className='mb-3'>
                            <h4>Стрелка</h4>
                            <ColorPicker
                                disabled={wheel.locked || isAudioUploading || isSaving}
                                placement='right'
                                onChange={(color) => handleColorUpdate('pointerColor', color)}
                                onPicked={(color) => handleColorUpdate('pointerColor', color)}
                                defColor={{ rgb: { r: pointer.red, g: pointer.green, b: pointer.blue }, hex: wheel.pointerColor || '#fff' }}
                            />
                        </Col>
                        <Col xl={12} lg={6} sm={12} xs={12} className='mb-3'>
                            <div className='d-inline-flex'>
                                <h4>Задержка прокрутки</h4>
                                <Badge className='ms-1 m-auto'>New</Badge>
                            </div>
                            <Form.Control disabled={wheel.locked || isAudioUploading || isSaving || isTestSpinning} required type={'number'} step={.1} min={minSpinDelay} max={maxSpinDelay} defaultValue={wheel.prespinDuration} isValid={validated ? !!wheel.prespinDuration && wheel.prespinDuration >= minSpinDelay && wheel.prespinDuration <= maxSpinDelay : undefined} onChange={(e) => handleChange({ prespinDuration: +e.target.value })} />
                            <Form.Control.Feedback type="invalid">
                                {!wheel.prespinDuration || wheel.prespinDuration < minSpinCount ? 'Ну ты придумал...' : 'Постирония это хорошо, но давай поменьше'}
                            </Form.Control.Feedback>
                        </Col>
                        <Col xl={12} lg={6} sm={12} xs={12} className='mb-3'>
                            <div className='d-inline-flex'>
                                <h4>Длительность прокрутки</h4>
                                <Badge className='ms-1 m-auto'>New</Badge>
                            </div>
                            <Form.Control disabled={wheel.locked || isAudioUploading || isSaving || isTestSpinning} required type={'number'} step={.1} min={minSpinDuration} max={maxSpinDuration} defaultValue={wheel.spinDuration} isValid={validated ? !!wheel.spinDuration && wheel.spinDuration >= minSpinDuration && wheel.spinDuration <= maxSpinDuration : undefined} onChange={(e) => handleChange({ spinDuration: +e.target.value })} />
                            <Form.Control.Feedback type="invalid">
                                {!wheel.spinDuration || wheel.spinDuration < minSpinDuration ? 'Скучновато получается, попробуй побольше' : 'Никто не будет три года на это смотреть'}
                            </Form.Control.Feedback>
                        </Col>
                        <Col xl={12} lg={6} sm={12} xs={12} className='mb-3'>
                            <div className='d-inline-flex'>
                                <h4>Полных оборотов</h4>
                                <Badge className='ms-1 m-auto'>New</Badge>
                            </div>
                            <Form.Control disabled={wheel.locked || isAudioUploading || isSaving || isTestSpinning} required type={'number'} step={1} min={minSpinCount} max={maxSpinCount} defaultValue={wheel.minimalSpin} isValid={validated ? !!wheel.minimalSpin && wheel.minimalSpin >= minSpinCount && wheel.minimalSpin <= maxSpinCount : undefined} onChange={(e) => handleChange({ minimalSpin: +e.target.value })} />
                            <Form.Control.Feedback type="invalid">
                                {!wheel.minimalSpin || wheel.minimalSpin < minSpinCount ? 'Слабенько. Давай побольше' : 'Ну это ты загнул. Успокойся '}
                            </Form.Control.Feedback>
                        </Col>
                        <Col xl={12} lg={6} sm={12} xs={12} className=''>
                            <div className='d-inline-flex'>
                                <h4>Звук прокрутки</h4>
                                <Badge className='ms-1 m-auto'>New</Badge>
                            </div>
                            <AudioUpload
                                onUploadStarted={() => setIsAudioUploading(true)}
                                compact
                                disabled={wheel.locked || isSaving || isTestSpinning}
                                type='wheel'
                                audioId={wheel.audioId}
                                onUploaded={(audio) => {
                                    handleChange({ audioId: audio.id })
                                    setIsAudioUploading(false)
                                }} onError={(err) => {
                                    setError(err)
                                    setIsAudioUploading(false)
                                }} />
                            {
                                wheel.audioId && <ReactAudioPlayer
                                    ref={audioRef as any}
                                    src={`/api/audios/${wheel.audioId}`}
                                    volume={0.03}
                                    // controls
                                    preload='auto'
                                    onEnded={() => {
                                        setIsTestSpinning(false)
                                        if (doTestSpin)
                                            doTestSpin(true)
                                        if (audioStopTimeoutId)
                                            audioStopTimeoutId()
                                    }}
                                />
                            }
                        </Col>
                        {
                            session.data?.user.isAdmin && <Card className='mt-1' bg='dark' text='light' border='danger'>
                                <Row className='p-1 '>
                                    <Col >
                                        <Form.Check className='ms-1 mt-1' type={'switch'} label='Locked' disabled={isSaving || isTestSpinning} defaultChecked={wheel.locked} onChange={e => handleChange({ locked: e.target.checked })} />
                                    </Col>
                                    <Col >
                                        <Form.Check className='ms-1 mt-1' type={'switch'} label='Approved' disabled={isSaving || isTestSpinning} defaultChecked={wheel.approved} onChange={e => handleChange({ approved: e.target.checked })} />
                                    </Col>
                                </Row>
                            </Card>
                        }
                        {error ?
                            <Col>
                                <Alert className='mb-0' variant={'danger'}>
                                    {error.error}
                                </Alert>
                            </Col> : null}
                    </Row>
                </Form>

            </Card.Body>
            {/* <Card.Footer> */}
            <div className='d-flex justify-content-end m-3'>
                <div className="flex-grow-1 me-auto"></div>
                <Button disabled={!allowTestSpin || isAudioUploading || isSaving} variant='warning' onClick={() => {
                    const ae = (audioRef.current as any)?.audioEl.current as HTMLAudioElement
                    if (!isTestSpinning) {
                        if (audioStopTimeoutId)
                            clearTimeout(audioStopTimeoutId)

                        ae.play()
                        setIsTestSpinning(true)
                        if (doTestSpin)
                            doTestSpin()
                        setAudioStopTimeoutId(setTimeout(() => {
                            ae.pause()
                            ae.currentTime = 0
                        }, (wheel.spinDuration + wheel.prespinDuration) * 1000 + 30) as any)
                    }
                    else {
                        if (audioStopTimeoutId)
                            clearTimeout(audioStopTimeoutId)
                        ae.pause()
                        ae.currentTime = 0
                        setIsTestSpinning(false)
                        setAllowTestSpin(false)
                        setAllowTestSpin(true, 800)
                        if (doTestSpin)
                            doTestSpin(true)
                    }
                }}>{(audioRef.current as any)?.audioEl.current.paused ? 'Тест' : 'Стоп'}</Button>
                {/* <Button className='ms-3' variant='secondary' disabled={isAudioUploading || isSaving || isTestSpinning} onClick={onReset}>Сброс</Button> */}
                <Button className='ms-3' variant='primary' disabled={isAudioUploading || isSaving}
                    onClick={handleSave}>{isSaving ? <Spinner animation={'border'} size='sm' /> : 'Сохранить'}</Button>
            </div>
            {/* </Card.Footer> */}
        </Card >

    )
}


