import { useSession } from 'next-auth/react';
import Head from "next/head";
import { useRouter } from 'next/router';
import { Alert, Col, Collapse, Row } from 'react-bootstrap';
import GamePreview from "../../../components/game/GamePreview";
import LoadingDots from "../../../components/LoadingDots";
import { NotAPlayerCard } from "../../../components/NotAPlayerCard";
import useGame from '../../../data/useGame';
import GetGameLayout from "../../../layouts/game";
import { NextPageWithLayout } from "../../_app";
import PHCard from '../../../util/PHCard';
import GetThinLayout from '../../../layouts/thin';

const GameHome: NextPageWithLayout = () => {
    const session = useSession()
    const router = useRouter()
    const gameId = router.query.gameId as string
    const game = useGame(gameId)
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
        {
            session.status == 'loading' || game.loading ?
                <LoadingDots /> :
                <Row >
                    <Col xl={12} >
                        {game.game && <GamePreview game={game.game} />}
                    </Col>
                    <Col xl={5} className='mb-3'>
                        <PHCard height={300} />
                    </Col>
                    <Col xl={7} className='mb-3'>
                        <PHCard height={300} />
                    </Col>
                    <Collapse in={true}>
                        <Col xl={12} className='mb-3'>
                            <PHCard height={150} />
                        </Col>
                    </Collapse>
                    <Col xl={9} className='mb-3'>
                        <PHCard height={1300} />
                    </Col>
                    <Col xl={3} className='mb-3'>
                        <PHCard height={1300} />
                    </Col>
                </Row>
        }
    </>
}
GameHome.getLayout = GetThinLayout
export default GameHome
