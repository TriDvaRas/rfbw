import Image from 'next/image';
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
  return <Row className=" pr-3">
    <Col xs={2} className="h-100 " style={{ height: maxCardHeight }}>
      <AdminNavCard cardHeight={maxCardHeight} />
    </Col>
    <Col xs={10} className="h-100 pe-4" style={{ height: maxCardHeight }}>
      <AdminUsers cardHeight={maxCardHeight} />
    </Col>
  </Row >
}
Home.getLayout = GetDefaultLayout
export default Home
