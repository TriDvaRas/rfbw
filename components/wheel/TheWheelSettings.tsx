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

interface Props {
    wheel: Wheel
    maxHeight: number
    onUpdate?: (upd: Partial<Wheel>) => void
    onReset?: () => void
    onSave?: () => Promise<any>
    doTestSpin?: (duration?: number) => void
}

export default function TheWheelSettings(props: Props) {
    const { wheel, onUpdate, maxHeight, onReset, onSave, doTestSpin } = props
    const border = hexRgb(wheel.borderColor || `#fff`)
    const bg = hexRgb(wheel.backgroundColor || `#fff`)
    const dot = hexRgb(wheel.dotColor || `#fff`)
    const pointer = hexRgb(wheel.pointerColor || `#fff`)
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState<ApiError | undefined>()

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

    const minSpin = 69
    const maxSpin = 420
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
                        <Col xl={12} lg={8} sm={12} xs={12} className='mb-4'>
                            <div className='d-inline-flex'>
                                <h4>Название колеса</h4>
                                <Badge className='ms-1 m-auto'>New</Badge>
                            </div>
                            <Form.Control required placeholder="Всмысле пустое?)" maxLength={64} defaultValue={wheel.title} onChange={(e) => handleChange({ title: e.target.value })} />
                        </Col>
                        <Col xl={6} lg={4} sm={6} xs={12} className='mb-4'>
                            <h4>Обводка</h4>
                            <ColorPicker
                                placement='right'
                                onChange={(color) => handleColorUpdate('borderColor', color)}
                                onPicked={(color) => handleColorUpdate('borderColor', color)}
                                defColor={{ rgb: { r: border.red, g: border.green, b: border.blue }, hex: wheel.borderColor || '#fff' }}
                            />
                        </Col>
                        <Col xl={6} lg={4} sm={6} xs={12} className='mb-4'>
                            <h4>Фон</h4>
                            <ColorPicker
                                placement='right'
                                onChange={(color) => handleColorUpdate('backgroundColor', color)}
                                onPicked={(color) => handleColorUpdate('backgroundColor', color)}
                                defColor={{ rgb: { r: bg.red, g: bg.green, b: bg.blue }, hex: wheel.backgroundColor || '#fff' }}
                            />
                        </Col>
                        <Col xl={6} lg={4} sm={6} xs={12} className='mb-4'>
                            <h4>Точка</h4>
                            <ColorPicker
                                placement='right'
                                onChange={(color) => handleColorUpdate('dotColor', color)}
                                onPicked={(color) => handleColorUpdate('dotColor', color)}
                                defColor={{ rgb: { r: dot.red, g: dot.green, b: dot.blue }, hex: wheel.dotColor || '#fff' }}
                            />
                        </Col>
                        <Col xl={6} lg={4} sm={6} xs={12} className='mb-4'>
                            <h4>Стрелка</h4>
                            <ColorPicker
                                placement='right'
                                onChange={(color) => handleColorUpdate('pointerColor', color)}
                                onPicked={(color) => handleColorUpdate('pointerColor', color)}
                                defColor={{ rgb: { r: pointer.red, g: pointer.green, b: pointer.blue }, hex: wheel.pointerColor || '#fff' }}
                            />
                        </Col>
                        <Col xl={12} lg={6} sm={12} xs={12} className='mb-4'>
                            <div className='d-inline-flex'>
                                <h4>Минимум оборотов</h4>
                                <Badge className='ms-1 m-auto'>New</Badge>
                            </div>
                            <Form.Control required type={'number'} step={1} min={minSpin} max={maxSpin} defaultValue={wheel.minimalSpin} isValid={validated ? !!wheel.minimalSpin && wheel.minimalSpin >= minSpin && wheel.minimalSpin <= maxSpin : undefined} onChange={(e) => handleChange({ minimalSpin: +e.target.value })} />
                            <Form.Control.Feedback type="invalid">
                                {!wheel.minimalSpin || wheel.minimalSpin < minSpin ? 'Слабенько. Давай побольше' : 'Ну это ты загнул. Успокойся '}
                            </Form.Control.Feedback>
                            <Form.Text className="text-dark-200">
                                Длительность всегда 40 секунд (но это не точно)
                            </Form.Text>
                        </Col>
                        <Col xl={12} lg={12} sm={12} xs={12} className='mb-4'>
                            <div className='d-inline-flex'>
                                <h4>Звук прокрутки</h4>
                                <Badge className='ms-1 m-auto'>Soon™</Badge>
                            </div>
                            <AudioUpload
                                type='wheel'
                                audioId={wheel.audioId}
                                onUploaded={(audio) => {
                                    handleChange({ audioId: audio.id })
                                }} onError={(err) => {
                                    setError(err)
                                }} />
                            {
                                wheel.audioId && <ReactAudioPlayer
                                    ref={audioRef as any}
                                    src={`/api/audios/${wheel.audioId}`}
                                    volume={0.05}
                                    // controls
                                    preload='auto'
                                    onEnded={() => {
                                        if (doTestSpin)
                                            doTestSpin(0)
                                    }}
                                />
                            }
                        </Col>
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
                <Button variant='warning' onClick={() => {
                    const ae = (audioRef.current as any)?.audioEl.current as HTMLAudioElement
                    if (ae.paused) {
                        ae.play()
                        if (doTestSpin)
                            doTestSpin(153-15.5)
                    }
                    else {
                        ae.pause()
                        ae.currentTime = 0
                        if (doTestSpin)
                            doTestSpin(0)
                    }
                }}>{(audioRef.current as any)?.audioEl.current.paused ? 'Тест' : 'Стоп'}</Button>
                <div className="flex-grow-1 me-auto"></div>
                <Button className='ms-3' variant='secondary' disabled={isSaving} onClick={onReset}>Сброс</Button>
                <Button className='ms-3' variant='primary' disabled={isSaving}
                    onClick={handleSave}>{isSaving ? <Spinner animation={'border'} size='sm' /> : 'Сохранить'}</Button>
            </div>
            {/* </Card.Footer> */}
        </Card >

    )
}


