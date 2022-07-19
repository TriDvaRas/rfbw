import _ from "lodash";
import { BuiltInProviderType } from "next-auth/providers";
import { ClientSafeProvider, LiteralUnion, useSession } from 'next-auth/react';
import Head from "next/head";
import { useRouter } from 'next/router';
import { useState } from "react";
import { Alert, Card, Col, Row } from 'react-bootstrap';
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
    const router = useRouter()
    const wheels = useEditableWheels()
    const player = usePlayer()
    const [showNewWheelModal, setShowNewWheelModal] = useState(false)
    const [isNewWheelSaving, setIsNewWheelSaving] = useState(false)

    if (wheels.error) {
        return wheels.error.status == 433 ? <NotAPlayerCard /> :
            <Alert className='mb-0' variant={'danger'}>
                {wheels.error.error}
            </Alert>
    }
    if (player.error) {
        return <Alert className='mb-0' variant={'danger'}>
            {player.error.error}
        </Alert>
    }
    return <>
        <Head>
            <title>Редактор</title>
        </Head>
        {
            session.status == 'loading' || wheels.loading || player.loading ?
                <LoadingDots /> :
                <Row xs={1} md={1} lg={1} xl={1} className='mx-3 py-2'>
                    {wheels.wheels && _.sortBy(wheels.wheels, [(w) => w.ownedById !== player.player?.id, (w) => w.updatedAt,]).map(wheel =>
                        <Col key={wheel.id} className='mh-100 my-1 d-flex justify-content-center align-items-center'>
                            <WheelPreview
                                admin={wheel.ownedById !== player.player?.id}
                                withAuthor={wheel.ownedById !== player.player?.id}
                                wheel={wheel}
                                onClick={() => router.push(`/wheeleditor/${wheel.id}`)} />
                        </Col>
                    )}
                    {(player.player?.maxWheels || 0) > (wheels.wheels?.filter(x => x.ownedById === player.player?.id).length || 0) &&
                        <Col className='my-3 mx-auto' style={{ width: wheels.wheels?.length == 0 ? '20em' : undefined }}>
                            <NewWheelButton onClick={() => setShowNewWheelModal(true)} text='Создать колесо' />
                        </Col>}
                    <NewWheelModal
                        show={showNewWheelModal}
                        isSaving={isNewWheelSaving}
                        setIsSaving={setIsNewWheelSaving}
                        onCancel={() => setShowNewWheelModal(false)}
                        onSaved={(_wheel) => {
                            if (wheels.wheels)
                                wheels.mutate([...wheels.wheels.filter(x => x.id !== _wheel.id), _wheel], { optimisticData: [...wheels.wheels.filter(x => x.id !== _wheel.id), _wheel] })
                            setShowNewWheelModal(false)
                        }}
                    />
                </Row>
        }
    </>



}
WheelEditorList.getLayout = GetThinLayout
export default WheelEditorList
