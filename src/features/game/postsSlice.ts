import axios from 'axios'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { IPost } from '../../util/interfaces'
import { RootState } from '../../app/store'


const initialState: {
  posts: Array<IPost>;
  status: 'idle' | 'loading' | 'succeeded' | 'failed' | 'updating';
  error: string | null;
} = {
  posts: [],
  status: 'idle',
  error: null
}

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const response: { data: Array<IPost> } = await axios.get('/api/posts')
  return response.data
})

export const fetchMorePosts = createAsyncThunk('posts/fetchMorePosts', async (payload: number) => {
  const response: { data: Array<IPost> } = await axios.get(`/api/posts/${payload}`)
  return response.data
})

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    addPost: (state, action) => {
      if (state.posts)
        state.posts = [action.payload].concat(state.posts )
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPosts.pending, (state, action) => {
      state.status = 'loading'
    })
    builder.addCase(fetchPosts.fulfilled, (state, action) => {
      state.status = 'succeeded'
      state.posts = action.payload
    })
    builder.addCase(fetchPosts.rejected, (state, action) => {
      state.status = 'failed'
      state.error = action.payload as string
    })
    builder.addCase(fetchMorePosts.pending, (state, action) => {
      state.status = 'updating'
    })
    builder.addCase(fetchMorePosts.fulfilled, (state, action) => {
      state.status = 'succeeded'
      state.posts = state.posts.concat(action.payload)
    })
    builder.addCase(fetchMorePosts.rejected, (state, action) => {
      state.status = 'failed'
      state.error = action.payload as string
    })
  }
})

export default postsSlice.reducer

export const { addPost } = postsSlice.actions
export const selectPosts = (state: RootState) => state.posts