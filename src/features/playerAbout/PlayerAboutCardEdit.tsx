import React, { useState } from 'react';
import {
    Button,
    Card, Form,
    Spinner
} from 'react-bootstrap';
import Dropzone from 'react-dropzone';
import { useDispatch } from 'react-redux';
import TextareaAutosize from 'react-textarea-autosize';
import { IPlayer } from '../../util/interfaces';
import { updateMyPlayer } from '../me/myPlayerSlice';

interface Props {
    cardHeight?: number;
    player: IPlayer;
    onSave: Function;
    isSaving?: boolean;
}
export default function PlayerAboutCardEdit(props: Props) {
    const { onSave, isSaving, cardHeight, player } = props

    const dispatch = useDispatch()
    const [playerNameField, setPlayerNameField] = useState(player.name)
    const [playerAboutField, setPlayerAboutField] = useState(player.about)
    const [picFile, setPicFile] = useState<File | null>()
    const [isDraging, setIsDraging] = useState(false)

    function handleNameChange(evt: any) {
        let cursorPos = 0 + evt.target.selectionStart
        setPlayerNameField(evt.target.value.slice(0, 64))
        evt.target.selectionStart = evt.target.selectionEnd = cursorPos
        dispatch(updateMyPlayer({ name: evt.target.value.slice(0, 64) }))
    }
    function handleAboutChange(evt: any) {
        let cursorPos = 0 + evt.target.selectionStart
        setPlayerAboutField(evt.target.value.slice(0, 512))
        evt.target.selectionStart = evt.target.selectionEnd = cursorPos
        dispatch(updateMyPlayer({ about: evt.target.value.slice(0, 512) }))
    }
    function handleCancel() {
        dispatch(updateMyPlayer({
            about: player.about,
            name: player.name,
            picture: player.picture
        }))
        setPlayerNameField(player.name)
        setPlayerAboutField(player.about)
        setPicFile(null)
    }
    function handleSave() {
        const form = new FormData()
        if (picFile)
            form.append("picture", picFile, picFile.name);
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
        dispatch(updateMyPlayer({ picture: files[0].preview }))
    }
    return (
        <Card
            bg='dark'
            text='light'
            className="my-3 "
            style={{ height: cardHeight }}
        >
            <Card.Header><h3>Пан5елька Об игроке</h3></Card.Header>
            <Card.Body>
                <Form onSubmit={(evt) => evt.preventDefault()}>
                    <Form.Group  >
                        <Form.Label>Твое имя</Form.Label>
                        <Form.Control id={`my-name-input`} as={'input'} value={playerNameField || ''} onChange={handleNameChange} />
                    </Form.Group>
                    <Form.Group  >
                        <Form.Label>О себе</Form.Label>
                        <Form.Control id={`my-about-input`} as={TextareaAutosize} style={{ resize: 'none' }} value={playerAboutField || ''} onChange={handleAboutChange} />
                    </Form.Group>
                    <Form.Label>Картинка</Form.Label>
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
                            <Form.Group  {...getRootProps()}>
                                {//@ts-ignore
                                    <Form.Control id={`my-avatar-input`} as={'input'} {...getInputProps()} />}
                                <Card className={
                                    `bg-dark-900 
                                        ${isDraging ? 'bg-dark-700' : ''} 
                                        ${picFile ? 'p-2 ' : 'text-center'}`}
                                    style={{ cursor: 'pointer', minHeight: 48 }}>
                                    {picFile ? <span className='my-auto'>{picFile.name}</span> : <i className="bi bi-upload fs-3"></i>}
                                </Card>
                            </Form.Group>
                        }
                    </Dropzone>

                </Form>
            </Card.Body>
            <Card.Footer className='d-flex flex-row-reverse'>
                <Button id={`my-save-button`} className='' variant='primary' onClick={handleSave}>{isSaving ? <Spinner size='sm' animation="border" /> : 'Сохранить'}</Button>
                <Button className='mr-3' variant='secondary' onClick={handleCancel}>Все, давай по новой</Button>
            </Card.Footer>
        </Card>
    )
}