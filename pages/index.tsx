import Image from 'next/image';
import { useWindowSize } from 'usehooks-ts';
import GetDefaultLayout from '../layouts/default';
import light from '../public/light.webp';
import { NextPageWithLayout } from './_app';

const Home: NextPageWithLayout = () => {
  const { height, width } = useWindowSize()

  return <Image src={light} alt='light' height={height - 64} width={width} />
}
Home.getLayout = GetDefaultLayout
export default Home
