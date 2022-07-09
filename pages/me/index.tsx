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
import { useSession } from 'next-auth/react';

const Home: NextPageWithLayout = () => {
  const { height, width } = useWindowSize()
  const player = usePlayer()
  const [isSaving, setIsSaving] = useState(false)
  const session = useSession()
  const [displayName, setDisplayName] = useState<string | undefined>()
  const [about, setAbout] = useState<string | undefined>()
  const [imageId, setImageId] = useState<string | undefined>()


  return <Container fluid>
    {
      session.data ?
        session.data.user.isPlayer ? <Row className="">
          <Col md={3} xs={12} className=" " >
            {
              player.player ?
                <PlayerAboutCard name={displayName || player.player.name} about={about || player.player.about} imageId={imageId || player.player.imageId} /> :
                <LoadingDots />
            }
          </Col>
          <Col md={6} xs={12} className='px-0'>
            {
              player.player ?
                <PlayerAboutCardEdit onChange={(about, displayName, imageId) => {
                  setDisplayName(displayName)
                  setAbout(about)
                  setImageId(imageId)
                }}
                  player={player.player}
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
        : <LoadingDots  variant='primary' />
    }
  </Container>
}
Home.getLayout = GetDefaultLayout
export default Home
