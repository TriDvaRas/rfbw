import hexRgb from 'hex-rgb';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Badge,
    Button, Card, Col, Collapse, Form, Modal, Row, Spinner
} from 'react-bootstrap';
import Dropzone from 'react-dropzone';
import TextareaAutosize from 'react-textarea-autosize';
import { Image, Wheel, WheelItem, WheelItemImageMode, WheelItemType } from '../../database/db';
import { ApiError } from '../../types/common-api';
import { parseApiError } from '../../util/error';
import ColorPicker, { IColor } from '../ColorPicker';
import ImageUpload from '../ImageUpload';
import TheWheel from '../wheel/TheWheel';


interface Props {
    show: boolean;
    wheel: Wheel
    wheelItems: WheelItem[];
    selectedItem: WheelItem;
    onCancel: () => void
    onUpdate: (upd: Partial<WheelItem>) => void;
    onSave: () => Promise<any>
    modalClassName?: string;

}
export default function WheelItemEditModal(props: Props) {
    const { wheel, wheelItems, selectedItem, modalClassName, onCancel, onUpdate, onSave } = props
    const [show, setShow] = useState(props.show)
    useEffect(() => {
        setShow(props.show)
    }, [props.show])


    const [image, setImage] = useState<Image | undefined>()
    const [error, setError] = useState<ApiError | undefined>()
    const [isImageUploading, setIsImageUploading] = useState(false)

    const [isSaving, setIsSaving] = useState(false)

    const altColor = hexRgb(selectedItem.altColor || `#fff`)
    const fontColor = hexRgb(selectedItem.fontColor || `#fff`)

    function handleChange(upd: Partial<WheelItem>) {
        if (onUpdate)
            onUpdate(upd)
    }

    return (
        <Modal
            {...{ show }}
            backdrop={'static'}
            dialogClassName={modalClassName || ''}
            contentClassName='border-dark shadow'
            centered={true}
            size={'xl'}
        >

            <Modal.Header className='bg-dark-700 text-light border-dark'>
                <Modal.Title >Изменение Задания</Modal.Title>
            </Modal.Header>
            <Modal.Body className='bg-dark-750 text-light'>
                <Row style={{ overflow: 'hidden' }}>
                    <Col style={{ marginLeft: '-300px' }}>
                        <TheWheel
                            noCard
                            items={wheelItems}
                            height={600}
                            wheel={wheel}
                            selectItemIndex={selectedItem.position}
                            autoSpinAfter={10}
                            extraSpin={wheelItems.length}
                            spinDuration={0.7}
                            highlightItemId={selectedItem.id}
                        />
                    </Col>
                    <Col>
                        <Form>
                            <Row>
                                <Form.Group as={Col} className='mb-3' >
                                    <Form.Label>Ярлык</Form.Label>
                                    <Form.Control as={'input'} maxLength={16} disabled={isImageUploading || isSaving} defaultValue={selectedItem.label} onChange={e => handleChange({ label: e.target.value })} />
                                    <Form.Check className='ms-1 mt-1' type={'switch'} label={<div >Скрыть <Badge className='ms-1'>New</Badge></div>} disabled={isImageUploading || isSaving} defaultChecked={!selectedItem.showText} onChange={e => handleChange({ showText: !e.target.checked })} />
                                </Form.Group>
                                <Form.Group as={Col} className='mb-3'>
                                    <Form.Label>Длительность</Form.Label>
                                    <Form.Control type={'number'} disabled={isImageUploading || isSaving} defaultValue={selectedItem.hours}
                                        min={0.1} step={0.1} max={selectedItem.type === 'game' ? 30 : selectedItem.type === 'movie' ? 3.5 : 15}
                                        onChange={e => handleChange({ hours: +e.target.value })} />
                                </Form.Group>
                                <Form.Group as={Col} className='mb-3'>
                                    <Form.Label>Цвет Ярлыка</Form.Label>
                                    <ColorPicker
                                        placement='bottom'
                                        onChange={(color: IColor) => handleChange({ fontColor: color.hex })}
                                        defColor={{ rgb: { r: fontColor.red, g: fontColor.green, b: fontColor.blue }, hex: selectedItem.fontColor || '#fff' }}
                                    />
                                </Form.Group>
                                <Form.Group as={Col} className='mb-3'>
                                    <Form.Label>Тип</Form.Label>
                                    <Form.Control as="select" disabled={isImageUploading || isSaving} defaultValue={selectedItem.type || null} onChange={e => handleChange({ type: e.target.value as WheelItemType })}>
                                        <option value="game" >Игра</option>
                                        <option value="anime" >Аниме</option>
                                        <option value="movie" >Фильм</option>
                                        <option value="series" >Сериал</option>
                                        <option value="null" hidden >Блять</option>
                                    </Form.Control>
                                </Form.Group>
                            </Row>
                            <Form.Group className='mb-3'>
                                <Form.Label>Полное название</Form.Label>
                                <Form.Control as={'input'} maxLength={192} disabled={isImageUploading || isSaving} defaultValue={selectedItem.title} onChange={e => handleChange({ title: e.target.value })} />
                            </Form.Group>
                            <Collapse
                                appear
                                in={selectedItem.type === 'game'}

                            >
                                <Row>
                                    <Form.Group as={Col} className='mb-3'>
                                        <Form.Label>Макс игроков</Form.Label>
                                        <Form.Control type={'number'} disabled={isImageUploading || isSaving} defaultValue={selectedItem.maxCoopPlayers} min={1} step={1}
                                            onChange={e => handleChange({ hasCoop: +e.target.value !== 1, maxCoopPlayers: +e.target.value })}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} className='mb-3'>
                                        <Form.Label>С выбором сложности</Form.Label>
                                        <Form.Control as="select" disabled={isImageUploading || isSaving} defaultValue={`${selectedItem.hasDifficulty}`} onChange={e => handleChange({ hasDifficulty: !!e.target.value })}>
                                            <option value="true">Да</option>
                                            <option value="false" >Нет</option>
                                            <option value="null" hidden >Блять</option>
                                        </Form.Control>
                                    </Form.Group>
                                </Row>
                            </Collapse>
                            <Row>
                                <Col xs={8} className='mb-3'>
                                    <Form.Label>Картинка</Form.Label>
                                    <ImageUpload
                                        compact
                                        imageType='wheelitem'
                                        onUploadStarted={() => setIsImageUploading(true)}
                                        onError={(err) => {
                                            setIsImageUploading(false)
                                            setError(err)
                                        }}
                                        onUploaded={(image) => {
                                            setIsImageUploading(false)
                                            setImage(image)
                                            handleChange({ imageId: image.id })
                                        }}

                                    />
                                </Col>
                                <Form.Group as={Col} xs={4} className='mb-3'>
                                    <Form.Label>Выравнивание</Form.Label>
                                    <Form.Control as="select"
                                        disabled={isImageUploading || isSaving}
                                        defaultValue={selectedItem.imageMode || null}
                                        onChange={e => handleChange({ imageMode: e.target.value as WheelItemImageMode })}
                                    >
                                        <option value="height" >По высоте</option>
                                        <option value="width" >По ширине</option>
                                        <option value="null" hidden >Блять</option>
                                    </Form.Control>
                                </Form.Group>
                            </Row>
                            {/* <Row>
                                <Form.Group as={Col} className='mb-3'>
                                    <Form.Label>Цвет Фона</Form.Label>
                                    <ColorPicker
                                        placement='top'
                                        onChange={(color: IColor) => handleChange({ altColor: color.hex })}
                                        defColor={{ rgb: { r: altColor.red, g: altColor.green, b: altColor.blue }, hex: selectedItem.altColor || '#fff' }}
                                    />
                                </Form.Group>
                            </Row> */}
                            <Form.Group className='mb-3'>
                                <Form.Label>Комментарии</Form.Label>
                                <Form.Control as={TextareaAutosize} style={{ resize: 'none' }} disabled={isImageUploading || isSaving} defaultValue={selectedItem.comments} onChange={e => handleChange({ comments: e.target.value })} />
                            </Form.Group>
                            <Form.Group className='mb-3'>
                                <Form.Label>Звук выпадения<Badge className='ms-1'>Soon™</Badge></Form.Label>
                            </Form.Group>
                            {error ?
                                <Form.Group className='mb-3'>
                                    <Alert className='mb-0' variant={'danger'}>
                                        {error.error}
                                    </Alert>
                                </Form.Group> : null}
                            <Form.Group className='mb-3'>
                                <div className='d-flex justify-content-end m-3 '>
                                    <div className="flex-grow-1 me-auto"></div>
                                    <Button className='ms-3' variant='secondary' disabled={isImageUploading || isSaving} onClick={() => {
                                        setShow(false)
                                        if (onCancel)
                                            onCancel()
                                    }}>Отмена</Button>
                                    <Button className='ms-3' variant='primary' disabled={isImageUploading || isSaving}
                                        onClick={() => {
                                            setIsSaving(true)
                                            onSave && onSave().then(() => {
                                                setIsSaving(false)
                                                setShow(false)
                                            }).catch((error) => {
                                                setError(parseApiError(error))
                                                setIsSaving(false)

                                            })
                                        }}>{isSaving ? <Spinner animation={'border'} size='sm' /> : 'Сохранить'}</Button>
                                </div>
                            </Form.Group>

                        </Form>

                    </Col>

                </Row>
            </Modal.Body>
        </Modal>
    );
}