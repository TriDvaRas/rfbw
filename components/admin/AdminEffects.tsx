import axios, { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Table, Alert } from 'react-bootstrap';
import LoadingDots from '../../components/LoadingDots';
import useAllEffects from '../../data/useAllEffects';
import AdminEffectCardEdit from './AdminEffectCardEdit';
import { Effect } from '../../database/db';
import { ApiError } from '../../types/common-api';
import { parseApiError } from '../../util/error';
import EffectPreview from '../effect/EffectPreview';
import _ from 'lodash';
interface Props {
    cardHeight: number;
}
export default function AdminEffects(props: Props) {
    const effects = useAllEffects()
    const [selectedEffect, setSelectedEffect] = useState<Effect | null>(null)
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState<ApiError | undefined>()
    const [sortBy, setSortBy] = useState<string>('lid')
    function handleSaved(newEffect: Effect) {
        setIsSaving(false)
        effects.mutate(effects.effects?.map(x => (x.id == newEffect.id ? newEffect : x)))
    }
    function handleAdd() {
        setIsSaving(true)
        axios.post<Effect>(`/api/admin/effects/`)
            .then((res) => {
                setIsSaving(false)
                effects.mutate([...(effects.effects || []), res.data])
            })
            .catch((err: AxiosError<ApiError>) => {
                setIsSaving(false)
                setError(parseApiError(err))
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
                    <div style={{ minHeight: props.cardHeight - 68 }}>
                        <Table variant="dark" hover className='mb-0 '>
                            <thead className='bg-dark-700 '>
                                <tr>
                                    <th onClick={()=>setSortBy('id')} className='text-center'>id</th>
                                    <th onClick={()=>setSortBy('lid')} className='text-center'>lid</th>
                                    <th onClick={()=>setSortBy('title')} className='text-center'>Название</th>
                                    <th onClick={()=>setSortBy('description')} className='text-center'>Описание</th>
                                    <th onClick={()=>setSortBy('groupId')} className='text-center'>Группа</th>
                                    <th onClick={()=>setSortBy('type')} className='text-center'>Тип</th>
                                    <th onClick={()=>setSortBy('imageId')} className='text-center'><i className="bi bi-card-image"></i></th>

                                </tr>
                            </thead>
                            <tbody>
                                {_.sortBy(effects.effects || [], sortBy).map(effect => <tr key={effect.id} onClick={() => setSelectedEffect(effect)} className={selectedEffect?.id === effect.id ? 'bg-dark-750' : ''}>
                                    <td className='text-center td-min' style={{ fontSize: '50%' }}>{effect.id}</td>
                                    <td className='text-center td-min'>{effect.lid}</td>
                                    <td className='td-min'>{effect.title}</td>
                                    <td className='cell-overflow-ellipsis'>{effect.description}</td>
                                    <td className='text-center td-min'>{effect.groupId}</td>
                                    <td className='text-center td-min'>{effect.type}</td>
                                    <td className='text-center td-min'>{effect.imageId ? <i className="bi bi-card-image"></i> : null}</td>
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
                    </div>
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
                {error && <Alert className='mb-0' variant={'danger'}>
                    {error.error}
                </Alert>}
                {!selectedEffect || <EffectPreview effect={selectedEffect} className='m-3' />}
                {!selectedEffect || <AdminEffectCardEdit
                    // maxHeight={props.cardHeight - 18 - previewHeight}
                    onSaved={handleSaved}
                    onChange={(upd) =>
                        setSelectedEffect({
                            ...selectedEffect,
                            ...upd
                        } as Effect)
                    }
                    effect={selectedEffect} />}
            </Col>
        </Row>
    )
}


