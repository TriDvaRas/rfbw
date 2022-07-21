import React, { useRef, useState } from 'react';
import {
    Alert,
    Button, Card, Col, Collapse, Form, Row, Spinner
} from 'react-bootstrap';
import Dropzone from 'react-dropzone';
import TextareaAutosize from 'react-textarea-autosize';
import { User, Player, Image } from '../../database/db';
import usePlayer from '../../data/usePlayer';
import LoadingDots from '../LoadingDots';
import { useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { ApiError } from '../../types/common-api';
import ImageUpload from '../ImageUpload';
import { useSession } from 'next-auth/react';
import { parseApiError } from '../../util/error';

interface Props {
    player: Player
    onSaved: (player: Player) => void
    onCancel?: () => void
    onChange?: (upd: Partial<Player>) => void
}
export default function PlayerAboutCardEdit(props: Props) {
    const { player, onChange } = props
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
        if (!player)
            return
        const form = formRef.current as any
        console.log(form);
        if (form.checkValidity() === false) {
            setValidated(true);
        }
        else {
            setError(undefined)
            setIsSaving(true)
            axios.patch<Player>(`/api/players/${player.id}`, player).then((data) => {
                setIsSaving(false)
                props.onSaved(data.data)
            }).catch((err: AxiosError<ApiError>) => {
                setIsSaving(false)
                setError(parseApiError(err))
            })
        }
    }
    function handleUpdate(upd: Partial<Player>) {
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
                {player ?
                    <Row>
                        <Col>
                            <Form onSubmit={handleSubmit} ref={formRef as any} validated={validated}>
                                <Form.Group className='mb-3'>
                                    <Form.Label>Моё имя</Form.Label>
                                    <Form.Control required as={'input'} defaultValue={player.name} onChange={(e) => handleUpdate({ name: e.target.value })} />
                                    <Form.Control.Feedback type="invalid">
                                        Ага блять, нет. Имя пиши
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className='mb-3'>
                                    <Form.Label>Обо мне</Form.Label>
                                    <Form.Control as={'input'} value={player.about} onChange={(e) => handleUpdate({ about: e.target.value })} />
                                </Form.Group>
                                <Form.Group className='mb-3'>
                                    <Form.Label>Моя фотокарточка</Form.Label>
                                    <ImageUpload
                                        imageType='player'
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