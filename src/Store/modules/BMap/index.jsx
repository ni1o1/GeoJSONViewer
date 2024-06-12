//编写store
import { createSlice } from "@reduxjs/toolkit"
const bmapStore = createSlice({
  name: 'microGrid',
  initialState: {
    map: null,
  },
  reducers: {
    setMap(state, action) {
      state.map = action.payload;
    },
  }
})
const { setMap } = bmapStore.actions
export { setMap }

const reducer = bmapStore.reducer
export default reducer