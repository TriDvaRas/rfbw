import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
    Badge, Card, Col, Form, InputGroup, Row, Table
} from 'react-bootstrap';
import Scrollbars from 'react-custom-scrollbars-2';
import { useDispatch, useSelector } from 'react-redux';
import ImageWithPreview from '../../components/ImageWithPreview';
import { IWheelItem } from '../../util/interfaces';
import { getTypeIcon } from '../../util/items';
import { newToast } from '../toasts/toastsSlice';
import WheelItemEditModal from '../wheelEditor/WheelItemEditModal';
import { fetchAItems, selectAItems, updateItem } from './aItemsSlice';

interface Props {
    cardHeight: number;
}
export default function AdminWheelItems(props: Props) {
    const items = useSelector(selectAItems)
    const dispatch = useDispatch()
    const [id, setId] = useState('')
    const [wheelId, setWheelId] = useState('')
    const [deleted, setDeleted] = useState<string>('all')
    const [type, setType] = useState<string>('all')
    const [selectedItem, setSelectedItem] = useState<IWheelItem | null>(null)
    const [showModal, setShowModal] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    useEffect(() => {
        if (items.status === 'idle') {
            dispatch(fetchAItems())
        }
        if (items.status === 'failed')
            dispatch(newToast({
                id: Math.random(),
                date: `${Date.now()}`,
                type: 'error',
                title: 'Ошибка',
                text: items.error?.message,
            }))
    }, [items.status, dispatch, items.error?.message])

    function handleWheelIdChange(evt: any) {
        let cursorPos = 0 + evt.target.selectionStart
        setWheelId(evt.target.value)
        evt.target.selectionStart = evt.target.selectionEnd = cursorPos
    }

    function handleIdChange(evt: any) {
        let cursorPos = 0 + evt.target.selectionStart
        setId(evt.target.value)
        evt.target.selectionStart = evt.target.selectionEnd = cursorPos
    }
    function handleDeletedChange(evt: any) {
        setDeleted(evt.target.value)
    }
    function handleTypeChange(evt: any) {
        setType(evt.target.value)
    }
    function handleSave(form: FormData, item: IWheelItem) {
        setIsSaving(true)
        axios.patch(`/api/admin/items`, form, {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }).then(
            () => {
                setIsSaving(false)
                setShowModal(false)
                dispatch(updateItem(item))

                dispatch(newToast({
                    id: Math.random(),
                    date: `${Date.now()}`,
                    type: 'success',
                    title: 'Сохранил',
                    autohide: 5000
                }))
                setTimeout(() => setSelectedItem(null), 200)
            },
            (err) => {
                setIsSaving(false)
                dispatch(newToast({
                    id: Math.random(),
                    date: `${Date.now()}`,
                    type: 'error',
                    title: 'Ошибка',
                    text: err.response.data,
                }))
            })
    }
    function handleCancel() {
        setShowModal(false)
        setTimeout(() => setSelectedItem(null), 200)
    }
    function handleSelect(item: IWheelItem) {
        setSelectedItem(item)
        setShowModal(true)
    }
    return (
        <Card
            bg='dark'
            text='light'
            className="m-3 w-100 h-100"
            style={{ maxHeight: props.cardHeight }}
        >
            <Card.Header>
                <div className='d-flex justify-content-between '>
                    <h3>Задания</h3>
                    <Row>
                        <InputGroup as={Col} className="mb-3">
                                <InputGroup.Text>Id</InputGroup.Text>
                            <Form.Control as={'input'} value={id} onChange={handleIdChange} />
                        </InputGroup>
                        <InputGroup as={Col} className="mb-3">
                                <InputGroup.Text>Wh</InputGroup.Text>
                            <Form.Control as={'input'} value={wheelId} onChange={handleWheelIdChange} />
                        </InputGroup>
                        <InputGroup as={Col} className="mb-3">
                                <InputGroup.Text>Удален</InputGroup.Text>
                            <Form.Control as="select" value={`${deleted}`} onChange={handleDeletedChange}>
                                <option value="true">Да</option>
                                <option value="false">Нет</option>
                                <option value="all">Похуй</option>
                            </Form.Control>
                        </InputGroup>
                        <InputGroup as={Col} className="mb-3">
                                <InputGroup.Text>Тип</InputGroup.Text>
                            <Form.Control as="select" value={`${type}`} onChange={handleTypeChange}>
                                <option value="game">Игра</option>
                                <option value="anime">Аниме</option>
                                <option value="movie">Фильм</option>
                                <option value="series">Сериал</option>
                                <option value="all">Похуй</option>
                            </Form.Control>
                        </InputGroup>
                    </Row>
                </div>
            </Card.Header>
            <Scrollbars autoHeight autoHeightMin={props.cardHeight - 68}>
                <Table variant="dark" hover className='mb-0 fs-1'>
                    <thead className='bg-dark-700'>
                        <tr>
                            <th className='text-center'>Id</th>
                            <th className='text-center'>Wh</th>
                            <th className='text-center'>Удален</th>
                            <th className='text-center'></th>
                            <th>Ярлык</th>
                            <th>Полное</th>
                            <th className='text-center'>Тип</th>
                            <th className='text-center'>HRS</th>
                            <th className='text-center'>BG col</th>
                            <th className='text-center'>Text col</th>
                            <th>Комменты</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.items
                            ?.filter(x => !id || `${x.id}` === id)
                            .filter(x => !wheelId || `${x.wheelId}` === wheelId)
                            .filter(x => deleted === 'all' || `${deleted}` === (x.deleted ? `true` : `false`))
                            .filter(x => type === 'all' || type === x.type)
                            .map(item =>
                                <tr onClick={() => handleSelect(item)} className={selectedItem?.id === item.id ? 'bg-dark-750' : ''}>
                                    <td className='text-center'>{item.id}</td>
                                    <td className='text-center'>{item.wheelId}</td>
                                    <td className='text-center'>{item.deleted ? <i className="bi bi-circle-fill"></i> : ''}</td>
                                    <td className='p-0'>
                                        <ImageWithPreview imageKey={`${item.id}-img`} size={40} src={item.image ? `${item.image.startsWith(`blob`) ? '' : '/'}${item.image}` : `/errorAvatar.jpg`} />
                                    </td>
                                    <td>{item.label}</td>
                                    <td>{item.title}</td>
                                    <td className='text-center'>{getTypeIcon(item.type)}</td>
                                    <td className='text-center'>{item.hours}</td>
                                    <td className='text-center'><Badge style={{ backgroundColor: item.altColor }}>{item.altColor || '?'}</Badge></td>
                                    <td className='text-center'><Badge style={{ backgroundColor: item.fontColor }}>{item.fontColor || '?'}</Badge></td>
                                    <td>{item.comments}</td>
                                </tr>
                            )}
                    </tbody>
                </Table>
            </Scrollbars>
            {
                !selectedItem ||
                <WheelItemEditModal
                    show={showModal}
                    item={selectedItem}
                    onItemChange={setSelectedItem}
                    onSave={handleSave}
                    onHide={handleCancel}
                    isSaving={isSaving}
                    withPreview={true}
                />
            }
        </Card>
    )
}


