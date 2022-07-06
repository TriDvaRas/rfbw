import hexRgb from 'hex-rgb';
import React, { useState } from 'react';
import {
    Button, Card, Col, Collapse, Form, Modal, Row, Spinner
} from 'react-bootstrap';
import Dropzone from 'react-dropzone';
import { useDispatch } from 'react-redux';
import TextareaAutosize from 'react-textarea-autosize';
import { IColor, IWheelItem } from '../../util/interfaces';
import Slider from '../../util/Slider';
import { updateItem } from '../me/myWheelSlice';
import WheelItemPreview from '../wheel/WheelItemPreview';
import ColorPicker from './ColorPicker';

interface Props {
    show: boolean;
    item: IWheelItem;
    onHide?: Function;
    onItemChange?: Function;
    onSave: Function;
    isSaving?: boolean;
    modalClassName?: string;
    children?: JSX.Element;
    withPreview?: boolean;
    defaultPreviewItemCount?: number;
}
export default function WheelItemEditModal(props: Props) {
    const { item, modalClassName, withPreview } = props
    const dispatch = useDispatch()
    const [labelField, setLabelField] = useState(item.label)
    const [hoursField, setHoursField] = useState(item.hours)
    const [titleField, setTitleField] = useState(item.title)
    const [imageFile, setImageFile] = useState<File | null>()
    const [typeField, setTypeField] = useState(item.type)
    const [imageModeField, setImageModeField] = useState(item.imageMode)
    const [color, setColor] = useState(item.altColor)
    const [fontColorField, setFontColorField] = useState(item.fontColor)
    const [commentsField, setCommentsField] = useState(item.comments || '')
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [maxPlayersField, setMaxPlayersField] = useState(item.coop)
    const [diffField, setDiffField] = useState(!!item.difficulty)

    const [previewItemCount, setPreviewItemCount] = useState(props.defaultPreviewItemCount || 20)

    const [isDraging, setIsDraging] = useState(false)
    const altColor = hexRgb(item.altColor || `#fff`)
    const fontColor = hexRgb(item.fontColor || `#fff`)
    function handleCancel() {
        setLabelField(item.label)
        setHoursField(item.hours)
        setTitleField(item.title)
        setImageFile(null)
        dispatch(updateItem({
            item: item
        }))
        if (props.onHide)
            props.onHide()
    }
    function handleSubmit() {
        const form = new FormData()
        if (imageFile)
            form.append("image", imageFile, imageFile.name)
        form.append("id", `${item.id}`)
        form.append("label", labelField)
        form.append("hours", `${hoursField}`)
        form.append("title", titleField)
        form.append("imageMode", imageModeField)
        form.append("fontColor", fontColorField)
        form.append("type", typeField)
        form.append("altColor", color)
        form.append("comments", commentsField)
        if (typeof maxPlayersField !== `undefined`)
            form.append("coop", `${maxPlayersField}`)
        if (typeof diffField !== `undefined`)
            form.append("difficulty", `${diffField}`)
        
        props.onSave(form, {
            id: `${item.id}`,
            label: labelField,
            hours: `${hoursField}`,
            title: titleField,
            imageMode: imageModeField,
            fontColor: fontColorField,
            type: typeField,
            altColor: color,
            comments: commentsField,
            image: imageFile ? URL.createObjectURL(imageFile) : null
        })
    }
    function handleColorChange(color: IColor) {
        setColor(color.hex)
        dispatch(updateItem({
            item: {
                id: item.id,
                altColor: color.hex
            }
        }))
    }
    function handleFontColorChange(color: IColor) {
        setFontColorField(color.hex)
        dispatch(updateItem({
            item: {
                id: item.id,
                fontColor: color.hex
            }
        }))
    }
    function handleLabelChange(event: any) {
        let cursorPos = 0 + event.target.selectionStart
        setLabelField(event.target.value.slice(0, 16))
        event.target.selectionStart = event.target.selectionEnd = cursorPos
        dispatch(updateItem({
            item: {
                id: item.id,
                label: event.target.value.slice(0, 16)
            }
        }))
    }
    function handleHoursChange(event: any) {
        if (event.target.value.match(/[.,]$/) || (+event.target.value > 0 && +event.target.value < 100) || event.target.value === '') {
            let cursorPos = 0 + event.target.selectionStart
            if (event.target.value.endsWith(`,`))
                event.target.value = event.target.value.replace(/,/g, '.')
            if (event.target.value.length > 0 && event.target.value.includes('.'))
                event.target.value = event.target.value.split('.')[1].length > 1 ? event.target.value.replace(/(\..).+/, `$1`) : event.target.value
            setHoursField(event.target.value)
            event.target.selectionStart = event.target.selectionEnd = cursorPos
            dispatch(updateItem({
                item: {
                    id: item.id,
                    hours: event.target.value
                }
            }))
        }
    }
    function handleMaxPlayersChange(event: any) {
        if ((+event.target.value > 0 && +event.target.value < 100) || event.target.value === '') {
            let cursorPos = 0 + event.target.selectionStart
            setMaxPlayersField(event.target.value)
            event.target.selectionStart = event.target.selectionEnd = cursorPos
            dispatch(updateItem({
                item: {
                    id: item.id,
                    coop: event.target.value
                }
            }))
        }
    }
    function handleTitleChange(event: any) {
        let cursorPos = 0 + event.target.selectionStart
        setTitleField(event.target.value.slice(0, 200))
        event.target.selectionStart = event.target.selectionEnd = cursorPos
        dispatch(updateItem({
            item: {
                id: item.id,
                title: event.target.value.slice(0, 200)
            }
        }))
    }
    function handleImageDrop(files: Array<any>) {
        setImageFile(files[0])
        Object.assign(files[0], {
            preview: URL.createObjectURL(files[0])
        })
        setImagePreview(files[0].preview)
        dispatch(updateItem({
            item: {
                id: item.id,
                image: files[0].preview
            }
        }))
    }
    function handleImageModeChange(event: any) {
        setImageModeField(event.target.value)
        dispatch(updateItem({
            item: {
                id: item.id,
                imageMode: event.target.value
            }
        }))
    }
    function handleTypeChange(event: any) {
        setTypeField(event.target.value)
        dispatch(updateItem({
            item: {
                id: item.id,
                type: event.target.value
            }
        }))
    }
    function handleDiffChange(event: any) {
        setDiffField(event.target.value)
        dispatch(updateItem({
            item: {
                id: item.id,
                difficulty: event.target.value ==='false'
            }
        }))
    }
    function handleCommentsChange(event: any) {
        let cursorPos = 0 + event.target.selectionStart
        setCommentsField(event.target.value.slice(0, 1024))
        event.target.selectionStart = event.target.selectionEnd = cursorPos
        dispatch(updateItem({
            item: {
                id: item.id,
                comments: event.target.value.slice(0, 1024)
            }
        }))
    }
    return (
        <Modal
            {...{ show: props.show }}
            backdrop={'static'}
            backdropClassName={modalClassName ? 'opacity-0' : ''}
            dialogClassName={modalClassName || ''}
            contentClassName='border-dark shadow'
            centered={!withPreview}
            size={withPreview ? 'xl' : 'lg'}
        >

            <Modal.Header className='bg-dark-700 text-light border-dark'>
                <Modal.Title >Изменение Задания</Modal.Title>
            </Modal.Header>
            <Modal.Body className='bg-dark-750 text-light'>
                <Row>
                    {!withPreview || <WheelItemPreview
                        item={{
                            ...item,
                            label: labelField,
                            title: titleField,
                            image: imagePreview || item.image,
                            type: typeField,
                            altColor: color,
                            fontColor: fontColorField,
                            hours: hoursField,
                            imageMode: imageModeField,
                        }}
                        itemCount={previewItemCount} />}
                    <Col>
                        {props.children}

                        <Form>
                            <Row>
                                <Form.Group as={Col} >
                                    <Form.Label>Ярлык</Form.Label>
                                    <Form.Control as={'input'} value={labelField || ''} onChange={handleLabelChange} />
                                </Form.Group>
                                <Form.Group as={Col} >
                                    <Form.Label>Длительность</Form.Label>
                                    <Form.Control as={'input'} value={hoursField || ''} onChange={handleHoursChange} />
                                </Form.Group>
                                <Form.Group as={Col} >
                                    <Form.Label>Цвет Ярлыка</Form.Label>
                                    <ColorPicker
                                        placement='bottom'
                                        onChange={(color: IColor) => handleFontColorChange(color)}
                                        defColor={{ rgb: { r: fontColor.red, g: fontColor.green, b: fontColor.blue }, hex: item.fontColor || '#fff' }}
                                    />
                                </Form.Group>
                                <Form.Group as={Col} >
                                    <Form.Label>Тип</Form.Label>
                                    <Form.Control as="select"  onChange={handleTypeChange}>
                                        <option value="game" selected={typeField === 'game'}>Игра</option>
                                        <option value="anime" selected={typeField === 'anime'}>Аниме</option>
                                        <option value="movie" selected={typeField === 'movie'}>Фильм</option>
                                        <option value="series" selected={typeField === 'series'}>Сериал</option>
                                        <option value="null" hidden selected={typeField === null}>Блять</option>
                                    </Form.Control>
                                </Form.Group>
                            </Row>
                            <Form.Group >
                                <Form.Label>Полное название</Form.Label>
                                <Form.Control as={'input'} value={titleField || ''} onChange={handleTitleChange} />
                            </Form.Group>
                            <Collapse
                                appear
                                in={typeField === 'game'}
                            >
                                <Row>
                                    <Form.Group as={Col} >
                                        <Form.Label>Макс игроков</Form.Label>
                                        <Form.Control as={'input'} value={maxPlayersField || ''} onChange={handleMaxPlayersChange} />
                                    </Form.Group>
                                    <Form.Group as={Col} >
                                        <Form.Label>С выбором сложности</Form.Label>
                                        <Form.Control as="select"  onChange={handleDiffChange} value={`${diffField}`}>
                                            <option value="true">Да</option>
                                            <option value="false" >Нет</option>
                                            <option value="null" hidden >Блять</option>
                                        </Form.Control>
                                    </Form.Group>
                                </Row>
                            </Collapse>
                            <Row>
                                <Col xs={8}>
                                    <Form.Label>Картинка</Form.Label>
                                    <Dropzone
                                        onDropAccepted={handleImageDrop}
                                        accept={['.jpg', '.jpeg', '.png', '.gif']}
                                        maxFiles={1}
                                        maxSize={2 * 5242880}
                                        multiple={false}
                                        onDrop={() => setIsDraging(false)}
                                        onDragEnter={() => setIsDraging(true)}
                                        onDragLeave={() => setIsDraging(false)}
                                    >
                                        {({ getRootProps, getInputProps }) =>
                                            <Form.Group  {...getRootProps()}>
                                                {//@ts-ignore
                                                    <Form.Control as={'input'} {...getInputProps()} />}
                                                <Card className={
                                                    `bg-dark-900 
                                                ${isDraging ? 'bg-dark-700' : ''} 
                                                ${imageFile ? 'px-2 ' : 'text-center'}`}
                                                    style={{ cursor: 'pointer', minHeight: 38 }}>
                                                    {imageFile ? <span className='  my-auto'>{imageFile.name}</span> : <i className="bi bi-upload fs-2"></i>}
                                                </Card>
                                            </Form.Group>
                                        }
                                    </Dropzone>
                                </Col>
                                <Form.Group as={Col} xs={4}>
                                    <Form.Label>Выравнивание</Form.Label>
                                    <Form.Control as="select"  onChange={handleImageModeChange}>
                                        <option value="height" selected={imageModeField === 'height'}>По высоте</option>
                                        <option value="width" selected={imageModeField === 'width'}>По ширине</option>
                                        <option value="null" hidden selected={imageModeField === null}>Блять</option>
                                    </Form.Control>
                                </Form.Group>
                            </Row>
                            <Row>
                                <Form.Group as={Col} >
                                    <Form.Label>Цвет Фона</Form.Label>
                                    <ColorPicker
                                        placement='top'
                                        onChange={(color: IColor) => handleColorChange(color)}
                                        defColor={{ rgb: { r: altColor.red, g: altColor.green, b: altColor.blue }, hex: item.altColor || '#fff' }}
                                    />
                                </Form.Group>
                            </Row>
                            <Form.Group >
                                <Form.Label>Комментарии</Form.Label>
                                <Form.Control as={TextareaAutosize} style={{ resize: 'none' }} value={commentsField || ''} onChange={handleCommentsChange} />
                            </Form.Group>

                        </Form>
                        {
                            !withPreview ||
                            <Slider defaultValue={20} onChange={setPreviewItemCount} />
                        }
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer className='bg-dark-750 text-light border-dark'>
                <Button variant='secondary' onClick={handleCancel}>Отмена</Button>
                <Button variant='primary' onClick={handleSubmit}>{props.isSaving ? <Spinner size='sm' animation="border" /> : 'Сохранить'}</Button>
            </Modal.Footer>
        </Modal>
    );
}