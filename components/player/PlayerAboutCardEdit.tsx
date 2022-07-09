import React, { useState } from 'react';
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

interface Props {
    player: Player
    onSaved: (player: Player) => void
    onCancel?: () => void
    onChange?: (name: string, about: string, imageId?: string) => void
}
export default function PlayerAboutCardEdit(props: Props) {
    const { player } = props
    const [displayName, setDisplayName] = useState(player?.name || '')
    const [about, setAbout] = useState(player?.about || '')
    const [imageId, setImageId] = useState<string | undefined>()
    const [error, setError] = useState<ApiError | undefined>()
    const [isImageUploading, setIsImageUploading] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    function handleCancel() {
        if (props.onCancel)
            props.onCancel()
    }
    function handleSubmit() {
        if (!player)
            return
        setError(undefined)
        setIsSaving(true)
        const form = new FormData()
        form.append("name", displayName)
        form.append("about", about)
        axios.patch<Player>(`/api/players/me`, {
            name: displayName,
            about,
            imageId
        }).then((data) => {
            setIsSaving(false)
            props.onSaved(data.data)
        }).catch((err: AxiosError<ApiError>) => {
            setIsSaving(false)
            setError(typeof err.response?.data == 'object' ? err.response.data : { error: err.message || 'Unknown Error', status: +(err.status || 500) })
        })
    }
    useEffect(() => {
        if (player) {
            setDisplayName(player.name)
            setAbout(player.about)
            setImageId(player.imageId)
        }
    }, [player])
    useEffect(() => {
        if (props.onChange)
            props.onChange(about, displayName, imageId)
    }, [about, displayName, imageId, props])
    return (
        <Card
            bg='dark'
            text='light'
            className="my-3 "
        >
            <Card.Header >
                <h3>Пан5елька Об игроке</h3>
            </Card.Header>
            <Card.Body >
                {player ?
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
                                            setImageId(image.id)
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
            </Card.Body>
            {!!player && <Card.Footer className='d-flex flex-row-reverse'>
                <Button variant='secondary' onClick={handleCancel}>Отмена</Button>
                <Button className='me-3' variant='primary' onClick={handleSubmit} disabled={isImageUploading || isSaving}>{isSaving ? <Spinner size='sm' animation="border" /> : 'Сохранить'}</Button>
            </Card.Footer>}
        </Card>
    )
}