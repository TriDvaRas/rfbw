import Image from 'next/image';
import { Row, Col } from 'react-bootstrap';
import { useWindowSize } from 'usehooks-ts';
import AdminNavCard from '../../components/admin/AdminNavCard';
import GetDefaultLayout from '../../layouts/default';
import light from '../public/light.webp';
import { NextPageWithLayout } from '../_app';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

const Home: NextPageWithLayout = () => {
  const { height, width } = useWindowSize()
  const maxCardHeight = height - 56 - 32
  const session = useSession()
  const router = useRouter()
  if (session.status == 'unauthenticated' || (session.status == 'authenticated' && !session.data.user.isAdmin)) 
    router.push(`/404`)

  return <Row className=" pr-3">
    <Col xs={2} className="h-100 " style={{ height: maxCardHeight }}>
      <AdminNavCard cardHeight={maxCardHeight} />
    </Col>

  </Row >
}
Home.getLayout = GetDefaultLayout
export default Home
