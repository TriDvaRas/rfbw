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
import WheelPreview from '../../components/wheel/WheelPreview';

interface Props {

}
const WheelFullPreview: NextPageWithLayout = ({ }: Props) => {
    const session = useSession()
    const router = useRouter()
    const wheelId = router.query.wheelId as string
    const wheel = useWheel(wheelId)
    const wheelItems = useWheelItems(wheelId)

    const { height } = useWindowSize()
    const [wheelContainerRef, { width, }] = useElementSize()
    const maxCardHeight = height - 56 - 8
    const maxCardWidth = width - 56 - 32

    const audioRef = useRef<HTMLAudioElement>(null);

    //#region 40x
    if (wheel.error?.status == 404 || wheelItems.error?.status == 404) {
        router.push(`/404`)
        return <></>
    }
    if (wheel.error?.status == 403 || wheelItems.error?.status == 403) {
        router.push(`/403`)
        return <></>
    }

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
                <Row className="mh-100 p-0">
                    {/* <Col xl={12}><WheelPreview wheel={wheel.wheel} /></Col> */}
                    <Col xl={12} ref={wheelContainerRef} lg={12} className="mh-100 p-0" >
                        <TheWheel
                            withTitle
                            items={wheelItems.wheelItems}
                            idleSpin={true}
                            height={Math.min(maxCardHeight * 4.5 / 5, maxCardWidth) - 56}
                            wheel={wheel.wheel}
                        />
                    </Col>
                    <Col xl={12} xs={12} className='my-3 p-0'>
                        {wheelItems.loading ? <LoadingDots /> :
                            wheelItems.wheelItems && <WheelItems
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
WheelFullPreview.getLayout = GetThinLayout
export default WheelFullPreview
