import type { NextPage } from 'next'
import { useSession, signIn, signOut } from "next-auth/react"
import { NextPageWithLayout } from './_app';
import GetDefaultLayout from '../layouts/default';
import Error from 'next/error';

const Error404: NextPageWithLayout = () => {
  return (
    <div className='error-container'>
      <Error  statusCode={403} title='Иди нахуй. Спасибо' />
    </div>
  )
}
Error404.getLayout = GetDefaultLayout
export default Error404
