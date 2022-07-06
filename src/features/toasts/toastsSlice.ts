import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '../../app/store'
import { IToast } from '../../util/interfaces'

export const toastsSlice = createSlice({
  name: 'toasts',
  initialState: {
    toasts: new Array<IToast>()
  },
  reducers: {
    newToast: (state, action: {
      type: string;
      payload: IToast;
    }) => {
      state.toasts.push({
        ...action.payload,
        show: false,
        new: true
      })
    },
    deleteToast: (state, action) => {
      state.toasts = state.toasts.filter(x => x.id !== action.payload)
    },
    hideToast: (state, action) => {
      state.toasts = state.toasts.map(x => x.id === action.payload ? { ...x, show: false, new: false } : x)
    },
    showToast: (state, action) => {
      state.toasts = state.toasts.map(x => x.id === action.payload ? { ...x, show: true, new: false } : x)
    },
  }
})

// Action creators are generated for each case reducer function
export const { newToast, deleteToast, hideToast, showToast } = toastsSlice.actions
export const selectToasts = (state: RootState) => state.toasts.toasts
export default toastsSlice.reducer