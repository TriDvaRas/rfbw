import axios from 'axios';
import $ from 'jquery';
import React, { useEffect, useState } from 'react';
import {
    Card, Col, Row, Table
} from 'react-bootstrap';
import Scrollbars from 'react-custom-scrollbars-2';
import { useDispatch, useSelector } from 'react-redux';
import LoadingDots from '../../components/LoadingDots';
import { isNeutral } from '../../util/effects';
import { IAEffect, IEffect } from '../../util/interfaces';
import EffectCard from '../effects/EffectCard';
import { newToast } from '../toasts/toastsSlice';
import AdminEffectCardEdit from './AdminEffectCardEdit';
import { addEffect, deleteEffect, fetchAEffects, selectAEffects, updateEffect } from './aEffectsSlice';
interface Props {
    cardHeight: number;
}
export default function AdminEffects(props: Props) {
    const effects = useSelector(selectAEffects)
    const dispatch = useDispatch()
    const [selectedEffect, setSelectedEffect] = useState<IAEffect | null>(null)
    const [previewHeight, setPreviewHeight] = useState(0)
    const [isSaving, setIsSaving] = useState(false)
    useEffect(() => {
        if (effects.status === 'idle') {
            dispatch(fetchAEffects())
        }
    }, [effects.status, dispatch])

    useEffect(() => {
        if (selectedEffect)
            setSelectedEffect(effects.effects?.find(x => x.id === selectedEffect?.id) || null)
        setPreviewHeight($('#admin-effect-preview')?.outerHeight() || 0)
    }, [effects.effects, selectedEffect])

    useEffect(() => {
        setPreviewHeight($('#admin-effect-preview')?.outerHeight() || 0)
    }, [props.cardHeight])

    function handleSave(newData: IEffect) {
        setIsSaving(true)
        axios.patch(`/api/admin/effects`, newData)
            .then(() => {
                setIsSaving(false)
                dispatch(newToast({
                    id: Math.random(),
                    date: `${Date.now()}`,
                    type: 'success',
                    title: 'Сохранил',
                    autohide: 5000
                }))
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
    function handleAdd() {
        const tempId = -Math.random()
        dispatch(addEffect(tempId))
        axios.post(`/api/admin/effects/`)
            .then(
                newItem => {
                    dispatch(updateEffect({ tempId, ...newItem.data }))
                    dispatch(newToast({
                        id: Math.random(),
                        date: `${Date.now()}`,
                        type: 'success',
                        title: 'Добавил',
                        autohide: 5000
                    }))
                },
                (err) => {
                    dispatch(deleteEffect(tempId))
                    dispatch(newToast({
                        id: Math.random(),
                        date: `${Date.now()}`,
                        type: 'error',
                        title: 'Ошибка',
                        text: err.response.data,
                    }))
                })
    }

    return (
        <Row>
            <Col xl={8} xs={12}>
                <Card
                    bg='dark'
                    text='light'
                    className="m-3 w-100 h-100"
                    style={{ maxHeight: props.cardHeight }}
                >
                    <Card.Header><h3>События</h3></Card.Header>
                    <Scrollbars autoHeight autoHeightMin={props.cardHeight - 68}>
                        <Table variant="dark" hover className='mb-0 fs-1'>
                            <thead className='bg-dark-700'>
                                <tr>
                                    <th className='text-center'>Id</th>
                                    <th>Название</th>
                                    <th>Описание</th>
                                    <th>Группа</th>
                                    <th className='text-center'>Позитив?</th>
                                    <th className='text-center'>Нейтрал?</th>
                                    <th className='text-center'>Негатив?</th>
                                    <th className='text-center'>Карта?</th>
                                    <th className='text-center'>Секрет?</th>
                                </tr>
                            </thead>
                            <tbody>
                                {effects.effects?.map(effect => effect.loading ?
                                    <tr key={effect.id}><td colSpan={9}><LoadingDots count={3} /></td></tr> :
                                    <tr key={effect.id} onClick={() => setSelectedEffect(effect)} className={selectedEffect?.id === effect.id ? 'bg-dark-750' : ''}>
                                        <td className='text-center'>{effect.id}</td>
                                        <td>{effect.title}</td>
                                        <td className='cell-overflow-ellipsis'>{effect.description}</td>
                                        <td>{effect.groupId}</td>
                                        <td className='text-center'>{effect.isPositive ? <i className="bi bi-circle-fill"></i> : <i className="bi bi-circle"></i>}</td>
                                        <td className='text-center'>{isNeutral(effect as IEffect) ? <i className="bi bi-circle-fill"></i> : <i className="bi bi-circle"></i>}</td>
                                        <td className='text-center'>{effect.isNegative ? <i className="bi bi-circle-fill"></i> : <i className="bi bi-circle"></i>}</td>
                                        <td className='text-center'>{effect.isCard ? <i className="bi bi-circle-fill"></i> : <i className="bi bi-circle"></i>}</td>
                                        <td className='text-center'>{effect.isSecret ? <i className="bi bi-circle-fill"></i> : <i className="bi bi-circle"></i>}</td>
                                    </tr>
                                )}
                                {
                                    effects.effects && <tr>
                                        <td colSpan={9} className='text-center py-0' onClick={handleAdd}>
                                            <i className="bi bi-plus wheel-item-add " ></i>
                                        </td>
                                    </tr>
                                }
                            </tbody>
                        </Table>
                    </Scrollbars>
                </Card>
            </Col>
            <Col xl={4} xs={12}>
                <Card bg='dark' className='m-3'>
                    <Card.Header>
                        <h3>Шпора по группам</h3>
                    </Card.Header>
                    <Card.Body>
                        <ul>
                            <li>1 - надо поговорить</li>
                            <li>2 - надо реворк</li>
                            <li>3 - надо баланс</li>
                            <li>3 - надо доделать</li>
                            <li>10-19 - группы взаимоудаляющих событий</li>
                            <li>20-29 - группы взаимоисключающих событий</li>
                            <li>30-39 - эффекты с длительностью</li>
                            <li>40-49 - системные эффекты(нет на колесе)</li>
                            <li>99 - постоянные события</li>
                        </ul>
                    </Card.Body>
                </Card>
                {!selectedEffect || <EffectCard effect={selectedEffect as IEffect} id='admin-effect-preview' className='m-3' />}
                {!selectedEffect || <AdminEffectCardEdit maxHeight={props.cardHeight - 18 - previewHeight} onSave={handleSave} effect={selectedEffect as IEffect} isSaving={isSaving} />}
            </Col>
        </Row>
    )
}


