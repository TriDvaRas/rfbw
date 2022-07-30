import { useSession } from 'next-auth/react';
import Head from "next/head";
import { useRouter } from 'next/router';
import { useRef, useState } from "react";
import { Alert, Col, Row, Card, Button, Collapse } from 'react-bootstrap';
import { useElementSize, useWindowSize } from 'usehooks-ts';
import LoadingDots from "../../../components/LoadingDots";
import { NotAPlayerCard } from "../../../components/NotAPlayerCard";
import TheWheel from '../../../components/wheel/TheWheel';
import WheelItems from "../../../components/wheelItem/WheelItems";
import useWheel from "../../../data/useWheel";
import useWheelItems from '../../../data/useWheelItems';
import GetThinLayout from '../../../layouts/thin';
import { NextPageWithLayout } from "../../_app";
import GetGameLayout from '../../../layouts/game';
import WheelPreview from '../../../components/wheel/WheelPreview';
import axios from 'axios';
import usePlayerTasks from '../../../data/usePlayerTasks';
import { GameEffectWithEffect, GameTask, WheelItem } from '../../../database/db';
import { GameSpinEffectResult, GameSpinResult } from '../../../types/game';
import WheelItemPreview from '../../../components/effect/EffectPreview';
import ReactAudioPlayer from 'react-audio-player';
import useDelayedState from 'use-delayed-state';
import { ApiError } from '../../../types/common-api';
import { parseApiError } from '../../../util/error';
import TaskWheelItemPreview from '../../../components/wheelItem/TaskWheelItemPreview';
import useGameEffectsWheelItems from '../../../data/useGameEffectsWheelItems';
import { effectsConfig } from '../../../config';
import EffectPreview from '../../../components/effect/EffectPreview';
import TheEffectsWheel from '../../../components/wheel/TheEffectsWheel';

interface Props {

}
const WheelFullPreview: NextPageWithLayout = ({ }: Props) => {
    const session = useSession()
    const router = useRouter()
    const gameId = router.query.gameId as string
    const wheelId = router.query.wheelId as string

    const { height } = useWindowSize()
    const [wheelContainerRef, { width, }] = useElementSize()
    const maxCardHeight = height - 56 - 8
    const maxCardWidth = width - 56 - 32

    const wheelItems = useGameEffectsWheelItems(gameId)
    const playerTasks = usePlayerTasks(gameId, session.data?.user.id)

    const [selectItemId, setSelectItemId] = useState<string>()
    const [fullSpins, setFullSpins] = useState<number>()
    const [spinDuration, setSpinDuration] = useState<number>()
    const [isPrespinning, setIsPrespinning, cancelSetIsPrespinning] = useDelayedState<boolean>(false)
    const [isSpinning, setIsSpinning, cancelSetIsSpinning] = useDelayedState<boolean>(false)

    const [spinPressed, setSpinPressed] = useState(false)

    const [error, setError] = useState<ApiError | undefined>(undefined)

    const [showResult, setShowResult, cancelSetShowResult] = useDelayedState<boolean>(false)
    const [extraSpin, setExtraspin] = useState<number>(0)
    const [result, setResult] = useState<GameEffectWithEffect>()


    function handleSpin() {
        if (!wheelItems.items || !playerTasks.tasks)
            return
        setIsPrespinning(true)
        setSpinPressed(true)
        setError(undefined)
        const activeWheelItemIds = wheelItems.items.filter(i => (playerTasks.tasks as GameTask[]).find(t => t.wheelItemId)).map(i => i.id)
        axios.post<GameSpinEffectResult>(`/api/games/${gameId}/effectswheel/spin`, {
            activeWheelItemIds,
        })
            .then(res => res.data)
            .then((result) => {
                setExtraspin(result.extraSpin)
                setSelectItemId(result.resultItemId)
                setFullSpins(effectsConfig.fullSpins)
                setSpinDuration(effectsConfig.spinDur)
                setIsPrespinning(true, 10)
                setIsSpinning(true, 20)
                wheelItems.items && setResult(wheelItems.items.find(x => x.id === result.resultItemId) as GameEffectWithEffect)
                setShowResult(true, effectsConfig.spinDur * 1000 + 20)
            },
                (err) => {
                    setIsPrespinning(false)
                    setSpinPressed(false)
                    setError(parseApiError(err))
                })
    }

    //#region 40x
    if (session.data && !session.data.user.isPlayer)
        return <NotAPlayerCard />
    //#endregion
    return <>
        <Head>
            <title>{'Колесо Эффектов'}</title>
        </Head>
        {
            (wheelItems.items) ?
                <Row className="mh-100 px-3 my-3">
                    <Col xl={7} lg={12} ref={wheelContainerRef} className="mh-100 " >
                        <TheEffectsWheel
                            // withTitle
                            noCard
                            items={wheelItems.items}
                            height={Math.min(maxCardHeight * 4.5 / 5, maxCardWidth) - 56}
                            spin={isSpinning}
                            prespin={isPrespinning}
                            spinDuration={spinDuration}
                            selectItemIndex={selectItemId ? wheelItems.items.indexOf(wheelItems.items.find(x => x.id == selectItemId) as GameEffectWithEffect) : undefined}
                            extraSpin={extraSpin}
                        />
                    </Col>
                    <Col xl={5} lg={12} className="mh-100 px-3 d-flex flex-column align-items-center justify-content-center" >
                        <Collapse in={!!error}>
                            {error ? <Alert className='mb-3' variant={'danger'}>
                                {error?.error}
                            </Alert> : <></>}
                        </Collapse>
                        {
                            !result && <Card bg='dark'>
                                <Card.Body>
                                    <Button disabled={spinPressed} variant='warning' onClick={handleSpin} className=''>Крутить Барабанище</Button>
                                </Card.Body>
                            </Card>
                        }
                        <Collapse in={showResult}>
                            <div className='mw-100 w-100 px-5'>
                                {result && showResult && <EffectPreview className='mw-100 mx-0 mb-3' effect={result.effect} />}
                                <div className='d-flex mw-100 px-5 flex-column align-items-center justify-content-center'>
                                    {result && <Card bg='dark'>
                                        <Card.Body>
                                            <Button variant='warning' onClick={() => router.push(`/games/${gameId}`)} className=''>Продолжить</Button>
                                        </Card.Body>
                                    </Card>}
                                </div>
                            </div>
                        </Collapse>
                    </Col>
                    <Col xl={12} xs={12} className='pt-3 p-0'>

                        {wheelItems.loading ? <LoadingDots /> :
                            wheelItems.items && <Row className='m-3'>
                                {wheelItems.items.map(item =>
                                    <Col xl={4} md={6} sm={12} className='pb-3 ' key={item.effect.id}>
                                        <EffectPreview effect={item.effect} />
                                    </Col>)}
                            </Row>
                        }
                    </Col>
                </Row>
                : <LoadingDots />
        }
    </>
}
WheelFullPreview.getLayout = GetGameLayout
export default WheelFullPreview
