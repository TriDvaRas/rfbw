import type { NextPage } from 'next'
import { useSession, signIn, signOut } from "next-auth/react"
import { NextPageWithLayout } from './_app';
import getDefaultLayout from '../layouts/default';
import Error from 'next/error';

const Error500: NextPageWithLayout = ({ errorCode }: any) => {
  return (
    <>
      <Error statusCode={errorCode} title='Ты все сломал. Молодец' />
    </>
  )
}
Error500.getLayout = getDefaultLayout
export default Error500
