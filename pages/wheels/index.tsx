import _ from "lodash";
import { BuiltInProviderType } from "next-auth/providers";
import { ClientSafeProvider, LiteralUnion, useSession } from 'next-auth/react';
import Head from "next/head";
import { useRouter } from 'next/router';
import { useState } from "react";
import { Alert, Card, Col, Row } from 'react-bootstrap';
import { useWindowSize } from "usehooks-ts";
import LoadingDots from "../../components/LoadingDots";
import NewWheelButton from '../../components/NewButton';
import { NotAPlayerCard } from "../../components/NotAPlayerCard";
import NewWheelModal from "../../components/wheel/NewWheelModal";
import WheelPreview from "../../components/wheel/WheelPreview";
import useEditableWheels from '../../data/useEditableWheels';
import usePlayer from '../../data/usePlayer';
import GetThinLayout from "../../layouts/thin";
import { NextPageWithLayout } from "../_app";

const WheelEditorList: NextPageWithLayout = () => {
    const session = useSession()
    const wheels = useEditableWheels()
    const { width, height } = useWindowSize()
    if (wheels.error) {
        return wheels.error.status == 433 ? <NotAPlayerCard /> :
            <Alert className='mb-0' variant={'danger'}>
                {wheels.error.error}
            </Alert>
    }

    return <>
        <Head>
            <title>Колеса</title>
        </Head>
        {
            session.status == 'loading' || wheels.loading ?
                <LoadingDots /> :
                <Row xs={1} md={1} lg={1} xl={1} className='mx-3 py-2'>
                    {wheels.wheels && _.sortBy(wheels.wheels, [(w) => w.createdAt]).map(wheel =>
                        <Col key={wheel.id} className='mh-100 my-1 d-flex justify-content-center align-items-center'>
                            <WheelPreview
                                withAuthor={true}
                                wheel={wheel}
                                height={Math.min(width - 192, height) - 192}
                            />
                        </Col>
                    )}
                </Row>
        }
    </>
}
WheelEditorList.getLayout = GetThinLayout
export default WheelEditorList
