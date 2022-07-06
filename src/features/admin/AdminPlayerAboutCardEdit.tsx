import React, { useEffect, useState } from 'react';
import {
    Button,
    Card,
    Col,
    Row,
    Form,
    Spinner
} from 'react-bootstrap';
import Scrollbars from 'react-custom-scrollbars-2';
import Dropzone from 'react-dropzone';
import { useDispatch } from 'react-redux';
import TextareaAutosize from 'react-textarea-autosize';
import { IPlayer } from '../../util/interfaces';
import { updatePlayer } from './aPlayersSlice';

interface Props {
    cardHeight?: number;
    player: IPlayer;
    onSave: Function;
    isSaving?: boolean;
    maxHeight: number;
}
export default function AdminPlayerAboutCardEdit(props: Props) {
    const { onSave, isSaving, cardHeight, player, maxHeight } = props
    const [oldPlayer, setOldPlayer] = useState(player)
    const dispatch = useDispatch()
    const [playerNameField, setPlayerNameField] = useState(player?.name)
    const [playerAboutField, setPlayerAboutField] = useState(player?.about)
    const [picFile, setPicFile] = useState<File | null>()
    const [isDraging, setIsDraging] = useState(false)

    useEffect(() => {
        setPlayerNameField(player.name)
        setPlayerAboutField(player.about)
        if (oldPlayer?.id !== player.id) {
            setPicFile(null)
            setOldPlayer(player)
        }
    }, [oldPlayer?.id, player])
    function handleNameChange(evt: any) {
        let cursorPos = 0 + evt.target.selectionStart
        setPlayerNameField(evt.target.value.slice(0, 64))
        evt.target.selectionStart = evt.target.selectionEnd = cursorPos
        dispatch(updatePlayer({
            id: player.id,
            name: evt.target.value.slice(0, 64)
        }))
    }
    function handleAboutChange(evt: any) {
        let cursorPos = 0 + evt.target.selectionStart
        setPlayerAboutField(evt.target.value.slice(0, 512))
        evt.target.selectionStart = evt.target.selectionEnd = cursorPos
        dispatch(updatePlayer({
            id: player.id,
            about: evt.target.value.slice(0, 512)
        }))
    }

    function handleCancel() {
        setPlayerNameField(oldPlayer.name)
        setPlayerAboutField(oldPlayer.about)
        setPicFile(null)
        dispatch(updatePlayer(oldPlayer))
    }

    function handleSave() {
        const form = new FormData()
        if (picFile)
            form.append("picture", picFile, picFile.name);
        form.append("userId", player.userId);
        form.append("name", playerNameField);
        form.append("about", playerAboutField);
        onSave(form)
        // setPicFile(null)
    }
    function handleDrop(files: any) {
        setPicFile(files[0])
        Object.assign(files[0], {
            preview: URL.createObjectURL(files[0])
        })
        dispatch(updatePlayer({
            id: player.id,
            picture: files[0].preview
        }))
    }
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
                                {/* <Form.Label>Твое имя</Form.Label> */}
                                <Form.Control as={'input'} value={playerNameField || ''} onChange={handleNameChange} />
                            </Form.Group>

                            <Dropzone
                                onDropAccepted={handleDrop}
                                accept={['.jpg', '.jpeg', '.png']}
                                maxFiles={1}
                                maxSize={2 * 5242880}
                                multiple={false}
                                onDrop={() => setIsDraging(false)}
                                onDragEnter={() => setIsDraging(true)}
                                onDragLeave={() => setIsDraging(false)}
                            >
                                {({ getRootProps, getInputProps }) =>
                                    <Form.Group as={Col} {...getRootProps()}>
                                        {/* <Form.Label>Картинка</Form.Label> */}
                                        {//@ts-ignore
                                            <Form.Control as={'input'} {...getInputProps()} />}
                                        <Card className={
                                            `bg-dark-900 
                                    ${isDraging ? 'bg-dark-700' : ''} 
                                    ${picFile ? 'p-2 ' : 'text-center'}`}
                                            style={{ cursor: 'pointer', minHeight: 38 }}>
                                            {picFile ? <span className='my-auto'>{picFile.name}</span> : <i className="bi bi-upload fs-2"></i>}
                                        </Card>
                                    </Form.Group>
                                }
                            </Dropzone>
                        </Row>

                        <Form.Group  >
                            {/* <Form.Label>О себе</Form.Label> */}
                            <Form.Control as={TextareaAutosize} style={{ resize: 'none' }} value={playerAboutField || ''} onChange={handleAboutChange} />
                        </Form.Group>
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