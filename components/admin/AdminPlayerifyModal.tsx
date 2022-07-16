import React, { useState } from 'react';
import {
    Alert,
    Button, Card, Col, Collapse, Form, Modal, Row, Spinner
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
import { parseApiError } from '../../util/error';

interface Props {
    sourceUser?: User;
    show: boolean;
    isSaving: boolean;
    setIsSaving: (arg0: boolean) => void;
    onSaved: (player: Player) => void
    onCancel?: () => void
}
export default function AdminPlayerifyModal(props: Props) {
    const { sourceUser } = props
    const [displayName, setDisplayName] = useState(sourceUser?.name || '')
    const [about, setAbout] = useState('')
    const [image, setImage] = useState<Image | undefined>()
    const [error, setError] = useState<ApiError | undefined>()
    const [isImageUploading, setIsImageUploading] = useState(false)

    function handleCancel() {
        if (props.onCancel)
            props.onCancel()
    }
    function handleSubmit() {
        if (!sourceUser)
            return
        setError(undefined)
        props.setIsSaving(true)
        const form = new FormData()
        form.append("id", `${sourceUser.id}`)
        form.append("name", displayName)
        form.append("about", about)
        axios.put<Player>(`/api/admin/players`, {
            id: sourceUser.id,
            name: displayName,
            about,
            imageId: image?.id
        }).then((data) => {
            props.setIsSaving(false)
            props.onSaved(data.data)
        }).catch((err: AxiosError<ApiError>) => {
            props.setIsSaving(false)
            setError(parseApiError(err))
        })

    }
    useEffect(() => {
        if (sourceUser)
            setDisplayName(sourceUser.name)
    }, [sourceUser])

    return (
        <Modal
            {...{ show: props.show }}
            backdrop={'static'}
            contentClassName='border-dark shadow'
            centered={true}
        >
            <Modal.Header className='bg-dark-700 text-light border-dark'>
                <Modal.Title>Playerify</Modal.Title>
            </Modal.Header>
            <Modal.Body className='bg-dark-750 text-light'>
                {sourceUser ?
                    <Row>
                        <Col>
                            <Form>
                                <Form.Group  >
                                    <Form.Label>Display Name</Form.Label>
                                    <Form.Control as={'input'} value={displayName || ''} onChange={(e) => setDisplayName(e.target.value)} />
                                </Form.Group>
                                <Form.Group >
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control as={'input'} value={about || ''} onChange={(e) => setAbout(e.target.value)} />
                                </Form.Group>
                                <Form.Group >
                                    <Form.Label>Картинка</Form.Label>
                                    <ImageUpload
                                        imageType='player'
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
                                {
                                    error && <Form.Group className='mt-3'><Alert className='mb-0' variant={'danger'}>
                                        {error.error}
                                    </Alert></Form.Group>
                                }
                            </Form>
                        </Col>
                    </Row>
                    : <LoadingDots />}
            </Modal.Body>
            {!!sourceUser && <Modal.Footer className='bg-dark-750 text-light border-dark'>
                <Button variant='secondary' onClick={handleCancel}>Отмена</Button>
                <Button variant='primary' onClick={handleSubmit} disabled={isImageUploading || props.isSaving}>{props.isSaving ? <Spinner size='sm' animation="border" /> : 'Сохранить'}</Button>
            </Modal.Footer>}
        </Modal>
    )
}