import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
    Button, Card, OverlayTrigger, Popover, Table
} from 'react-bootstrap';
import Scrollbars from 'react-custom-scrollbars-2';
import { useDispatch } from 'react-redux';
import LoadingDots from '../../components/LoadingDots';
import { IWheel, IWheelItem } from '../../util/interfaces';
import { getTypeIcon } from '../../util/items';
import { addItem, deleteItem, updateItem } from '../me/myWheelSlice';
import { newToast } from '../toasts/toastsSlice';
import WheelItemEditModal from './WheelItemEditModal';

interface Props {
    wheel?: IWheel;
    height: number;
    editItem?: IWheelItem | null;
    setEditItem?: Function | null;
}
export default function WheelItems(props: Props) {
    const { wheel, height, editItem, setEditItem } = props
    const [showEditModal, setShowEditModal] = useState<boolean>(false)
    const [showDeletePopover, setShowDeletePopover] = useState<number | null>()
    const [currentItem, setCurrentItem] = useState<IWheelItem | null>()
    const [isSaving, setIsSaving] = useState(false)
    const dispatch = useDispatch()

    useEffect(() => {
        if (editItem)
            handleEdit(editItem as IWheelItem)
        if (setEditItem)
            setEditItem(null)
    }, [editItem, setEditItem])

    function handleAdd() {
        const tempId = -Math.random()
        dispatch(addItem(tempId))
        axios.post(`/api/wheels/my/items/add`)
            .then(newItem => {
                dispatch(updateItem({ tempId, item: newItem.data }))
                dispatch(newToast({
                    id: Math.random(),
                    date: `${Date.now()}`,
                    type: 'success',
                    title: 'Добавил',
                    autohide: 5000
                }))
            },
                (err) => {
                    dispatch(deleteItem(tempId))
                    dispatch(newToast({
                        id: Math.random(),
                        date: `${Date.now()}`,
                        type: 'error',
                        title: 'Ошибка',
                        text: err.response.data,
                    }))
                });

    }
    function handleDelete(evt: any, item?: IWheelItem) {
        evt.stopPropagation()
        if (item) {
            if (item.loading)
                return
            if (item.id && item.id > 0) {
                axios.post(`/api/wheels/my/items/delete`, { itemId: item.id })
                    .then(newItem => {
                        dispatch(deleteItem(item.id))
                        setShowDeletePopover(-1)
                        dispatch(newToast({
                            id: Math.random(),
                            date: `${Date.now()}`,
                            type: 'success',
                            title: 'Удалил',
                            autohide: 5000
                        }))
                    },
                        (err) => {
                            setShowDeletePopover(-1)
                            dispatch(newToast({
                                id: Math.random(),
                                date: `${Date.now()}`,
                                type: 'error',
                                title: 'Ошибка',
                                text: err.response.data,
                            }))
                        });
            }
        }
    }
    function handleSave(form: FormData, item: IWheelItem) {
        setIsSaving(true)

        axios.post(`/api/wheels/my/items/update`, form, {
            headers: {
                'content-type': 'multipart/form-data'
            }
        })
            .then(
                (response) => {
                    setIsSaving(false)
                    setShowEditModal(false)
                    dispatch(updateItem({ item }))
                    dispatch(newToast({
                        id: Math.random(),
                        date: `${Date.now()}`,
                        type: 'success',
                        title: 'Сохранил',
                        autohide: 5000
                    }))
                    setTimeout(() => setCurrentItem(null), 200)
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
    function handleEdit(item: IWheelItem) {
        if (item.loading)
            return
        if (item.id && item.id > 0) {
            setCurrentItem(item)
            setShowEditModal(true)
        }
    }

    return <Card
        bg='dark'
        text='light'
        className="m-3  wheel-card"
        border={"dark"}
        style={{ height: height }}
    >
        <Card.Header>
            <h3>Задания</h3>
        </Card.Header>
        <Scrollbars height={height - 51}>
            <Table variant="dark" className='mb-0'>
                <thead className='bg-dark-700'>
                    <tr>
                        <th className='text-center td-min-width'>#</th>
                        <th>Ярлык</th>
                        <th>Полное название</th>
                        <th className='text-center td-min-width'>Тип</th>
                        <th className='text-center td-min-width'>Часы</th>
                        <th className='text-center td-min-width'>Кооп</th>
                        <th className='text-center td-min-width'>Слжн</th>
                        <th className='text-center td-min-width'></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        wheel?.items?.map((item, index, items) => item.loading ?
                            <tr><td colSpan={5}><LoadingDots count={3} /></td></tr>
                            :
                            <tr>
                                <td className='text-center td-min-width'>{index + 1}</td>
                                <td>{item.label}</td>
                                <td>{item.title}</td>
                                <td className='text-center td-min-width'>{getTypeIcon(item.type)}</td>
                                <td className='text-center td-min-width'>{`${item.hours || 0}`.replace(/(\..).+/, `$1`).replace(/\.0/, ``)}</td>
                                <td className='text-center td-min-width'>{item.type === 'game' ? item.coop : `-`}</td>
                                <td className='text-center td-min-width'>{item.type === 'game' ? ([1,`true`,true].includes(item.difficulty as any)  ? <i className="bi bi-circle-fill"></i> : <i className="bi bi-circle"></i>) : `-`}</td>
                                <td className='py-1 td-min-width'>
                                    <div style={{ backgroundColor: '#fff0', border: 'none' }} className=''>
                                        <i className="bi bi-pencil-fill wheel-item-button mr-2" onClick={() => handleEdit(item as IWheelItem)}></i>
                                        {
                                            items.length > 3 && <OverlayTrigger
                                                show={showDeletePopover !== null && showDeletePopover === item.id}
                                                onToggle={() => setShowDeletePopover(-1)}
                                                trigger="click"
                                                rootClose
                                                placement="bottom"
                                                overlay={
                                                    (
                                                        <Popover id="color-picker" className='bg-dark-700'>

                                                            <Popover.Body>
                                                                <Button variant="primary" className='mr-2' onClick={(evt) => handleDelete(evt)} > А нет подожди</Button>
                                                                <Button variant="danger" onClick={(evt) => handleDelete(evt, item as IWheelItem)}>Удалить</Button>
                                                            </Popover.Body>
                                                        </Popover>
                                                    )
                                                }>
                                                <i className="bi bi-trash-fill wheel-item-button wheel-item-delete" onClick={() => setShowDeletePopover(item.id)}></i>
                                            </OverlayTrigger>
                                        }

                                    </div>
                                </td>
                            </tr>) || null
                    }
                    {
                        wheel?.items && wheel?.items?.length < 20 && <tr>
                            <td colSpan={6} className='text-center '>
                                <Button className="w-100 p-0" variant='dark' onClick={handleAdd}>
                                    <i className="bi bi-plus wheel-item-add py-0"></i>
                                </Button>
                            </td>
                        </tr>
                    }

                </tbody>
            </Table>
        </Scrollbars>
        {!currentItem ||
            <WheelItemEditModal
                show={showEditModal}
                item={currentItem}
                onHide={() => {
                    setShowEditModal(false)
                    setCurrentItem(null)
                }}
                isSaving={isSaving}
                onSave={handleSave}
                modalClassName='modal-margin'
            />}
    </Card >
}