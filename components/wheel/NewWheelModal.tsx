import React, { useState } from 'react';
import {
    Alert,
    Button, Card, Col, Collapse, Form, Modal, Row, Spinner
} from 'react-bootstrap';
import Dropzone from 'react-dropzone';
import TextareaAutosize from 'react-textarea-autosize';
import { User, Player, Image, Wheel } from '../../database/db';
import usePlayer from '../../data/usePlayer';
import LoadingDots from '../LoadingDots';
import { useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { ApiError } from '../../types/common-api';
import ImageUpload from '../ImageUpload';
import { parseApiError } from '../../util/error';

interface Props {
    show: boolean;
    isSaving: boolean;
    setIsSaving: (arg0: boolean) => void;
    onSaved: (wheel: Wheel) => void
    onCancel?: () => void
}
export default function NewWheelModal(props: Props) {
    const { show, isSaving, setIsSaving, onSaved, onCancel } = props
    const [title, setTitle] = useState('Колесо')

    const [error, setError] = useState<ApiError | undefined>()

    function handleCancel() {
        if (onCancel)
            onCancel()
    }
    function handleSubmit() {
        setError(undefined)
        setIsSaving(true)
        axios.post<Wheel>(`/api/wheels/`, {
            title,
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
                                <Form.Control as={'input'} value={title || ''} onChange={(e) => setTitle(e.target.value)} />
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