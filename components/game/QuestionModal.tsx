import axios, { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { Alert, Badge, Button, Card, Col, Collapse, OverlayTrigger, Popover, Row } from 'react-bootstrap'
import { GameEffectStateWithEffectWithPlayer, Player, Effect, Wheel, WheelItem } from '../../database/db';
import { ApiError } from '../../types/common-api';
import { EffectStateQuestionVars } from '../../types/effectStateVars'
import { parseApiError } from '../../util/error';
import EffectPreview from '../effect/EffectPreview';

interface CustomType {
    id: number;
    title: string;
    meme?: boolean;
}
interface Props {
    effectState: GameEffectStateWithEffectWithPlayer<EffectStateQuestionVars>
    onOk?: (effectState: GameEffectStateWithEffectWithPlayer<EffectStateQuestionVars>) => void;
}
export default function QuestionModal(props: Props) {
    const { effectState, onOk } = props
    const effectVars = effectState.vars
    const [isSaving, setIsSaving] = useState(false)
    const [selectedPlayer, setSelectedPlayer] = useState<Player | undefined>()
    const [selectedEffect, setSelectedEffect] = useState<Effect | undefined>()
    const [selectedType, setSelectedType] = useState<CustomType | undefined>()
    const [selectedScore, setSelectedScore] = useState<CustomType | undefined>()
    const [selectedCubes, setSelectedCubes] = useState<number[]>([])
    const [selectedWheel, setSelectedWheel] = useState<Wheel | undefined>()
    const [selectedWheelItem, setSelectedWheelItem] = useState<WheelItem | undefined>()

    const [error, setError] = useState<ApiError | undefined>()

    const [isFinished, setIsFinished] = useState(false)
    const [isRefused, setIsRefused] = useState(false)

    const [showResult, setShowResult] = useState(false)
    const [resultCube, setResultCube] = useState<number | undefined>()
    const [resultMessage, setResultMessage] = useState<string | undefined>()
    const [lockCubes, setLockCubes] = useState(false)

    useEffect(() => {
        setSelectedPlayer(undefined)
        setSelectedEffect(undefined)
        setSelectedType(undefined)
        // setSelectedCubes(effectVars.guess || [])
        setIsSaving(false)
        // setIsFinished(!!effectVars.message)
        // setIsRefused(!!effectVars.rejected)
        // setShowResult(!!effectVars.message)
        // setResultCube(effectVars.result || null)
        // setLockCubes(!!effectVars.message)
        // setResultMessage(effectVars.message)
    }, [effectState.id])


    function onPlayerSelect(player: Player) {
        setSelectedPlayer(player)
    }
    function onWheelSelect(wheel: Wheel) {
        setSelectedWheel(wheel)
    }
    function onWheelItemSelect(wheelItem: WheelItem) {
        setSelectedWheelItem(wheelItem)
    }
    function onEffectSelect(effect: Effect) {
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
        axios.post<GameEffectStateWithEffectWithPlayer<EffectStateQuestionVars>>(`/api/games/${effectState.gameId}/players/${effectState.playerId}/effects/answer/${effectState.id}`, {
            effectState: effectState,
            selectedPlayerId: selectedPlayer?.id,
            selectedEffectId: selectedEffect?.id,
            selectedTypeId: selectedType?.id,
            selectedScoreId: selectedScore?.id,
            selectedWheelId: selectedWheel?.id,
            selectedWheelItemId: selectedWheelItem?.id,
        })
            .then((res) => {
                if (onOk) onOk(res.data)
                setSelectedPlayer(undefined)
                setSelectedEffect(undefined)
                setSelectedType(undefined)
                setSelectedWheel(undefined)
                setSelectedWheelItem(undefined)
                setSelectedScore(undefined)
            })
            .catch((err: AxiosError<ApiError>) => {
                setIsSaving(false)
                setError(parseApiError(err))
            })
    }
    //#region 
    // function onThrow() {
    //     setIsSaving(true)
    //     setShowResult(true)
    //     setLockCubes(true)
    //     axios.post(`/api/game/rolldice`, {
    //         effectState: effectState,
    //         selectedCubes
    //     })
    //         .then(
    //             (res) => {

    //                 setResultMessage(res.data.message)
    //                 setResultCube(res.data.result)
    //                 setIsFinished(true)
    //                 setIsSaving(false)
    //             },
    //             (err) => {
    //                 setIsSaving(false)
    //                 setShowResult(false)
    //                 setLockCubes(false)
    //                 dispatch(newToast({
    //                     id: Math.random(),
    //                     date: `${Date.now()}`,
    //                     type: 'error',
    //                     title: 'Ошибка',
    //                     text: err.response.data,
    //                 }))
    //             })
    // }
    // function onCancelThrow() {
    //     setIsSaving(true)
    //     axios.post(`/api/game/rolldice`, {
    //         effectState: effectState,
    //         reject: true
    //     })
    //         .then(
    //             (res) => {
    //                 setResultMessage(res.data.message)
    //                 setIsFinished(true)
    //                 setIsRefused(true)
    //                 setIsSaving(false)
    //             },
    //             (err) => {
    //                 setIsSaving(false)
    //                 dispatch(newToast({
    //                     id: Math.random(),
    //                     date: `${Date.now()}`,
    //                     type: 'error',
    //                     title: 'Ошибка',
    //                     text: err.response.data,
    //                 }))
    //             })
    // }
    // function onShoot() {
    //     setIsSaving(true)
    //     setShowResult(true)
    //     setLockCubes(true)
    //     axios.post(`/api/game/shoot`, {
    //         effectState: effectState
    //     })
    //         .then(
    //             (res) => {
    //                 setResultMessage(res.data.message)
    //                 setShowResult(true)
    //                 setIsFinished(true)
    //                 setIsSaving(false)
    //             },
    //             (err) => {
    //                 setIsSaving(false)
    //                 setShowResult(false)
    //                 dispatch(newToast({
    //                     id: Math.random(),
    //                     date: `${Date.now()}`,
    //                     type: 'error',
    //                     title: 'Ошибка',
    //                     text: err.response.data,
    //                 }))
    //             })
    // }
    // function onCancelShoot() {
    //     setIsSaving(true)
    //     axios.post(`/api/game/shoot`, {
    //         effectState: effectState,
    //         reject: true
    //     })
    //         .then(
    //             (res) => {
    //                 setResultMessage(res.data.message)
    //                 setIsFinished(true)
    //                 setIsRefused(true)
    //                 setShowResult(true)
    //                 setIsSaving(false)
    //             },
    //             (err) => {
    //                 setIsSaving(false)
    //                 dispatch(newToast({
    //                     id: Math.random(),
    //                     date: `${Date.now()}`,
    //                     type: 'error',
    //                     title: 'Ошибка',
    //                     text: err.response.data,
    //                 }))
    //             })
    // }
    //#endregion
    function formatQuestion() {
        console.log(effectVars);

        let line = effectVars.question
        if (effectVars.player)
            line = line.replace(`%PLAYERNAME%`, effectVars.player.name)
        if (effectVars.gamePlayer)
            line = line.replace(`%PLAYERNAME%`, effectVars.gamePlayer.player.name)
        if (effectVars.content)
            line = line.replace(`%CONTENTNAME%`, effectVars.content.title)
        return line
    }
    if (effectState.effect.lid == 21)
        return < Card className='bg-dark text-light' >
            <Card.Header >
                <h3>Встал вопрос</h3>
            </Card.Header>
            <Card.Body>
                <Card.Title>{formatQuestion()}</Card.Title>

                <Row className='text-center fs-2 mx-1'>
                    {
                        // [1, 2, 3, 4, 5, 6].map(cube =>
                        //     <Col sm={2}>
                        //         <i
                        //             className={`bi bi-dice-${cube}-fill ${selectedCubes.includes(cube) ? `opacity-die-selected` : `opacity-die`}`}
                        //             onClick={() => onCubeSelect(cube)}
                        //         ></i>
                        //     </Col>)
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
                            // isFinished ?
                            //     <Button disabled={isSaving} variant='primary' className='float-right' onClick={onContinue}>Продолжить</Button> :
                            //     <div>
                            //         <Button disabled={isSaving || selectedCubes.length === 0} variant='primary' className='float-right' onClick={onThrow}>Кинуть куб</Button>
                            //         <Button disabled={isSaving} variant='outline-secondary' className='float-right mr-3 text-light' onClick={onCancelThrow}>Отказаться</Button>
                            //     </div>
                        }
                    </div>
                }
            </Card.Body>
        </Card >
    if (effectState.effect.lid == 22)
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
                            // isFinished ?
                            //     <Button disabled={isSaving} variant='primary' className='float-right' onClick={onContinue}>Продолжить</Button> :
                            //     <div>
                            //         <Button disabled={isSaving} variant='primary' className='float-right' onClick={onShoot}>СТРЕЛЯЙ!!!</Button>
                            //         <Button disabled={isSaving} variant='outline-secondary' className='float-right mr-3 text-light' onClick={onCancelShoot}>Отказаться</Button>
                            //     </div>
                        }
                    </div>
                }
            </Card.Body>
        </Card >

    return (
        <Card className='bg-dark text-light'>
            <Card.Header >
                <h3 className='mb-0'>{effectState.effect.groupId === 43 ? `Держу в курсе` : `Встал вопрос`}</h3>
            </Card.Header>
            <Card.Body>
                <Card.Title>{formatQuestion()}</Card.Title>
                {/* PLAYER */}
                {
                    effectVars.players &&
                    <Badge bg={selectedPlayer ? 'success' : "danger"} className='fs-4 text-center w-100 my-2'>{selectedPlayer?.name || 'Игрок не выбран'}</Badge>
                }
                {effectVars.players &&
                    <Collapse appear in={!selectedPlayer}>
                        <Row >
                            {effectVars.players?.map(player =>
                                <Col key={player.playerId} sm={12} md={6} lg={6}>
                                    <Button variant='secondary' onClick={() => onPlayerSelect(player.player)} className='my-1 w-100'>
                                        {player.player.name}
                                    </Button>
                                </Col>
                            )}
                        </Row>
                    </Collapse>
                }
                {/* EFFECT */}
                {
                    ((effectVars.effects && (!!selectedPlayer || !effectVars.players)) || selectedEffect) &&
                    <Badge bg={selectedEffect ? 'success' : "danger"} className='fs-4 text-center w-100 my-2'>{selectedEffect?.title || 'Эффект не выбран'}</Badge>
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
                                            <Popover id={`popover-${effect.id}`}
                                                style={{
                                                    backgroundColor: '#0000',
                                                    borderColor: '#0000',
                                                    padding: 0,
                                                    maxWidth: '40vw',
                                                }}>
                                                <EffectPreview effect={effect.effect} />
                                            </Popover>
                                        }
                                    >
                                        <Button variant='secondary' onClick={() => onEffectSelect(effect.effect)} className='my-1 w-100'>
                                            {effect.effect.title}
                                        </Button>
                                    </OverlayTrigger>

                                </Col>
                            )}
                        </Row>
                    </Collapse>
                }
                {/* TYPE*/}
                {
                    // ((effectVars.types && (!!selectedPlayer || !effectVars.players) && (!!selectedEffect || !effectVars.effects)) || selectedType) &&
                    // <Badge bg={selectedType ? 'success' : "danger"} className='fs-4 text-center w-100 my-2'>{selectedType?.title || 'Действие не выбрано'}</Badge>
                }
                {
                    // effectVars.types &&
                    // <Collapse appear in={!selectedType && (!!selectedPlayer || !effectVars.players) && (!!selectedEffect || !effectVars.effects)}>
                    //     <Row >
                    //         {effectVars.types?.map(type =>
                    //             <Col key={type.id} sm={12}>
                    //                 <Button variant='secondary' disabled={type.meme} onClick={type.meme ? (() => 3) : (() => onTypeSelect(type))} className='m-1 my-1 w-100'>
                    //                     {type.title}
                    //                 </Button>
                    //             </Col>

                    //         )}
                    //     </Row>
                    // </Collapse>
                }
                {/* SCORE*/}
                {
                    // ((effectVars.scores && (!!selectedPlayer || !effectVars.players) && (!!selectedEffect || !effectVars.effects)
                    //     && (!!selectedType || !effectVars.types)) || selectedScore) &&
                    // <Badge bg={selectedScore ? 'success' : "danger"} className='fs-2 text-center w-100 my-2'>{selectedScore?.title || 'Оценка не выбрана'}</Badge>
                }
                {
                    // <Collapse appear in={!selectedScore && (!!selectedPlayer || !effectVars.players) && (!!selectedEffect || !effectVars.effects) && (!!selectedType || !effectVars.types)}>
                    // effectVars.scores &&
                    //     <Row className='row-cols-10 px-2'>
                    //         {effectVars.scores?.map(score =>
                    //             <Col key={score.id} className='p-0 btn-group'>
                    //                 <Button variant='secondary' disabled={score.meme} onClick={score.meme ? (() => 3) : (() => onScoreSelect(score))} className='m-1 my-1 w-100'>
                    //                     {score.title}
                    //                 </Button>
                    //             </Col>

                    //         )}
                    //     </Row>
                    // </Collapse>
                }
                {/* WHEELS */}
                {
                    effectVars.wheels &&
                    <Badge bg={selectedWheel ? 'success' : "danger"} className='fs-2 text-center w-100 my-2'>{selectedWheel?.ownerName || 'Колесо не выбрано'}</Badge>
                }

                {
                    effectVars.wheels &&
                    <Collapse appear in={!selectedWheel}>
                        <Row >
                            {effectVars.wheels?.map(wheel =>
                                <Col key={wheel.wheelId} sm={12} md={6} lg={6}>
                                    <Button variant='secondary' onClick={() => onWheelSelect(wheel.wheel)} className='my-1 w-100'>
                                        {wheel.wheel.title}
                                    </Button>
                                </Col>
                            )}
                        </Row>
                    </Collapse>
                }
                {/* WHEELITEMS */}
                {
                    // effectVars.wheels && effectVars.withItems &&
                    // <Badge bg={selectedWheelItem ? 'success' : "danger"} className='fs-2 text-center w-100 my-2'>{selectedWheelItem?.title || 'Контент не выбран'}</Badge>
                }
                {
                    // effectVars.wheels && effectVars.withItems && selectedWheel &&
                    // <Collapse appear in={!selectedWheelItem}>
                    //     <Row >
                    //         {selectedWheel.items?.map(wheelItem =>
                    //             <Col key={wheelItem.id} sm={12} md={6} lg={6} className='my-1'>
                    //                 <Button variant='secondary' onClick={() => onWheelItemSelect(wheelItem as IWheelItem)} className='h-100 w-100' >
                    //                     {wheelItem.title}
                    //                 </Button>
                    //             </Col>
                    //         )}
                    //     </Row>
                    // </Collapse>
                }
                {
                    error && <Alert className='mb-0' variant={'danger'}>
                        {error.error}
                    </Alert>
                }
                {/* BUTTONS */}
                {
                    <Collapse appear in={(!!selectedEffect || !effectVars.effects)
                        && (!!selectedPlayer || !effectVars.players)
                        // && (!!selectedType || !effectVars.types)
                        // && (!!selectedScore || !effectVars.scores)
                        // && (!!selectedWheel || !effectVars.wheels)
                        // && (!!selectedWheelItem || !effectVars.withItems)
                    }>
                        <div className='mt-3'>
                            <Button disabled={isSaving} variant='primary' className='float-right' onClick={onContinue}>Продолжить</Button>
                            {/*  */}
                            {/* {effectVars.scores &&
                                <Button disabled={isSaving} variant='secondary' className='float-right mr-2' onClick={() => setSelectedScore(null)}>Изменить оценку</Button>
                            }
                            {effectVars.types &&
                                <Button disabled={isSaving} variant='secondary' className='float-right mr-2' onClick={() => setSelectedType(null)}>Изменить тип</Button>
                            } */}
                            {effectVars.effects &&
                                <Button disabled={isSaving} variant='secondary' className='float-right mr-2' onClick={() => setSelectedEffect(undefined)}>Изменить эффект</Button>
                            }
                            {effectVars.players &&
                                <Button disabled={isSaving} variant='secondary' className='float-right mr-2' onClick={() => setSelectedPlayer(undefined)}>Изменить игрока</Button>
                            }
                            {/* {effectVars.withItems &&
                                <Button disabled={isSaving} variant='secondary' className='float-right mr-2' onClick={() => setSelectedWheelItem(null)}>Изменить контент</Button>
                            }
                            {effectVars.wheels &&
                                <Button disabled={isSaving} variant='secondary' className='float-right mr-2' onClick={() => { setSelectedWheel(null); setSelectedWheelItem(null) }}>Изменить колесо</Button>
                            } */}
                        </div>
                    </Collapse>
                }
            </Card.Body>
        </Card >
    )
}