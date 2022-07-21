import React, { useState } from 'react';
import {
    Alert,
    Button, Card, Col, Collapse, Form, Modal, Row, Spinner
} from 'react-bootstrap';
import Dropzone from 'react-dropzone';
import TextareaAutosize from 'react-textarea-autosize';
import { User, Player, Image, Wheel, Game } from '../../database/db';
import usePlayer from '../../data/usePlayer';
import LoadingDots from '../LoadingDots';
import { useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { ApiError } from '../../types/common-api';
import ImageUpload from '../ImageUpload';
import { parseApiError } from '../../util/error';
//@ts-ignore
import DateTimePicker from 'react-datetime-picker/dist/entry.nostyle';

interface Props {
    show: boolean;
    isSaving: boolean;
    setIsSaving: (arg0: boolean) => void;
    onSaved: (wheel: Game) => void
    onCancel?: () => void
}
export default function NewGameModal(props: Props) {
    const { show, isSaving, setIsSaving, onSaved, onCancel } = props
    const [name, setName] = useState('RFBW')

    const [error, setError] = useState<ApiError | undefined>()
    const [image, setImage] = useState<Image | undefined>()
    const [fromDate, setFromDate] = useState<Date | undefined>()
    const [toDate, setToDate] = useState<Date | undefined>()
    const [isImageUploading, setIsImageUploading] = useState(false)
    function handleCancel() {
        if (onCancel)
            onCancel()
    }
    function handleSubmit() {
        setError(undefined)
        setIsSaving(true)
        axios.post<Game>(`/api/games/`, {
            name,
            imageId: image?.id,
            startsAt: fromDate?.toISOString(),
            endsAt: toDate?.toISOString(),
        }).then((data) => {
            setIsSaving(false)
            onSaved(data.data)
        }).catch((err: AxiosError<ApiError>) => {
            setIsSaving(false)
            setError(parseApiError(err))
        })

    }

    return (
        <Modal
            show={show}
            backdrop={'static'}
            contentClassName='border-dark shadow'
            centered={true}
        >
            <Modal.Header className='bg-dark-700 text-light border-dark'>
                <Modal.Title>Создать колесо</Modal.Title>
            </Modal.Header>
            <Modal.Body className='bg-dark-750 text-light'>
                <Row>
                    <Col>
                        <Form>
                            <Form.Group className='mb-3'>
                                <Form.Label>Название</Form.Label>
                                <Form.Control as={'input'} value={name || ''} onChange={(e) => setName(e.target.value)} />
                            </Form.Group>
                            <Form.Group >
                                <Form.Label>Картинка</Form.Label>
                                <ImageUpload
                                    imageType='game'
                                    onUploadStarted={() => setIsImageUploading(true)}
                                    onError={(err) => {
                                        setIsImageUploading(false)
                                        setError(err)
                                    }}
                                    onUploaded={(image) => {
                                        setIsImageUploading(false)
                                        setImage(image)
                                    }}

                                />
                            </Form.Group>
                            <Form.Group >
                                <Form.Label>Старт</Form.Label>
                                <DateTimePicker onChange={setFromDate} value={fromDate} />
                            </Form.Group>
                            <Form.Group >
                                <Form.Label>Конец</Form.Label>
                                <DateTimePicker onChange={setToDate} value={toDate} />
                            </Form.Group>
                            {
                                error && <Form.Group className='mb-3'><Alert className='mb-0' variant={'danger'}>
                                    {error.error}
                                </Alert></Form.Group>
                            }
                        </Form>
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer className='bg-dark-750 text-light border-dark'>
                <Button variant='secondary' onClick={handleCancel}>Отмена</Button>
                <Button variant='primary' onClick={handleSubmit} disabled={isSaving}>{props.isSaving ? <Spinner size='sm' animation="border" /> : 'Сохранить'}</Button>
            </Modal.Footer>
        </Modal>
    )
}