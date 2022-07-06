import React, { useEffect, useState } from 'react';
import {
    Button,
    Card,
    Col,
    Form,
    Row,
    Spinner
} from 'react-bootstrap';
import Scrollbars from 'react-custom-scrollbars-2';
import { useDispatch } from 'react-redux';
import TextareaAutosize from 'react-textarea-autosize';
import { getEffectType, getTypeEffect } from '../../util/effects';
import { IEffect } from '../../util/interfaces';
import { updateEffect } from './aEffectsSlice';

interface Props {
    cardHeight?: number;
    effect: IEffect;
    onSave: Function;
    isSaving?: boolean;
    maxHeight: number;
}
export default function AdminEffectCardEdit(props: Props) {
    const { onSave, isSaving, cardHeight, effect, maxHeight } = props
    const [oldEffect, setOldEffect] = useState(effect)
    const dispatch = useDispatch()
    const [effectTitleField, setEffectTitleField] = useState(effect.title)
    const [effectDescriptionField, setEffectDescriptionField] = useState(effect.description)
    const [effectGroupField, setEffectGroupField] = useState(effect.groupId)
    const [typeField, setTypeField] = useState(getEffectType(effect))
    // const [picFile, setPicFile] = useState<File | null>()
    // const [isDraging, setIsDraging] = useState(false)

    useEffect(() => {
        setEffectTitleField(effect.title)
        setEffectDescriptionField(effect.description)
        setEffectGroupField(effect.groupId)
        setTypeField(getEffectType(effect))
        if (oldEffect?.id !== effect.id) {
            // setPicFile(null)
            setTypeField(getEffectType(effect))
            setOldEffect(effect)
        }
    }, [oldEffect?.id, effect])
    function handleTitleChange(evt: any) {
        let cursorPos = 0 + evt.target.selectionStart
        setEffectTitleField(evt.target.value.slice(0, 100))
        evt.target.selectionStart = evt.target.selectionEnd = cursorPos
        dispatch(updateEffect({
            id: effect.id,
            title: evt.target.value.slice(0, 100)
        }))
    }
    function handleDescriptionChange(evt: any) {
        let cursorPos = 0 + evt.target.selectionStart
        setEffectDescriptionField(evt.target.value.slice(0, 512))
        evt.target.selectionStart = evt.target.selectionEnd = cursorPos
        dispatch(updateEffect({
            id: effect.id,
            description: evt.target.value.slice(0, 512)
        }))
    }
    function handleGroupChange(evt: any) {
        if (evt.target.value.length === 0 || /^[0-9]+$/.test(evt.target.value)) {
            let cursorPos = 0 + evt.target.selectionStart
            setEffectGroupField(evt.target.value)
            evt.target.selectionStart = evt.target.selectionEnd = cursorPos
            dispatch(updateEffect({
                id: effect.id,
                groupId: +evt.target.value
            }))
        }

    }
    function handleTypeChange(event: any) {
        setTypeField(event.target.value)
        dispatch(updateEffect({
            id: effect.id,
            ...getTypeEffect(event.target.value)
        }))
    }

    function handleCancel() {
        setEffectTitleField(oldEffect.title)
        setEffectDescriptionField(oldEffect.description)
        // setPicFile(null)
        dispatch(updateEffect(oldEffect))
    }


    function handleSave() {
        // const form = new FormData()
        // if (picFile)
        //     form.append("picture", picFile, picFile.name);
        // form.append("userId", effect.userId);
        // form.append("name", effectTitleField);
        // form.append("about", effectDescriptionField);
        onSave(effect)
        // setPicFile(null)
    }

    // function handleDrop(files: any) {
    //     setPicFile(files[0])
    //     Object.assign(files[0], {
    //         preview: URL.createObjectURL(files[0])
    //     })
    //     dispatch(updateEffect({
    //         id: effect.id,
    //         picture: files[0].preview
    //     }))
    // }
    return (
        <Card
            bg='dark'
            text='light'
            className=" mx-3"
            style={{ height: cardHeight }}
        >
            <Scrollbars autoHeight autoHeightMax={maxHeight}>
                <Card.Body>
                    <Form onSubmit={(evt) => evt.preventDefault()}>
                        <Row>
                            <Form.Group as={Col}>
                                <Form.Label>Название</Form.Label>
                                <Form.Control as={'input'} value={effectTitleField || ''} onChange={handleTitleChange} />
                            </Form.Group>

                        </Row>

                        <Form.Group  >
                            <Form.Label>Описание</Form.Label>
                            <Form.Control as={TextareaAutosize} style={{ resize: 'none' }} value={effectDescriptionField || ''} onChange={handleDescriptionChange} />
                        </Form.Group>
                        <Row>
                            <Form.Group as={Col}>
                                <Form.Label>Группа</Form.Label>
                                <Form.Control as={'input'} value={effectGroupField || ''} onChange={handleGroupChange} />
                            </Form.Group>
                            <Form.Group as={Col}>
                                <Form.Label>Тип</Form.Label>
                                <Form.Control as="select" value={typeField} onChange={handleTypeChange}>
                                    <option value="positive">Позитивный</option>
                                    <option value="neutral">Нейтральный</option>
                                    <option value="negative">Негативный</option>
                                    <option value="card">Карточка</option>
                                    <option value="secret">Секрет</option>
                                    <option value="null" hidden>Блять</option>
                                </Form.Control>
                            </Form.Group>

                        </Row>

                        <Form.Group className='d-flex mb-0 flex-row-reverse' >
                            <Button className='' variant='primary' disabled={isSaving} onClick={handleSave}>{isSaving ? <Spinner size='sm' animation="border" /> : 'Сохранить'}</Button>
                            <Button className='mr-3' variant='secondary' disabled={isSaving} onClick={handleCancel}>Все, давай по новой</Button>
                        </Form.Group>
                    </Form>
                </Card.Body>
            </Scrollbars>
        </Card>
    )
}