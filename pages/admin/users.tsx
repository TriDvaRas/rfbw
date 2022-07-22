import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Row, Col } from 'react-bootstrap';
import { useWindowSize } from 'usehooks-ts';
import AdminNavCard from '../../components/admin/AdminNavCard';
import AdminUsers from '../../components/admin/AdminUsers';
import GetDefaultLayout from '../../layouts/default';
import light from '../public/light.webp';
import { NextPageWithLayout } from '../_app';

const Home: NextPageWithLayout = () => {
  const { height, width } = useWindowSize()
  const maxCardHeight = height - 56 - 32
  const session = useSession()
  const router = useRouter()
  if (session.status == 'unauthenticated' || (session.status == 'authenticated' && !session.data.user.isAdmin))
    router.push(`/404`)

  return <Row className=" pr-3">
    <Col md={12} lg={2} className="h-100 " style={width < 768 ? {} : { height: maxCardHeight }}>
      <AdminNavCard cardHeight={maxCardHeight} />
    </Col>
    <Col md={12} lg={10} className="h-100 pe-4" style={width < 768 ? {} : { height: maxCardHeight }}>
      <AdminUsers cardHeight={maxCardHeight} />
    </Col>
  </Row >
}
Home.getLayout = GetDefaultLayout
export default Home
