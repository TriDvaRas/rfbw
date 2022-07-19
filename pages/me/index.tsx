import { NotAPlayerCard } from '../../components/NotAPlayerCard'
import Image from 'next/image';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useWindowSize } from 'usehooks-ts';
import LoadingDots from '../../components/LoadingDots';
import GetDefaultLayout from '../../layouts/default';
import light from '../public/light.webp';
import { NextPageWithLayout } from '../_app';
import usePlayer from '../../data/usePlayer';
import PlayerAboutCard from '../../components/player/PlayerAboutCard';
import PlayerAboutCardEdit from '../../components/player/PlayerAboutCardEdit';
import { useState, useEffect } from 'react';
import MeNavCard from '../../components/me/MeNavCard';
import { signIn, useSession } from 'next-auth/react';
import { Player } from '../../database/db';
import Head from 'next/head';

const Home: NextPageWithLayout = () => {
  const { height, width } = useWindowSize()
  const player = usePlayer()
  const session = useSession()

  const [localPlayer, setLocalPlayer] = useState<Player | undefined>()
  useEffect(() => {
    if (player.player && !localPlayer)
      setLocalPlayer(player.player)
  }, [localPlayer, player.player])

  if (session.status == 'unauthenticated')
    signIn()

  return <Container fluid>
    <Head>
      <title>Literally Me</title>
    </Head>
    {
      session.data ?
        session.data.user.isPlayer ? <Row className="">
          <Col md={3} xs={12} className=" " >
            {
              localPlayer ?
                <PlayerAboutCard name={localPlayer.name} about={localPlayer.about} imageId={localPlayer.imageId} /> :
                <LoadingDots />
            }
          </Col>
          <Col md={6} xs={12} className='px-0'>
            {
              localPlayer ?
                <PlayerAboutCardEdit onChange={(upd) => {
                  setLocalPlayer({ ...localPlayer, ...upd } as Player)
                }}
                  onCancel={() => {
                    setLocalPlayer(player.player)
                  }}
                  player={localPlayer}
                  onSaved={() => { }}
                /> :
                <LoadingDots />
            }
          </Col>
          <Col md={3} xs={12}>
            <MeNavCard cardHeight={height - 56 - 32} />
          </Col>
        </Row> : <Container>
          <NotAPlayerCard />
          <Card bg='dark' text='light' className='my-3' style={{ width: '18rem', margin: 'auto' }}>
            <Card.Body>
              <Button variant='secondary' className='w-100'>ВЫЙТИ</Button>
            </Card.Body>
          </Card>
        </Container>
        : <LoadingDots variant='primary' />
    }
  </Container>
}
Home.getLayout = GetDefaultLayout
export default Home
