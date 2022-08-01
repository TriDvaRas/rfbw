import { useSession } from 'next-auth/react';
import Head from "next/head";
import { useRouter } from 'next/router';
import { Alert, Col, Collapse, Row } from 'react-bootstrap';
import GamePreview from "../../../../components/game/GamePreview";
import LoadingDots from "../../../../components/LoadingDots";
import { NotAPlayerCard } from "../../../../components/NotAPlayerCard";
import useGame from '../../../../data/useGame';
import GetGameLayout from "../../../../layouts/game";
import { NextPageWithLayout } from "../../../_app";
import PHCard from '../../../../util/PHCard';
import useGameWheels from '../../../../data/useGameWheels';
import GameWheelPreview from '../../../../components/wheel/GameWheelPreview';
import GetThinLayout from '../../../../layouts/thin';
import usePlayerEffectStates from '../../../../data/usePlayerEffects';
import { filterWheelsWithEffects, filterGameWheelsWithEffects } from '../../../../util/game/wheelFilters';

const GameHome: NextPageWithLayout = () => {
    const session = useSession()
    const router = useRouter()
    const gameId = router.query.gameId as string
    const game = useGame(gameId)
    const gameWheels = useGameWheels(gameId)
    const playerEffects = usePlayerEffectStates(gameId, session.data?.user.id)

    const allowedWheels = gameWheels.wheels && playerEffects.states ? filterGameWheelsWithEffects(gameWheels.wheels, playerEffects.states) : undefined

    if (game.error) {
        return game.error.status == 433 ? <NotAPlayerCard /> :
            <Alert className='mb-0' variant={'danger'}>
                {game.error.error}
            </Alert>
    }
    return <>
        <Head>
            <title>{game.game?.name || 'Игра'}</title>
        </Head>
        <h1 className='text-center mt-3'>Выбери Колесо</h1>
        {
            session.status == 'loading' || game.loading || gameWheels.loading ?
                <LoadingDots /> :
                <Row xl={1}>
                    {allowedWheels?.map(gw => <Col key={gw.wheelId}>
                        <GameWheelPreview withAuthor gameWheel={gw} onClick={() => router.push(`/games/${gameId}/spin/${gw.wheelId}`)} />
                    </Col>)}
                </Row>
        }
    </>
}
GameHome.getLayout = GetThinLayout
export default GameHome
