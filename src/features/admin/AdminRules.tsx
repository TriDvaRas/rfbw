import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
    Button, ButtonGroup, Card, Col, Form, Modal, OverlayTrigger, Popover, Row, Spinner, ToggleButton,
    ToggleButtonGroup
} from 'react-bootstrap';
import Scrollbars from 'react-custom-scrollbars-2';
import ReactMarkdown from 'react-markdown';
import { useDispatch, useSelector } from 'react-redux';
import rehypeRaw from 'rehype-raw';
import LoadingDots from '../../components/LoadingDots';
import CodeEditor from '../../util/CodeEditor';
import { bgColors, fgColors } from '../../util/highlightColors';
import { highlightMdAll } from '../../util/lines';
import { newToast } from '../toasts/toastsSlice';
import { fetchARules, getARules, updateMarkdown } from './aRulesSlice';

interface Props {
    cardHeight: number;
}
export default function AdminRules(props: Props) {
    const rules = useSelector(getARules)
    const dispatch = useDispatch()
    const [oldRules, setOldRules] = useState<string | null>(null)
    const [editing, setEditing] = useState<boolean>(true)
    const [showResetPopover, setShowResetPopover] = useState(false)
    const [showRatSaveModal, setShowRatSaveModal] = useState(false)
    const [showSaveModal, setShowSaveModal] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [postMessage, setPostMessage] = useState('')
    useEffect(() => {
        if (rules.status === 'idle') {
            dispatch(fetchARules())
        }
        else if (oldRules == null && rules.markdown) {
            setOldRules(rules.markdown)
        }
    }, [rules.status, dispatch, rules.markdown, oldRules])

    const prevOld = highlightMdAll(oldRules || '', fgColors, bgColors, rules.savedBy || '?', rules.timestamp || '1')
    const prevNew = highlightMdAll(rules.markdown || '', fgColors, bgColors, rules.savedBy || '?', rules.timestamp || '1')


    function handleReset() {
        setShowResetPopover(false)
        dispatch(updateMarkdown(oldRules))
    }
    function handleSave(silent: boolean) {
        setIsSaving(true)
        axios.post(`/api/admin/rules`, { markdown: rules.markdown, silent, message: silent ? null : postMessage })
            .then(() => {
                setIsSaving(false)
                silent ? setShowRatSaveModal(false) : setShowSaveModal(false)
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
    return (
        <div>
            <Modal
                show={showRatSaveModal}
                // onHide={handleClose}
                backdrop="static"
                keyboard={false}
                contentClassName='bg-dark text-light border border-dark'
            >
                <Modal.Header >
                    <Modal.Title>Сохранение в крысу</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {`Дата обновления не меняется, не создается пост об изменении правил, сохранивший изменяется. Нужно для исправления очепяток.`}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" disabled={isSaving} onClick={() => setShowRatSaveModal(false)}>
                        Отмена
                    </Button>
                    <Button variant="primary" disabled={isSaving} onClick={() => {
                        handleSave(true)
                    }}>{isSaving ? <Spinner size='sm' animation="border" /> : 'Сохранить'}</Button>
                </Modal.Footer>
            </Modal>
            <Modal
                show={showSaveModal}
                // onHide={handleClose}
                backdrop="static"
                keyboard={false}
                contentClassName='bg-dark text-light border border-dark'
            >
                <Modal.Header >
                    <Modal.Title>Сохранение</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {`Дата обновления меняется, создается пост об изменении правил, сохранивший изменяется. Нужно для патчей.`}
                    <Form.Label>Текст поста</Form.Label>
                    <Form.Control type='input'></Form.Control>
                </Modal.Body>
                <Modal.Footer>
                    <Button disabled={isSaving} variant="secondary" onClick={() => setShowSaveModal(false)}>
                        Отмена
                    </Button>
                    Будет работать когда будут работать посты
                    {/* <Button disabled={isSaving} variant="primary" onClick={() => {
                        handleSave(false)
                    }}>{isSaving ? <Spinner size='sm' animation="border" /> : 'Сохранить'}</Button> */}
                </Modal.Footer>
            </Modal>
            <Col xs={12} xl={12}>
                <Card
                    bg='dark'
                    text='light'
                    className="m-3 w-100 h-100"
                    style={{ maxHeight: props.cardHeight }}
                >
                    <Card.Header><Col xs={12}>
                        <div className='d-flex justify-content-between '>
                            <h3 className='float-left'>Редактор правил</h3>
                            <ToggleButtonGroup className='float-right' type="radio" name="options" defaultValue={'true'} onChange={(e) => setEditing(e === 'true')}>
                                <ToggleButton id="tbg-radio-2" value={'true'} variant='secondary'>
                                    Редактор
                                </ToggleButton>
                                <ToggleButton id="tbg-radio-1" value={'false'} variant='secondary'>
                                    Сравнение
                                </ToggleButton>
                            </ToggleButtonGroup>
                            <ButtonGroup>
                                <OverlayTrigger
                                    show={showResetPopover}
                                    onToggle={() => setShowResetPopover(!showResetPopover)}
                                    trigger="click"
                                    rootClose
                                    placement="bottom"
                                    overlay={
                                        (
                                            <Popover id="reset-confirm" className='bg-dark-700'>
                                                <Popover.Body>
                                                    <Button variant="primary" className='mr-2' onClick={() => setShowResetPopover(false)} >Отмена</Button>
                                                    <Button variant="danger" onClick={() => handleReset()}>ДА УРА ДАВАЙ</Button>
                                                </Popover.Body>
                                            </Popover>
                                        )
                                    }>
                                    <Button variant='danger'>Сброс изменений</Button>
                                </OverlayTrigger>

                                <Button variant='secondary' onClick={() => setShowRatSaveModal(true)}>Сохранить в крысу</Button>
                                <Button variant='primary' onClick={() => setShowSaveModal(true)}>Сохранить</Button>
                            </ButtonGroup>
                        </div>
                        {/* </Card> */}
                    </Col>
                    </Card.Header>
                    <Scrollbars autoHeight autoHeightMin={props.cardHeight - 68}>
                        <Card.Body className='px-3 py-0'>
                            {
                                editing ? (
                                    rules.status === 'failed' ? null :
                                        rules.markdown ?
                                            <Row>
                                                <Col className={`${editing ? `bg-code` : ``}`}>
                                                    <CodeEditor content={rules.markdown || 'sd'} language='md' />
                                                </Col>
                                                <Col>
                                                    <ReactMarkdown rehypePlugins={[rehypeRaw]} className='mr-3'>
                                                        {prevNew}
                                                    </ReactMarkdown>
                                                </Col>
                                            </Row>
                                            :
                                            <LoadingDots />
                                ) : (
                                    rules.status === 'failed' ? null :
                                        rules.markdown ?
                                            <Row>
                                                <Col>
                                                    <ReactMarkdown rehypePlugins={[rehypeRaw]} >
                                                        {`# До\n\n --- \n\n${prevOld}`}
                                                    </ReactMarkdown>
                                                </Col>
                                                <Col>
                                                    <ReactMarkdown rehypePlugins={[rehypeRaw]} >
                                                        {`# После\n\n --- \n\n${prevNew}`}
                                                    </ReactMarkdown>
                                                </Col>
                                            </Row> :
                                            <LoadingDots />
                                )

                            }
                        </Card.Body>
                    </Scrollbars>
                </Card>
            </Col>
            <Col xs={12} xl={12}></Col>
        </div>
    )
}

