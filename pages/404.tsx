import type { NextPage } from 'next'
import { useSession, signIn, signOut } from "next-auth/react"
import { NextPageWithLayout } from './_app';
import GetDefaultLayout from '../layouts/default';
import Error from 'next/error';
import Head from 'next/head';

const Error404: NextPageWithLayout = () => {
  return (
    <div className='error-container'>
      <Error statusCode={404} title='Что ты тут забыл? Тут ничего нет. Правда' />
      <Head>
        <title>Где?</title>
      </Head>
    </div>
  )
}
Error404.getLayout = GetDefaultLayout
export default Error404
