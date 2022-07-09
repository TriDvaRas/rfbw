import type { NextPage } from 'next'
import { useSession, signIn, signOut } from "next-auth/react"
import { NextPageWithLayout } from './_app';
import getDefaultLayout from '../layouts/default';
import Error from 'next/error';

const Error404: NextPageWithLayout = () => {
  return (
    <div className='h-75'>
      <Error statusCode={404} title='Что ты тут забыл? Тут ничего нет. Правда' />
    </div>
  )
}
Error404.getLayout = getDefaultLayout
export default Error404
