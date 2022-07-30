import React, { useRef, useState } from 'react';
import {
    Alert,
    Button, Card, Col, Collapse, Form, Row, Spinner
} from 'react-bootstrap';
import Dropzone from 'react-dropzone';
import TextareaAutosize from 'react-textarea-autosize';
import { User, Player, Image, Effect, EffectType } from '../../database/db';
import usePlayer from '../../data/usePlayer';
import LoadingDots from '../LoadingDots';
import { useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { ApiError } from '../../types/common-api';
import ImageUpload from '../ImageUpload';
import { useSession } from 'next-auth/react';
import { parseApiError } from '../../util/error';

interface Props {
    effect: Effect
    onSaved: (player: Effect) => void
    onCancel?: () => void
    onChange?: (upd: Partial<Effect>) => void
}
export default function AdminEffectCardEdit(props: Props) {
    const { effect, onChange } = props
    const [error, setError] = useState<ApiError | undefined>()
    const [isImageUploading, setIsImageUploading] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    const [validated, setValidated] = useState(false)
    const formRef = useRef<HTMLFormElement>()
    function handleCancel() {
        if (props.onCancel)
            props.onCancel()
    }
    function handleSave() {
        if (!effect)
            return
        const form = formRef.current as any
        if (form.checkValidity() === false) {
            setValidated(true);
        }
        else {
            setError(undefined)
            setIsSaving(true)
            axios.patch<Effect>(`/api/admin/effects/${effect.id}`, effect).then((data) => {
                setIsSaving(false)
                props.onSaved(data.data)
            }).catch((err: AxiosError<ApiError>) => {
                setIsSaving(false)
                setError(parseApiError(err))
            })
        }
    }
    function handleUpdate(upd: Partial<Effect>) {
        if (onChange)
            onChange(upd)
    }
    function handleSubmit(event: any) {
        event.preventDefault();
        event.stopPropagation();
    };


    return (
        <Card
            bg='dark'
            text='light'
            className="my-3 "
        >
            <Card.Header >
                <h3>Кто Я?</h3>
            </Card.Header>
            <Card.Body >
                {effect ?
                    <Row>
                        <Col>
                            <Form onSubmit={handleSubmit} ref={formRef as any} validated={validated}>
                                <Form.Group className='mb-3'>
                                    <Form.Label>Моё имя</Form.Label>
                                    <Form.Control required as={'input'} value={effect.title || ''} onChange={(e) => handleUpdate({ title: e.target.value })} />
                                    <Form.Control.Feedback type="invalid">
                                        Ага блять, нет. Имя пиши
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className='mb-3'>
                                    <Form.Label>Обо мне</Form.Label>
                                    <Form.Control as={TextareaAutosize} value={effect.description || ''} onChange={(e) => handleUpdate({ description: e.target.value })} />
                                </Form.Group>
                                <Row>
                                    <Col>
                                        <Form.Group className='mb-3'>
                                            <Form.Label>lid</Form.Label>
                                            <Form.Control as={'input'} value={effect.lid || ''} onChange={(e) => handleUpdate({ lid: +e.target.value })} />
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group className='mb-3'>
                                            <Form.Label>group</Form.Label>
                                            <Form.Control as={'input'} value={effect.groupId || ''} onChange={(e) => handleUpdate({ groupId: +e.target.value })} />
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group className='mb-3'>
                                            <Form.Label>type</Form.Label>
                                            <Form.Select value={effect.type} onChange={e => handleUpdate({ type: e.target.value as EffectType })}>
                                                <option value='positive'>positive</option>
                                                <option value='neutral'>neutral</option>
                                                <option value='negative'>negative</option>
                                                <option value='secret'>secret</option>
                                                <option value='card'>card</option>
                                                <option value='system'>system</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Form.Check className='ms-1 mt-1' type={'switch'} label={<div >Default</div>} disabled={isImageUploading || isSaving} checked={effect.isDefault} onChange={e => handleUpdate({ isDefault: e.target.checked })} />

                                </Row>
                                <Form.Group className='mb-3'>
                                    <Form.Label>Его фотокарточка</Form.Label>
                                    <ImageUpload
                                        imageType='effect'
                                        onUploadStarted={() => setIsImageUploading(true)}
                                        onError={(err) => {
                                            setIsImageUploading(false)
                                            setError(err)
                                        }}
                                        onUploaded={(image) => {
                                            setIsImageUploading(false)
                                            handleUpdate({ imageId: image.id })
                                        }}

                                    />
                                </Form.Group>
                                {
                                    error && <Form.Group className='mb-3'><Alert className='mb-0' variant={'danger'}>
                                        {error.error}
                                    </Alert></Form.Group>
                                }

                                <Form.Group className='d-flex flex-row-reverse'>
                                    <Button variant='primary' onClick={handleSave} disabled={isImageUploading || isSaving}>{isSaving ? <Spinner size='sm' animation="border" /> : 'Сохранить'}</Button>
                                    <Button className='me-3' variant='secondary' onClick={handleCancel}>Отмена</Button>
                                </Form.Group>
                            </Form>
                        </Col>
                    </Row>
                    : <LoadingDots />}
            </Card.Body>

        </Card>
    )
}