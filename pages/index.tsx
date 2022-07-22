import Image from 'next/image';
import { useWindowSize } from 'usehooks-ts';
import GetDefaultLayout from '../layouts/default';
import light from '../public/light.webp';
import pes from '../public/pes.jpg';
import you from '../public/you.png';
import kuppn from '../public/kuppn.png';
import window from '../public/window.png';
import { NextPageWithLayout } from './_app';

const Home: NextPageWithLayout = () => {
  const { height, width } = useWindowSize()
  const h = 2 * (height - 70) / 2
  return <div>
    <Image src={light} alt='light' height={h} width={width} />
    <Image src={pes} alt='light' height={h} width={width} />
    <Image src={you} alt='light' height={h} width={width} />
    <Image src={kuppn} alt='light' height={h} width={width} />
    <Image src={window} alt='light' height={h} width={width} />
  </div>
}
Home.getLayout = GetDefaultLayout
export default Home
