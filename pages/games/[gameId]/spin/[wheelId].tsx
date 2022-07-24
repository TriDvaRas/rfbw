import { useSession } from 'next-auth/react';
import Head from "next/head";
import { useRouter } from 'next/router';
import { useRef, useState } from "react";
import { Alert, Col, Row, Card, Button } from 'react-bootstrap';
import { useElementSize, useWindowSize } from 'usehooks-ts';
import LoadingDots from "../../../../components/LoadingDots";
import { NotAPlayerCard } from "../../../../components/NotAPlayerCard";
import TheWheel from '../../../../components/wheel/TheWheel';
import WheelItems from "../../../../components/wheelItem/WheelItems";
import useWheel from "../../../../data/useWheel";
import useWheelItems from '../../../../data/useWheelItems';
import GetThinLayout from '../../../../layouts/thin';
import { NextPageWithLayout } from "../../../_app";
import GetGameLayout from '../../../../layouts/game';
import WheelPreview from '../../../../components/wheel/WheelPreview';
import axios from 'axios';
import usePlayerTasks from '../../../../data/usePlayerTasks';
import { GameTask, WheelItem } from '../../../../database/db';
import { GameSpinResult } from '../../../../types/game';
import WheelItemPreview from '../../../../components/wheelItem/WheelItemPreview';

interface Props {

}
const WheelFullPreview: NextPageWithLayout = ({ }: Props) => {
    const session = useSession()
    const router = useRouter()
    const gameId = router.query.gameId as string
    const wheelId = router.query.wheelId as string
    const wheel = useWheel(wheelId)
    const wheelItems = useWheelItems(wheelId)

    const playerTasks = usePlayerTasks(gameId, session.data?.user.id)

    const { height } = useWindowSize()
    const [wheelContainerRef, { width, }] = useElementSize()
    const maxCardHeight = height - 56 - 8
    const maxCardWidth = width - 56 - 32

    const audioRef = useRef<HTMLAudioElement>(null);

    const [selectItemId, setSelectItemId] = useState<string>()
    const [fullSpins, setFullSpins] = useState<number>()
    const [spinDuration, setSpinDuration] = useState<number>()
    const [isPrespinning, setIsPrespinning] = useState<boolean>(false)
    const [isSpinning, setIsSpinning] = useState<boolean>(false)
    const [showResult, setShowResult] = useState<boolean>(false)
    const [extraSpin, setExtraspin] = useState<number>(0)
    const [result, setResult] = useState<WheelItem>()

    function handleSpin() {
        if (!wheel.wheel || !wheelItems.wheelItems || !playerTasks.tasks)
            return
        setIsPrespinning(true)
        const activeWheelItemIds = wheelItems.wheelItems.filter(i => (playerTasks.tasks as GameTask[]).find(t => t.wheelItemId)).map(i => i.id)
        axios.post<GameSpinResult>(`/api/games/${gameId}/spin`, {
            wheelId: wheel.wheel.id,
            activeWheelItemIds,
        })
            .then(res => res.data)
            .then((result) => {
                console.log(result);

                setExtraspin(result.extraSpin)
                setSelectItemId(result.resultItemId)
                setFullSpins(wheel.wheel?.minimalSpin || 98)
                setSpinDuration(wheel.wheel?.spinDuration || 60)
                setIsPrespinning(false)
                setIsSpinning(true)
                setTimeout(() => {
                    wheelItems.wheelItems &&
                        setResult(wheelItems.wheelItems.find(x => x.id === result.resultItemId) as WheelItem)
                    setShowResult(true)
                }, (wheel.wheel?.spinDuration || 60) * 1000 + 250)
            },
                (err) => {
                    setIsPrespinning(false)
                })
    }

    //#region 40x
    if (wheel.error?.status == 404 || wheelItems.error?.status == 404) {
        router.push(`/404`)
        return <></>
    }
    if (wheel.error?.status == 403 || wheelItems.error?.status == 403) {
        router.push(`/403`)
        return <></>
    }
    if (session.data && !session.data.user.isPlayer)
        return <NotAPlayerCard />
    if (wheel.loading || wheelItems.loading)
        return <LoadingDots />
    if (wheel.error) {
        return wheel.error.status == 433 ? <NotAPlayerCard /> : <Alert className='mb-0' variant={'danger'}>
            {wheel.error.error}
        </Alert>
    }
    if (wheelItems.error) {
        return wheelItems.error.status == 433 ? <NotAPlayerCard /> : <Alert className='mb-0' variant={'danger'}>
            {wheelItems.error.error}
        </Alert>
    }
    //#endregion

    return <>
        <Head>
            <title>{wheel.wheel?.title || 'Колесо'}</title>
        </Head>
        {
            (wheelItems.wheelItems && wheel.wheel) ?
                <Row className="mh-100 px-3 my-3">
                    {/* <Col x  l={12}><WheelPreview wheel={wheel.wheel} /></Col> */}
                    <Col xl={7} lg={12} ref={wheelContainerRef} className="mh-100 " >
                        <TheWheel
                            // withTitle
                            noCard
                            items={wheelItems.wheelItems}
                            height={Math.min(maxCardHeight * 4.5 / 5, maxCardWidth) - 56}
                            wheel={wheel.wheel}
                            spin={isSpinning}
                            prespin={isPrespinning}
                            spinDuration={spinDuration}
                            selectItemIndex={selectItemId ? (wheelItems.wheelItems.find(x => x.id == selectItemId) as WheelItem).position : undefined}
                            extraSpin={extraSpin}
                        />
                    </Col>
                    <Col xl={5} lg={12} className="mh-100 px-3 d-flex flex-column align-items-center justify-content-center" >
                        <WheelPreview wheel={wheel.wheel} withAuthor gameId={gameId} />
                        <Card bg='dark'>
                            <Card.Body>
                                <Button variant='secondary' onClick={() => router.push(`/games/${gameId}/spin`)} className=''>Сменить колесо</Button>
                                <Button disabled variant='secondary' onClick={() => { }} className='ms-3'>Использовать карточку</Button>
                                <Button variant='warning' onClick={handleSpin} className='ms-3'>Крутить Барабан</Button>
                            </Card.Body>
                        </Card>
                        {result && <WheelItemPreview item={result} />}
                    </Col>
                    <Col xl={12} xs={12} className=' p-0'>
                        {wheelItems.loading ? <LoadingDots /> :
                            wheelItems.wheelItems && <WheelItems
                                fluid
                                wheel={wheel.wheel}
                                items={wheelItems.wheelItems}
                            />
                        }
                    </Col>
                </Row>
                : <LoadingDots />
        }
    </>
}
WheelFullPreview.getLayout = GetGameLayout
export default WheelFullPreview
