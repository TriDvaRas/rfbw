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
    const [picFile, setPicFile] = useState<File | null>()
    const [image, setImage] = useState<Image | undefined>()
    const [isDraging, setIsDraging] = useState(false)
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
            setError(typeof err.response?.data == 'object' ? err.response.data : { error: err.message || 'Unknown Error', status: +(err.status || 500) })
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
                                    {/* <Dropzone
                                        onDropAccepted={handleDrop}
                                        accept={{ 'image/png': ['.png'], 'image/jpg': ['.jpg', '.jpeg'] }}
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
                                            ${picFile ? 'px-2 ' : 'text-center'}`}
                                                    style={{ cursor: 'pointer', minHeight: 38 }}>
                                                    {picFile ? <span className='  my-auto'>{picFile.name}</span> : <i className="bi bi-upload fs-2"></i>}
                                                </Card>
                                            </Form.Group>
                                        }
                                    </Dropzone> */}
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
                <Button variant='primary' onClick={handleSubmit}>{props.isSaving ? <Spinner size='sm' animation="border" /> : 'Сохранить'}</Button>
            </Modal.Footer>}
        </Modal>
    )
}