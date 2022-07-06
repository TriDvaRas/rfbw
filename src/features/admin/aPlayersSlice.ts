import axios from 'axios'
import { createSlice,  createAsyncThunk } from '@reduxjs/toolkit'
import { RootState } from '../../app/store'
import { IAPlayer } from '../../util/interfaces'


const initialState: {
  players?: Array<IAPlayer>;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string;
} = {
  status: 'idle',
}

export const fetchAPlayers = createAsyncThunk('players/fetchAPlayers', async () => {
  const response: { data: Array<IAPlayer> } = await axios.get(`/api/admin/players`)
  return response.data
})


const aPlayersSlice = createSlice({
  name: 'aplayers',
  initialState,
  reducers: {
      updatePlayer: (state, action) => {
        const payload: IAPlayer = action.payload
        if (state.players) {
          let player = state.players.find(x => x.id === payload.id)
          if (player) {
            if (typeof payload.name === 'string') player.name = payload.name
            if (typeof payload.about === 'string') player.about = payload.about
            if (typeof payload.picture === 'string') player.picture = payload.picture
          }
        }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAPlayers.pending, (state, action) => {
      state.status = 'loading'
    })
    builder.addCase(fetchAPlayers.fulfilled, (state, action) => {
      state.status = 'succeeded'
      state.players = action.payload
    })
    builder.addCase(fetchAPlayers.rejected, (state, action) => {
      state.status = 'failed'
      state.error = action.payload as string
    })


  }
})

export default aPlayersSlice.reducer
export const {updatePlayer } = aPlayersSlice.actions
export const selectAPlayers = (state: RootState) => state.aPlayers