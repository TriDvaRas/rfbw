import axios from 'axios'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { RootState } from '../../app/store'
import { IPlayer } from '../../util/interfaces'


const initialState: {
  players?: Array<IPlayer>;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string;
} = {
  status: 'idle',
}

export const fetchPlayers = createAsyncThunk('players/fetchPlayers', async () => {
  const response: { data: Array<IPlayer> } = await axios.get(`/api/players`)
  return response.data
})


const playersSlice = createSlice({
  name: 'players',
  initialState,
  reducers: {
    updatePlayer: (state, action: {
      payload: { [key in keyof IPlayer]?: IPlayer[key]; },
      type: string
    }) => {
      if (state.players) {
        let player = state.players.find(x => x.id === action.payload.id)
        if (player) {
          player = { ...player, ...action.payload }
        }
      }

    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPlayers.pending, (state, action) => {
      state.status = 'loading'
    })
    builder.addCase(fetchPlayers.fulfilled, (state, action) => {
      state.status = 'succeeded'
      state.players = action.payload
    })
    builder.addCase(fetchPlayers.rejected, (state, action) => {
      state.status = 'failed'
      state.error = action.payload as string
    })


  }
})

export default playersSlice.reducer
export const { updatePlayer } = playersSlice.actions
export const selectPlayers = (state: RootState) => state.players