import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { RootState } from '../../app/store'
import { ITask } from '../../util/interfaces'


const initialState: {
    task?: ITask;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error?: string;
} = {
    status: 'idle',
}

export const fetchMyTask = createAsyncThunk('myTask/fetchMyTask', async () => {
    const response: { data: ITask } = await axios.get(`/api/game/mytask`)
    return response.data
})


const myTaskSlice = createSlice({
    name: 'myTask',
    initialState,
    reducers: {
        updateTask: (state, action: {
            payload: {
                [key in keyof ITask]?: ITask[key];
            },
            type: string
        }) => {
            state.task = { ...state.task, ...action.payload } as ITask
        },
        setTask: (state, action: {
            payload: ITask,
            type: string
        }) => {
            state.task = { ...state.task, ...action.payload } as ITask
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchMyTask.pending, (state, action) => {
            state.status = 'loading'
        })
        builder.addCase(fetchMyTask.fulfilled, (state, action) => {
            state.status = 'succeeded'
            state.task = action.payload
        })
        builder.addCase(fetchMyTask.rejected, (state, action) => {
            state.status = 'failed'
            state.error = action.payload as string
        })
    }
})

export default myTaskSlice.reducer
export const { updateTask,setTask } = myTaskSlice.actions
export const selectMyTask = (state: RootState) => state.myTask