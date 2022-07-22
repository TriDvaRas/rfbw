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
import usePlayer from '../../data/usePlayer';
import GetThinLayout from "../../layouts/thin";
import { NextPageWithLayout } from "../_app";
import useGame from '../../data/useGame';
import useGames from '../../data/useGames';
import NewButton from "../../components/NewButton";
import NewGameModal from "../../components/game/NewGameModal";
import GamePreview from "../../components/game/GamePreview";

const GamesHome: NextPageWithLayout = () => {
    const session = useSession()
    const router = useRouter()
    const games = useGames()
    const [showNewGameButton, setShowNewGameButton] = useState(false)
    const [isNewGameSaving, setIsNewGameSaving] = useState(false)
    const { width, height } = useWindowSize()
    if (games.error) {
        return games.error.status == 433 ? <NotAPlayerCard /> :
            <Alert className='mb-0' variant={'danger'}>
                {games.error.error}
            </Alert>
    }
    return <>
        <Head>
            <title>Игры</title>
        </Head>
        {
            session.status == 'loading' || games.loading ?
                <LoadingDots /> :
                <Row xs={1} md={1} lg={1} xl={1} className='mx-3 py-2'>
                    {games.games && _.sortBy(games.games, [(g) => g.updatedAt]).map(game =>
                        <Col key={game.id} className='mh-100 my-1 d-flex justify-content-center align-items-center'>
                            <GamePreview game={game} onClick={() => router.push(`/games/${game.id}`)} />
                        </Col>
                    )}
                    {session.data?.user.isAdmin && <NewButton
                        onClick={() => setShowNewGameButton(true)}
                    />}
                    {session.data?.user.isAdmin && <NewGameModal
                        show={showNewGameButton}
                        isSaving={isNewGameSaving}
                        setIsSaving={setIsNewGameSaving}
                        onSaved={(game) => {
                            games.mutate([...(games.games || []), game])
                            setShowNewGameButton(false)
                        }}
                        onCancel={() => setShowNewGameButton(false)}
                    />}
                </Row>
        }
    </>
}
GamesHome.getLayout = GetThinLayout
export default GamesHome
