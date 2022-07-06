import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { RootState } from '../../app/store'
import { IUser } from '../../util/interfaces'


const initialState: {
  users?: Array<IUser>;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string;
} = {
  status: 'idle',
}

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response: { data: Array<IUser> } = await axios.get(`/api/admin/users`)
  return response.data
})


const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setPlayer: (state, action) => {
      if (state.users)
        state.users = state.users.map(user => user.id === action.payload ? { ...user, isPlayer: true } : user)
    },
    setNonPlayer: (state, action) => {
      if (state.users)
        state.users = state.users.map(user => user.id === action.payload ? { ...user, isPlayer: false } : user)
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUsers.pending, (state, action) => {
      state.status = 'loading'
    })
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.status = 'succeeded'
      state.users = action.payload
    })
    builder.addCase(fetchUsers.rejected, (state, action) => {
      state.status = 'failed'
      state.error = action.payload as string
    })


  }
})

export default usersSlice.reducer
export const { setPlayer, setNonPlayer } = usersSlice.actions
export const selectUsers = (state: RootState) => state.users