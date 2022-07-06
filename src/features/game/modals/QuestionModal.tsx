import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Button, Card, Modal, Spinner, Image, Col, Row, Collapse, Badge, OverlayTrigger, Popover } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { IEffect, IEffectState, IPlayer, IWheel, IWheelItem } from '../../../util/interfaces'
import { deleteEffect } from '../../admin/aEffectsSlice'
import EffectCard from '../../effects/EffectCard'
import { newToast } from '../../toasts/toastsSlice'

interface CustomType {
    id: number;
    title: string;
    meme?: boolean;
}
interface Props {
    effectState: IEffectState;
    effectVars: {
        question: string;
        players?: Array<IPlayer>;
        effects?: Array<IEffect>;
        types?: Array<CustomType>
        scores?: Array<CustomType>
        player?: IPlayer;
        content?: IWheelItem
        is21?: boolean;
        is22?: boolean;
        result?: number;
        guess?: number[];
        message?: string;
        rejected?: boolean;
        wheels?: IWheel[];
        withItems?: boolean;
    }
    onOk?: Function;
}
export default function QuestionModal(props: Props) {
    const { effectVars, effectState, onOk } = props
    const [isSaving, setIsSaving] = useState(false)
    const [selectedPlayer, setSelectedPlayer] = useState<IPlayer | null>(null)
    const [selectedEffect, setSelectedEffect] = useState<IEffect | null>(null)
    const [selectedType, setSelectedType] = useState<CustomType | null>(null)
    const [selectedScore, setSelectedScore] = useState<CustomType | null>(null)
    const [selectedCubes, setSelectedCubes] = useState<number[]>([])
    const [selectedWheel, setSelectedWheel] = useState<IWheel | null>(null)
    const [selectedWheelItem, setSelectedWheelItem] = useState<IWheelItem | null>(null)

    const [isFinished, setIsFinished] = useState(false)
    const [isRefused, setIsRefused] = useState(false)

    const [showResult, setShowResult] = useState(false)
    const [resultCube, setResultCube] = useState<number | null>(null)
    const [resultMessage, setResultMessage] = useState<string | null>()
    const [lockCubes, setLockCubes] = useState(false)

    useEffect(() => {
        setSelectedPlayer(null)
        setSelectedEffect(null)
        setSelectedType(null)
        setSelectedCubes(effectVars.guess || [])
        setIsSaving(false)
        setIsFinished(!!effectVars.message)
        setIsRefused(!!effectVars.rejected)
        setShowResult(!!effectVars.message)
        setResultCube(effectVars.result || null)
        setLockCubes(!!effectVars.message)
        setResultMessage(effectVars.message)
    }, [effectVars, effectState.id])


    const dispatch = useDispatch()
    function onPlayerSelect(player: IPlayer) {
        setSelectedPlayer(player)
    }
    function onWheelSelect(wheel: IWheel) {
        setSelectedWheel(wheel)
    }
    function onWheelItemSelect(wheelItem: IWheelItem) {
        setSelectedWheelItem(wheelItem)
    }
    function onEffectSelect(effect: IEffect) {
        setSelectedEffect(effect)
    }
    function onTypeSelect(type: CustomType) {
        setSelectedType(type)
    }
    function onScoreSelect(score: CustomType) {
        setSelectedScore(score)
    }
    function onCubeSelect(cube: number) {
        if (lockCubes)
            return
        if (selectedCubes.includes(cube))
            setSelectedCubes(selectedCubes.filter(x => x !== cube))
        else
            setSelectedCubes([...selectedCubes, cube].slice(0, 3))

    }
    function onContinue() {
        setIsSaving(true)
        axios.post(`/api/game/ans`, {
            effectState: effectState,
            selectedPlayerId: selectedPlayer?.id,
            selectedEffectId: selectedEffect?.id,
            selectedTypeId: selectedType?.id,
            selectedScoreId: selectedScore?.id,
            selectedWheelId: selectedWheel?.id,
            selectedWheelItemId: selectedWheelItem?.id,
        })
            .then(
                (res) => {
                    if (onOk) onOk()
                    dispatch(newToast({
                        id: Math.random(),
                        date: `${Date.now()}`,
                        type: 'success',
                        title: `Ответ записан ${res.data}`,
                        autohide: 5000
                    }))
                    setSelectedPlayer(null)
                    setSelectedEffect(null)
                    setSelectedType(null)
                    setSelectedWheel(null)
                    setSelectedWheelItem(null)
                    setSelectedScore(null)
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
    function onThrow() {
        setIsSaving(true)
        setShowResult(true)
        setLockCubes(true)
        axios.post(`/api/game/rolldice`, {
            effectState: effectState,
            selectedCubes
        })
            .then(
                (res) => {

                    setResultMessage(res.data.message)
                    setResultCube(res.data.result)
                    setIsFinished(true)
                    setIsSaving(false)
                },
                (err) => {
                    setIsSaving(false)
                    setShowResult(false)
                    setLockCubes(false)
                    dispatch(newToast({
                        id: Math.random(),
                        date: `${Date.now()}`,
                        type: 'error',
                        title: 'Ошибка',
                        text: err.response.data,
                    }))
                })
    }
    function onCancelThrow() {
        setIsSaving(true)
        axios.post(`/api/game/rolldice`, {
            effectState: effectState,
            reject: true
        })
            .then(
                (res) => {
                    setResultMessage(res.data.message)
                    setIsFinished(true)
                    setIsRefused(true)
                    setIsSaving(false)
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
    function onShoot() {
        setIsSaving(true)
        setShowResult(true)
        setLockCubes(true)
        axios.post(`/api/game/shoot`, {
            effectState: effectState
        })
            .then(
                (res) => {
                    setResultMessage(res.data.message)
                    setShowResult(true)
                    setIsFinished(true)
                    setIsSaving(false)
                },
                (err) => {
                    setIsSaving(false)
                    setShowResult(false)
                    dispatch(newToast({
                        id: Math.random(),
                        date: `${Date.now()}`,
                        type: 'error',
                        title: 'Ошибка',
                        text: err.response.data,
                    }))
                })
    }
    function onCancelShoot() {
        setIsSaving(true)
        axios.post(`/api/game/shoot`, {
            effectState: effectState,
            reject: true
        })
            .then(
                (res) => {
                    setResultMessage(res.data.message)
                    setIsFinished(true)
                    setIsRefused(true)
                    setShowResult(true)
                    setIsSaving(false)
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
    function formatQuestion() {
        let line = effectVars.question
        if (effectVars.player)
            line = line.replace(`%PLAYERNAME%`, effectVars.player.name)
        if (effectVars.content)
            line = line.replace(`%CONTENTNAME%`, effectVars.content.title)
        return line
    }

    if (effectVars.is21)
        return <Card className='bg-dark text-light'>
            <Card.Header >
                <h3>Встал вопрос</h3>
            </Card.Header>
            <Card.Body>
                <Card.Title>{formatQuestion()}</Card.Title>

                <Row className='text-center fs-2 mx-1'>
                    {
                        [1, 2, 3, 4, 5, 6].map(cube =>
                            <Col sm={2}>
                                <i
                                    className={`bi bi-dice-${cube}-fill ${selectedCubes.includes(cube) ? `opacity-die-selected` : `opacity-die`}`}
                                    onClick={() => onCubeSelect(cube)}
                                ></i>
                            </Col>)
                    }
                </Row>
                <Collapse appear in={selectedCubes && selectedCubes.length > 0}>
                    <Row className='text-center row-cols-6 mx-1 '>
                        <Col sm={(selectedCubes.length || 1) * 2} className='p-0'>
                            <Card.Text className='m-0'>Повезет</Card.Text>
                        </Col>
                        <Col sm={12 - (selectedCubes.length || 1) * 2} className='p-0'>
                            <Card.Text className='m-0'>Не повезет</Card.Text>
                        </Col>
                        <Col sm={(selectedCubes.length || 1) * 2} className='m-0 p-0 '>
                            <Badge
                                style={{
                                    borderTopRightRadius: 0,
                                    borderBottomRightRadius: 0,
                                    fontSize: '1.4em'
                                }}
                                bg='success'
                                className='w-100'>+{48 / (selectedCubes.length || 1)}</Badge>
                        </Col>
                        <Col sm={12 - (selectedCubes.length || 1) * 2} className='m-0 p-0 '>
                            <Badge
                                style={{
                                    borderTopLeftRadius: 0,
                                    borderBottomLeftRadius: 0,
                                    fontSize: '1.4em'
                                }}
                                bg='danger'
                                className='w-100'>-{16}</Badge>
                        </Col>
                        {/* <Card.Text>{`${selectedCubes.length}/6: +${48 / selectedCubes.length} очков`}</Card.Text>
                        <Card.Text>{`${6 - selectedCubes.length}/6: -${16} очков`}</Card.Text> */}
                        <br />
                    </Row>
                </Collapse>
                <Collapse appear in={showResult} className='w-100'>
                    <div>
                        {
                            isRefused || <Row className='text-center fs-3 mx-1'>
                                <Col sm={12} className="">
                                    {
                                        resultCube ?
                                            <i className={`bi bi-dice-${resultCube}-fill  text-center mx-1`}></i> :
                                            <i className="bi bi-square-fill text-center  mx-1"></i>
                                    }
                                </Col>
                            </Row>
                        }
                        <Row className='text-center mx-1'>
                            <Col sm={12} >
                                <span className='fs-2'>{resultMessage || `...`}</span>
                            </Col>
                        </Row>
                    </div>
                </Collapse>
                {/* BUTTONS */}
                {
                    <div className='mt-3'>
                        {
                            isFinished ?
                                <Button disabled={isSaving} variant='primary' className='float-right' onClick={onContinue}>Продолжить</Button> :
                                <div>
                                    <Button disabled={isSaving || selectedCubes.length === 0} variant='primary' className='float-right' onClick={onThrow}>Кинуть куб</Button>
                                    <Button disabled={isSaving} variant='outline-secondary' className='float-right mr-3 text-light' onClick={onCancelThrow}>Отказаться</Button>
                                </div>
                        }
                    </div>
                }
            </Card.Body>
        </Card >
    if (effectVars.is22)
        return <Card className='bg-dark text-light'>
            <Card.Header >
                <h3>Встал вопрос</h3>
            </Card.Header>
            <Card.Body>
                <Card.Img src={`/revolver.png`}></Card.Img>
                <Card.Title>{formatQuestion()}</Card.Title>
                <Card.Subtitle>Шанс сдохнуть 1/6</Card.Subtitle>
                <Collapse appear in={showResult} className='w-100'>
                    <div>
                        <Row className='text-center mx-1'>
                            <Col sm={12} >
                                <span className='fs-2'>{resultMessage || `...`}</span>
                            </Col>
                        </Row>
                    </div>
                </Collapse>
                {/* BUTTONS */}
                {

                    <div className='mt-3'>
                        {
                            isFinished ?
                                <Button disabled={isSaving} variant='primary' className='float-right' onClick={onContinue}>Продолжить</Button> :
                                <div>
                                    <Button disabled={isSaving} variant='primary' className='float-right' onClick={onShoot}>СТРЕЛЯЙ!!!</Button>
                                    <Button disabled={isSaving} variant='outline-secondary' className='float-right mr-3 text-light' onClick={onCancelShoot}>Отказаться</Button>
                                </div>
                        }

                    </div>
                }
            </Card.Body>
        </Card >



    return (
        <Card className='bg-dark text-light'>
            <Card.Header >
                <h3>{effectState.effect.groupId === 43 ? `Держу в курсе` : `Встал вопрос`}</h3>
            </Card.Header>
            <Card.Body>
                <Card.Title>{formatQuestion()}</Card.Title>
                {/* PLAYER */}
                {
                    effectVars.players &&
                    <Badge bg={selectedPlayer ? 'success' : "danger"} className='fs-2 text-center w-100 my-2'>{selectedPlayer?.name || 'Игрок не выбран'}</Badge>
                }
                {effectVars.players &&
                    <Collapse appear in={!selectedPlayer}>
                        <Row >
                            {effectVars.players?.map(player =>
                                <Col key={player.id} sm={12} md={6} lg={6}>
                                    <Button variant='secondary' onClick={() => onPlayerSelect(player)} className='my-1 w-100'>
                                        {player.name}
                                    </Button>
                                </Col>
                            )}
                        </Row>
                    </Collapse>
                }
                {/* EFFECT */}
                {
                    ((effectVars.effects && (!!selectedPlayer || !effectVars.players)) || selectedEffect) &&
                    <Badge bg={selectedEffect ? 'success' : "danger"} className='fs-2 text-center w-100 my-2'>{selectedEffect?.title || 'Эффект не выбран'}</Badge>
                }
                {effectVars.effects &&
                    <Collapse appear in={!selectedEffect && (!!selectedPlayer || !effectVars.players)}>
                        <Row >
                            {effectVars.effects?.map(effect =>
                                <Col key={effect.id} sm={12} md={6} lg={6}>
                                    <OverlayTrigger
                                        trigger={["hover", "focus"]}
                                        placement={'auto'}
                                        overlay={
                                            <Popover id={`popover-${effect.id}`}>
                                                <EffectCard effect={effect} compact noScroll />
                                            </Popover>
                                        }
                                    >
                                        <Button variant='secondary' onClick={() => onEffectSelect(effect)} className='my-1 w-100'>
                                            {effect.title}
                                        </Button>
                                    </OverlayTrigger>

                                </Col>
                            )}
                        </Row>
                    </Collapse>
                }
                {/* TYPE*/}
                {
                    ((effectVars.types && (!!selectedPlayer || !effectVars.players) && (!!selectedEffect || !effectVars.effects)) || selectedType) &&
                    <Badge bg={selectedType ? 'success' : "danger"} className='fs-2 text-center w-100 my-2'>{selectedType?.title || 'Действие не выбрано'}</Badge>
                }
                {effectVars.types &&
                    <Collapse appear in={!selectedType && (!!selectedPlayer || !effectVars.players) && (!!selectedEffect || !effectVars.effects)}>
                        <Row >
                            {effectVars.types?.map(type =>
                                <Col key={type.id} sm={12}>
                                    <Button variant='secondary' disabled={type.meme} onClick={type.meme ? (() => 3) : (() => onTypeSelect(type))} className='m-1 my-1 w-100'>
                                        {type.title}
                                    </Button>
                                </Col>

                            )}
                        </Row>
                    </Collapse>
                }
                {/* SCORE*/}
                {
                    ((effectVars.scores && (!!selectedPlayer || !effectVars.players) && (!!selectedEffect || !effectVars.effects)
                        && (!!selectedType || !effectVars.types)) || selectedScore) &&
                    <Badge bg={selectedScore ? 'success' : "danger"} className='fs-2 text-center w-100 my-2'>{selectedScore?.title || 'Оценка не выбрана'}</Badge>
                }
                {effectVars.scores &&
                    <Collapse appear in={!selectedScore && (!!selectedPlayer || !effectVars.players) && (!!selectedEffect || !effectVars.effects) && (!!selectedType || !effectVars.types)}>
                        <Row className='row-cols-10 px-2'>
                            {effectVars.scores?.map(score =>
                                <Col key={score.id} className='p-0 btn-group'>
                                    <Button variant='secondary' disabled={score.meme} onClick={score.meme ? (() => 3) : (() => onScoreSelect(score))} className='m-1 my-1 w-100'>
                                        {score.title}
                                    </Button>
                                </Col>

                            )}
                        </Row>
                    </Collapse>
                }
                {/* WHEELS */}
                {
                    effectVars.wheels &&
                    <Badge bg={selectedWheel ? 'success' : "danger"} className='fs-2 text-center w-100 my-2'>{selectedWheel?.ownerName || 'Колесо не выбрано'}</Badge>
                }
                {effectVars.wheels &&
                    <Collapse appear in={!selectedWheel}>
                        <Row >
                            {effectVars.wheels?.map(wheel =>
                                <Col key={wheel.id} sm={12} md={6} lg={6}>
                                    <Button variant='secondary' onClick={() => onWheelSelect(wheel)} className='my-1 w-100'>
                                        {wheel.ownerName}
                                    </Button>
                                </Col>
                            )}
                        </Row>
                    </Collapse>
                }
                {/* WHEELITEMS */}
                {
                    effectVars.wheels && effectVars.withItems &&
                    <Badge bg={selectedWheelItem ? 'success' : "danger"} className='fs-2 text-center w-100 my-2'>{selectedWheelItem?.title || 'Контент не выбран'}</Badge>
                }
                {effectVars.wheels && effectVars.withItems && selectedWheel &&
                    <Collapse appear in={!selectedWheelItem}>
                        <Row >
                            {selectedWheel.items?.map(wheelItem =>
                                <Col key={wheelItem.id} sm={12} md={6} lg={6} className='my-1'>
                                    <Button variant='secondary' onClick={() => onWheelItemSelect(wheelItem as IWheelItem)} className='h-100 w-100' >
                                        {wheelItem.title}
                                    </Button>
                                </Col>
                            )}
                        </Row>
                    </Collapse>
                }
                {/* BUTTONS */}
                {
                    <Collapse appear in={(!!selectedEffect || !effectVars.effects) && (!!selectedPlayer || !effectVars.players)
                        && (!!selectedType || !effectVars.types) && (!!selectedScore || !effectVars.scores)
                        && (!!selectedWheel || !effectVars.wheels) && (!!selectedWheelItem || !effectVars.withItems)}>
                        <div className='mt-3'>
                            <Button disabled={isSaving} variant='primary' className='float-right' onClick={onContinue}>Продолжить</Button>
                            {/*  */}
                            {effectVars.scores &&
                                <Button disabled={isSaving} variant='secondary' className='float-right mr-2' onClick={() => setSelectedScore(null)}>Изменить оценку</Button>
                            }
                            {effectVars.types &&
                                <Button disabled={isSaving} variant='secondary' className='float-right mr-2' onClick={() => setSelectedType(null)}>Изменить тип</Button>
                            }
                            {effectVars.effects &&
                                <Button disabled={isSaving} variant='secondary' className='float-right mr-2' onClick={() => setSelectedEffect(null)}>Изменить эффект</Button>
                            }
                            {effectVars.players &&
                                <Button disabled={isSaving} variant='secondary' className='float-right mr-2' onClick={() => setSelectedPlayer(null)}>Изменить игрока</Button>
                            }
                            {effectVars.withItems &&
                                <Button disabled={isSaving} variant='secondary' className='float-right mr-2' onClick={() => setSelectedWheelItem(null)}>Изменить контент</Button>
                            }
                            {effectVars.wheels &&
                                <Button disabled={isSaving} variant='secondary' className='float-right mr-2' onClick={() => { setSelectedWheel(null); setSelectedWheelItem(null) }}>Изменить колесо</Button>
                            }
                        </div>
                    </Collapse>
                }
            </Card.Body>
        </Card >
    )
}