import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Col, Row } from 'react-bootstrap';
import { useWindowSize } from 'usehooks-ts';
import AdminGames from '../../components/admin/AdminGames';
import AdminNavCard from '../../components/admin/AdminNavCard';
import GetDefaultLayout from '../../layouts/default';
import { NextPageWithLayout } from '../_app';

const AdminGamesPage: NextPageWithLayout = () => {
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
      <AdminGames cardHeight={maxCardHeight} />
    </Col>
  </Row >
}
AdminGamesPage.getLayout = GetDefaultLayout
export default AdminGamesPage
