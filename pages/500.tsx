import type { NextPage } from 'next'
import { useSession, signIn, signOut } from "next-auth/react"
import { NextPageWithLayout } from './_app';
import getDefaultLayout from '../layouts/default';
import Error from 'next/error';

const Error500: NextPageWithLayout = ({ errorCode }: any) => {
  return (
    <div className='error-container'>
      <Error statusCode={errorCode} title='Ты все сломал. Молодец' />
    </div>
  )
}
Error500.getLayout = getDefaultLayout
export default Error500
