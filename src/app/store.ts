import { configureStore } from '@reduxjs/toolkit'
import counterReducer from '../features/counter/counterSlice'
import postsReducer from '../features/game/postsSlice'
import userInfoReducer from '../features/userinfo/userInfoSlice'
import myWheelReducer from '../features/me/myWheelSlice'
import usersReducer from '../features/admin/usersSlice'
import aPlayersReducer from '../features/admin/aPlayersSlice'
import playersReducer from '../features/players/playersSlice'
import wheelsReducer from '../features/wheels/wheelsSlice'
import myPlayerReducer from '../features/me/myPlayerSlice'
import eggReducer from '../features/egg/eggSlice'
import rulesReducer from '../features/rules/rulesSlice'
import aRulesReducer from '../features/admin/aRulesSlice'
import toastsReducer from '../features/toasts/toastsSlice'
import effectsReducer from '../features/effects/effectsSlice'
import aEffectsReducer from '../features/admin/aEffectsSlice'
import aItemsReducer from '../features/admin/aItemsSlice'
import myTaskReducer from '../features/game/myTaskSlice'
import statsHistoryReducer from '../features/charts/statsHistorySlice'
import myEffectsReducer from '../features/game/myEffectsSlice'
import mySecretsReducer from '../features/game/mySecretsSlice'
import myCardsReducer from '../features/game/myCardsSlice'
const store = configureStore({
  reducer: {
    counter: counterReducer,
    posts: postsReducer,
    userinfo: userInfoReducer,
    myWheel: myWheelReducer,
    users: usersReducer,
    aPlayers: aPlayersReducer,
    players: playersReducer,
    wheels: wheelsReducer,
    myPlayer: myPlayerReducer,
    egg: eggReducer,
    rules: rulesReducer,
    aRules: aRulesReducer,
    toasts: toastsReducer,
    effects: effectsReducer,
    aEffects: aEffectsReducer,
    aItems: aItemsReducer,
    myTask: myTaskReducer,
    stats: statsHistoryReducer,
    myEffects: myEffectsReducer,
    mySecrets: mySecretsReducer,
    myCards: myCardsReducer,
  }
})
export default store;
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch