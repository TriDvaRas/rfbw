import React from 'react';
import {
    Image, Nav, Navbar
} from 'react-bootstrap';
import { useSelector } from 'react-redux';
import {
    Link, NavLink
} from "react-router-dom";
import { getUserInfo } from '../features/userinfo/userInfoSlice';
import LoadingDots from './LoadingDots';

const Bar = () => {
    const userinfo = useSelector(getUserInfo)
    return (
        <div>
            <Navbar bg="dark-700" variant="dark" expand="lg" >
                <Link to='/'>
                    <Navbar.Brand >
                        <h3 className='mb-0'>RFBW<span className='egg-text'></span></h3>
                    </Navbar.Brand>
                </Link>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="fix-font-weight">
                        <Nav.Link as={NavLink} to='/rules'><h5 className='mb-0'>Правила</h5></Nav.Link>
                        <Nav.Link as={NavLink} to='/players'><h5 className='mb-0'>Участники</h5></Nav.Link>
                        <Nav.Link as={NavLink} to='/wheels'><h5 className='mb-0'>Колеса</h5></Nav.Link>
                        <Nav.Link as={NavLink} to='/effects'><h5 className='mb-0'>События</h5></Nav.Link>
                        <Nav.Link as={NavLink} to='/game/play'><h5 className='mb-0'>Игра</h5></Nav.Link>
                        {!userinfo.user?.isAdmin || <Nav.Link as={Link} to='/admin'><h5 className='mb-0'>Админ(очка)</h5></Nav.Link>}
                    </Nav>
                </Navbar.Collapse>
                {/* <h4 className='m-0'>СВИНьЯ КУПИ СЕРВАК!!!</h4> */}
                <Navbar.Collapse className="justify-content-end">
                    <Nav >
                        {
                            userinfo.status === 'loading' ?
                                <LoadingDots count={5} /> :
                                userinfo.user ?
                                    [
                                        <Nav.Link key={1} as={NavLink} to='/me' className="fix-font-weight">
                                            <h5 className='mb-0'>{userinfo.user.tag}</h5>
                                        </Nav.Link>,
                                        <Image
                                            key={2}
                                            src={`https://cdn.discordapp.com/avatars/${userinfo.user.id}/${userinfo.user.avatar}.png`}
                                            roundedCircle
                                            width="40"
                                            height="40"
                                            className="ml-1"
                                            onError={(e: any) => { e.target.onerror = null; e.target.src = "/errorAvatar.jpg" }}
                                        />,
                                    ] :
                                    <Nav.Link href="/auth" className="">
                                        <h5 className='mb-0'>Login <i className="bi bi-discord"></i></h5>
                                    </Nav.Link>
                        }
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </div>
    );
};
export default Bar;