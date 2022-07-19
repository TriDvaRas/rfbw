import axios, { AxiosError } from "axios";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from "react";
import { Alert, Col, Row } from 'react-bootstrap';
import { useElementSize, useWindowSize } from 'usehooks-ts';
import LoadingDots from "../../components/LoadingDots";
import { NotAPlayerCard } from "../../components/NotAPlayerCard";
import TheWheel from '../../components/wheel/TheWheel';
import TheWheelSettings from "../../components/wheel/TheWheelSettings";
import WheelItemEditModal from "../../components/wheelItem/TheWheelItemEditModal";
import WheelItems from "../../components/wheelItem/WheelItems";
import useWheel from "../../data/useWheel";
import useWheelItems from '../../data/useWheelItems';
import { Wheel, WheelItem } from '../../database/db';
import GetThinLayout from '../../layouts/thin';
import { ApiError } from "../../types/common-api";
import { NextPageWithLayout } from "../_app";
import useDelayedState from 'use-delayed-state'
import { randomInt } from '../../util/random';
import ReactAudioPlayer from "react-audio-player";
import Head from "next/head";

interface Props {

}
const WheelEditor: NextPageWithLayout = ({ }: Props) => {
    const session = useSession()
    const router = useRouter()
    const wheelId = router.query.id as string
    const wheel = useWheel(wheelId)
    const wheelItems = useWheelItems(wheelId)
    const [selectedItem, setSelectedItem] = useState<WheelItem | undefined>()

    const { height } = useWindowSize()
    const [wheelContainerRef, { width, }] = useElementSize()
    const maxCardHeight = height - 56 - 8
    const maxCardWidth = width - 56 - 32

    const audioRef = useRef<HTMLAudioElement>(null);

    const [newItemLoading, setNewItemLoading] = useState(false)

    const [isIdleSpinning, setIsIdleSpinning, cancelSetIsIdleSpinning] = useDelayedState(true)
    const [isSpinning, setIsSpinning, cancelSetIsSpinning] = useDelayedState(false)
    const [isPrespinning, setIsPrespinning, cancelSetIsPrespinning] = useDelayedState(false)
    const [spinDuration, setSpinDuration] = useState(60)

    const [spinSelectIndex, setSpinSelectIndex, cancelSetSpinSelectIndex] = useDelayedState(0)
    const [spinExtraSpin, setSpinExtraSpin, cancelSetSpinExtraSpin] = useDelayedState(0)

    const [localWheel, setLocalWheel] = useState<Wheel | undefined>()
    const [localWheelItems, setLocalWheelItems] = useState<WheelItem[] | undefined>()
    useEffect(() => {
        if (wheel.wheel && !localWheel)
            setLocalWheel(wheel.wheel)
    }, [localWheel, wheel.wheel])
    useEffect(() => {
        if (wheelItems.wheelItems && !localWheelItems)
            setLocalWheelItems(wheelItems.wheelItems)
    }, [localWheelItems, wheelItems.wheelItems])

    const [isAudioPlaying, setIsAudioPlaying, cancelSetIsAudioPlaying] = useDelayedState(false)
    useEffect(() => {
        const ae = (audioRef.current as any)?.audioEl.current as HTMLAudioElement
        if (ae)
            if (isAudioPlaying) {
                ae.play()
            }
            else {
                ae.pause()
                ae.currentTime = 0
            }
    }, [isAudioPlaying])

    function onItemAdd() {
        setNewItemLoading(true)
        axios.post<WheelItem>(`/api/wheels/${wheel.wheel?.id}/items`)
            .then((data) => {
                setNewItemLoading(false)
                wheelItems.mutate([...(wheelItems.wheelItems || []), data.data])
                setLocalWheelItems([...(wheelItems.wheelItems || []), data.data])
            }).catch((err: AxiosError<ApiError>) => {
                setNewItemLoading(false)
            })
    }

    function onItemClick(item: WheelItem) {
        setSelectedItem(item)
    }
    //#region 40x
    if (wheel.error?.status == 404 || wheelItems.error?.status == 404) {
        router.replace(`/404`)
        return <></>
    }
    if (wheel.error?.status == 403 || wheelItems.error?.status == 403) {
        router.replace(`/403`)
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
            <title>Редактор</title>
        </Head>
        {
            (wheelItems.wheelItems && localWheel) ?
                <Row className="mh-100 p-0">
                    <Col xl={8} ref={wheelContainerRef} lg={12} className="mh-100 p-0" >
                        <TheWheel
                            withTitle
                            items={wheelItems.wheelItems}
                            idleSpin={isIdleSpinning}
                            height={Math.min(maxCardHeight * 4 / 5, maxCardWidth) - 56}
                            wheel={localWheel}
                            onItemClick={onItemClick}
                            spin={isSpinning}
                            prespin={isPrespinning}
                            spinDuration={spinDuration}
                            selectItemIndex={spinSelectIndex}
                            extraSpin={spinExtraSpin}
                        />
                    </Col>
                    <Col xl={4} lg={12} className='mh-100 mb-3 pb-3 p-0'>
                        <TheWheelSettings
                            wheel={localWheel}
                            onUpdate={(upd) => setLocalWheel({ ...localWheel, ...upd } as Wheel)}
                            maxHeight={Math.min(maxCardHeight * 4 / 5, maxCardWidth)}
                            doTestSpin={(stop) => {
                                if (!stop) {
                                    setSpinDuration(localWheel.spinDuration)
                                    cancelSetIsIdleSpinning()
                                    setIsIdleSpinning(false)

                                    setIsPrespinning(true, 10)

                                    setIsSpinning(true, localWheel.prespinDuration * 1000 + 20)
                                    setSpinSelectIndex(randomInt(0, localWheelItems?.length || 5), localWheel.prespinDuration * 1000 + 20)
                                    // setSpinSelectIndex(1)
                                    setSpinExtraSpin(Math.random() * .995 - .5, localWheel.prespinDuration * 1000 + 20)

                                    setIsAudioPlaying(true, (localWheel.spinDuration + localWheel.prespinDuration) * 1000)
                                }
                                else {
                                    cancelSetIsSpinning()
                                    cancelSetIsAudioPlaying()
                                    cancelSetSpinSelectIndex()
                                    cancelSetIsPrespinning()
                                    cancelSetSpinExtraSpin()
                                    setIsPrespinning(false, 10)
                                    setIsSpinning(false, 20)
                                    setIsIdleSpinning(true, 800)
                                    setIsAudioPlaying(false)
                                }
                            }}
                            onReset={() => {
                                setLocalWheel(wheel.wheel)
                            }}
                            onSave={() => {
                                return axios.patch(`/api/wheels/${localWheel.id}`, localWheel)
                                    .then(x => x.data)
                                    .then((_wheel: Wheel) => {
                                        wheel.mutate(_wheel)
                                    })
                            }}
                        />
                        {
                            spinSelectIndex && localWheelItems && localWheelItems[spinSelectIndex] && localWheelItems[spinSelectIndex].audioId && <ReactAudioPlayer
                                ref={audioRef as any}
                                src={`/api/audios/${localWheelItems[spinSelectIndex].audioId}`}
                                volume={0.06}
                                // controls
                                preload='auto'
                                onEnded={() => {

                                }}
                            />
                        }
                    </Col>
                    <Col xl={12} xs={12} className='my-3 p-0'>
                        {wheelItems.loading ? <LoadingDots /> :
                            wheelItems.wheelItems && localWheelItems && <WheelItems
                                wheel={localWheel}
                                items={localWheelItems}
                                onSelectEdit={setSelectedItem}
                                onAddNew={onItemAdd}
                                newLoading={newItemLoading}
                            />
                        }
                    </Col>
                    {selectedItem && localWheelItems &&
                        <WheelItemEditModal
                            show={!!selectedItem}
                            wheel={localWheel}
                            wheelItems={localWheelItems}
                            selectedItem={selectedItem}
                            onCancel={() => {
                                setSelectedItem(undefined);
                                setLocalWheelItems(wheelItems.wheelItems)
                            }}
                            onSave={async () => {
                                const x = await axios.patch(`/api/wheels/${localWheel.id}/items/${selectedItem.id}`, selectedItem);
                                const item = x.data;
                                wheelItems.mutate(localWheelItems.map(x_1 => x_1.id === item.id ? item : x_1));
                                setSelectedItem(undefined)
                            }}
                            onUpdate={(upd) => {
                                let item = { ...selectedItem, ...upd } as WheelItem
                                setSelectedItem(item)
                                setLocalWheelItems(localWheelItems.map(x => x.id === item.id ? item : x))
                            }} />}
                </Row>
                : <LoadingDots />
        }
    </>
}
WheelEditor.getLayout = GetThinLayout
export default WheelEditor
