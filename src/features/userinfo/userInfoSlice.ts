import axios from 'axios'
import { createSlice,  createAsyncThunk } from '@reduxjs/toolkit'
import { RootState } from '../../app/store'
import { IUser } from '../../util/interfaces'


const initialState: {
  user?: IUser;
  status: 'idle' | 'loading' | 'succeeded' | 'failed',
  error?: string; 
} = {
  status: 'idle' 
}



export const fetchUserInfo = createAsyncThunk('user/getData', async () => {
  const response: { data: IUser } = await axios.get('/api/userinfo')
  return response.data
})


const userInfoSlice = createSlice({
  name: 'userinfo',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUserInfo.pending, (state, action) => {
      state.status = 'loading'
    })
    builder.addCase(fetchUserInfo.fulfilled, (state, action) => {
      state.status = 'succeeded'
      state.user = action.payload
    })
    builder.addCase(fetchUserInfo.rejected, (state, action) => {
      state.status = 'failed'
      state.error = action.payload as string
    })
  }
})
export default userInfoSlice.reducer


export const getUserInfo = (state: RootState) => state.userinfo