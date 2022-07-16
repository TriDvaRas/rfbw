import React, { Ref } from 'react';
import {
    Col,
    Image, Nav, Navbar, Row
} from 'react-bootstrap';
import LoadingDots from './LoadingDots';
import Link from 'next/link'
import { useRouter } from 'next/router';
import { useSession, signIn, signOut } from "next-auth/react"
import { Button } from 'react-bootstrap';
interface Props {
}
const Bar = ({ }: Props) => {
    const { data: session, status: sessionStatus } = useSession()
    const router = useRouter()

    return (
        <div id='navbar'>
            <Navbar bg="dark-700" variant="dark" >
                <div onClick={() => router.replace(`/`)}>
                    <h3 className='mb-0 mx-3'>RFBW<span className='egg-text'></span></h3>
                </div>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav
                        className="fix-font-weight"
                        activeKey={router.asPath}
                        onSelect={(selectedKey) => router.replace(selectedKey as string)}
                    >
                        <Nav.Link eventKey='/rules'><h5 className='mb-0'>Правила</h5></Nav.Link>
                        <Nav.Link eventKey='/players'><h5 className='mb-0'>Участники</h5></Nav.Link>
                        <Nav.Link eventKey='/wheels'><h5 className='mb-0'>Колеса</h5></Nav.Link>
                        <Nav.Link eventKey='/effects'><h5 className='mb-0'>События</h5></Nav.Link>
                        <Nav.Link eventKey='/game/play'><h5 className='mb-0'>Игра</h5></Nav.Link>
                        {!session?.user.isAdmin || <Nav.Link eventKey='/admin'><h5 className='mb-0'>Админ(очка)</h5></Nav.Link>}
                    </Nav>
                </Navbar.Collapse>
                <Navbar.Collapse className="justify-content-end">
                    <Nav
                        activeKey={router.asPath}
                        onSelect={(selectedKey) => router.replace(selectedKey as string)}>
                        {
                            sessionStatus == 'loading' ? <LoadingDots compact className='me-3' count={3} size='sm' /> :
                                session ?
                                    <Row>
                                        <Col className='mh-100 px-0 mx-0'>
                                            <Nav.Link eventKey='/me' className="fix-font-weight px-0">
                                                <h5 className='mb-0'>{session.user.displayName}</h5>
                                            </Nav.Link>
                                        </Col>
                                        <Col className='me-3'>
                                            <Image
                                                alt='avatar'
                                                key={2}
                                                src={`https://cdn.discordapp.com/avatars/${session.user.discordId}/${session.user.image}.png`}
                                                roundedCircle
                                                width="40"
                                                height="40"
                                                className="ml-1"
                                                onError={(e: any) => { e.target.onerror = null; e.target.src = "/errorAvatar.jpg" }}
                                            />
                                        </Col>
                                    </Row> :
                                    <Nav.Link
                                        // href="/auth" 
                                        onClick={() => signIn('discord', { redirect: false })}
                                        className="mx-3"
                                        as={Button}
                                        variant='outline-info'
                                        style={{ padding: 7 }}
                                    >
                                        <h5 className='mb-0 mx-1'>
                                            Sign In <i className="bi bi-discord"></i>
                                        </h5>
                                    </Nav.Link>
                        }
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </div >
    );
};
export default Bar;