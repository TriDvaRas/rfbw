import React, { useEffect } from 'react';
import { Container } from "react-bootstrap";
import KeyboardEventHandler from 'react-keyboard-event-handler';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import './assets/scss/custom.sass';
import './assets/scss/egg.sass';
import './assets/scss/rotate.sass';
import Home from './components/Home';
import LoadingDots from './components/LoadingDots';
import Navbar from './components/Navbar';
import Admin from './features/admin/Admin';
import Effects from './features/effects/Effects';
import { handleKeyPress, selectEgg } from './features/egg/eggSlice';
import Forbidden from './features/forbidden/Forbidden';
import Game from './features/game/Game';
import MePlayerEdit from './features/me/MePlayerEditor';
import PlayersList from './features/players/PlayersList';
import Rules from './features/rules/Rules';
import { useSocket } from './features/socket/useSocket';
import Toasts from './features/toasts/Toasts';
import { fetchUserInfo, getUserInfo } from './features/userinfo/userInfoSlice';
import WheelEditor from './features/wheelEditor/WheelEditor';
import WheelsList from './features/wheels/WheelsList';
import useWindowDimensions from './util/useWindowDimensions';
import io, { Socket } from 'socket.io-client'

const socket = io('/')


function App() {
	const { height } = useWindowDimensions()
	const userinfo = useSelector(getUserInfo)
	const egg = useSelector(selectEgg)
	const dispatch = useDispatch()
	useSocket(socket)
	useEffect(() => {
		if (userinfo.status === 'idle') {
			dispatch(fetchUserInfo())
		}
	}, [userinfo.status, dispatch])
	function handleEgg(key: string, e: KeyboardEvent) {
		dispatch(handleKeyPress(key))
	}
	return (
		<div id="app" className={`mh-100 ${egg.enabled ? `body-egg` : ``}`}>
			<Router>
				<Navbar />
				<KeyboardEventHandler
					handleKeys={egg.eggword.split('').filter((x, i, arr) => arr.indexOf(x) === i)}
					onKeyEvent={handleEgg} />
				{
					userinfo.status === 'loading' ?
						<LoadingDots count={5} className="mt-5" /> :
						<Routes >
							<Route path='/admin/*'
								element={
									<Container fluid >
										{userinfo.user?.isAdmin ? <Admin /> : userinfo.status === 'succeeded' || userinfo.status === 'failed' ? <Navigate to='/' /> : null}
									</Container>
								}
							/>
							<Route path='/rules/*'
								element={<Rules />}
							/>
							<Route path='/players/*'
								element={<PlayersList height={height} />}
							/>
							<Route path='/wheels/*'
								element={<WheelsList height={height} />}
							/>
							<Route path='/effects/*'
								element={<Effects height={height} />}
							/>
							<Route path='/game/*'
								element={userinfo.user?.isPlayer ? <Game /> : userinfo.status === 'succeeded' || userinfo.status === 'failed' ? <Navigate to='/' /> : null}
							/>
							<Route path='/forbidden/*'
								element={<Forbidden />}
							/>
							<Route path='/me/wheel/*'
								element={<Container fluid >
									<WheelEditor />
								</Container>}
							/>
							<Route path='/me/*'
								element={<Container fluid >
									<MePlayerEdit maxCardHeight={height} />
								</Container>}
							/>
							<Route path='/'
								element={<Container fluid >
									<Home />
								</Container>}
							/>
						</Routes>
				}
			</Router>
			<Toasts />
		</div>
	);
}
export default App;
