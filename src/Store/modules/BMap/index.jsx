//编写store
import { createSlice } from "@reduxjs/toolkit"
const bmapStore = createSlice({
  name: 'BMap',
  initialState: {
    map: null,
    customlayers:[],
    tooltip:{
      x:'0',
      y:'0',
      show:false,
      info:{}
    }
  },
  reducers: {
    setMap(state, action) {
      state.map = action.payload;
    },
    addCustomLayers(state, action) {
      state.customlayers = [...state.customlayers, action.payload]
    },
    removeCustomLayers(state, action) {
      state.customlayers = state.customlayers.filter(item => item.layerName != action.payload)
    },
    setTooltip(state, action) {
      state.tooltip = action.payload
    }
  }
})
const { setMap,addCustomLayers,removeCustomLayers,setTooltip } = bmapStore.actions
export { setMap,addCustomLayers,removeCustomLayers,setTooltip }

const reducer = bmapStore.reducer
export default reducer