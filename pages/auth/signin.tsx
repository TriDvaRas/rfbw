import { BuiltInProviderType } from "next-auth/providers"
import { ClientSafeProvider, getProviders, LiteralUnion, signIn, useSession } from 'next-auth/react';
import { Button, Card } from 'react-bootstrap';
import GetDefaultLayout from "../../layouts/default";
import { NextPageWithLayout } from "../_app";
import { useRouter } from 'next/router';
import LoadingDots from "../../components/LoadingDots";

interface Props {
    providers: Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider>
}
const SignIn: NextPageWithLayout = ({ providers }: Props) => {
    const session = useSession()
    const router = useRouter()
    const callbackUrl = router.query.callbackUrl
    if (session.status == 'authenticated')
        router.push((callbackUrl as string) || '/')

    return (session.status == 'loading' ?
        <LoadingDots /> :
        session.status == 'authenticated' ?
            <></> :
            <Card bg='dark' text='light' className='my-5' style={{ width: '28rem', margin: 'auto' }}>
                <Card.Body>
                    <Card.Title className='fs-1 mb-3'>Пожалуйста спасибо</Card.Title>
                    {Object.values(providers).map((provider) => (
                        <div key={provider.name}>
                            <Button variant="info" className="w-100" onClick={() => signIn(provider.id)}>
                                Sign in with {provider.name}
                            </Button>
                        </div>
                    ))}
                </Card.Body>

            </Card>
    )
}
SignIn.getLayout = GetDefaultLayout
export async function getServerSideProps() {
    const providers = await getProviders()
    return {
        props: { providers },
    }
}
export default SignIn
