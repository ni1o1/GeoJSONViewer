//编写store
import { createSlice } from "@reduxjs/toolkit"
const bmapStore = createSlice({
  name: 'BMap',
  initialState: {
    map: null,
    view: null,
    customlayers:[],
    tooltip:{
      x:'0',
      y:'0',
      show:false,
      info:{}
    },
    geojson_edit_tooltip:{
      x:'0',
      y:'0',
      show:false,
      editItem:null
    },
    currentcoords:{
      bd09coord:[0,0],
      gcj02coord:[0,0],
      wgs84coord:[0,0]
    }
  },
  reducers: {
    setMap(state, action) {
      state.map = action.payload;
    },
    setView(state, action) {
      state.view = action.payload;
    },
    addCustomLayers(state, action) {
      state.customlayers = [...state.customlayers, action.payload]
    },
    removeCustomLayers(state, action) {
      state.customlayers = state.customlayers.filter(item => item.layerName != action.payload)
    },
    setTooltip(state, action) {
      state.tooltip = action.payload
    },
    setCurrentCoords(state, action) {
      state.currentcoords = action.payload
    },
    setGeojsonEditTooltip(state, action) {
      state.geojson_edit_tooltip = action.payload
    }
  }
})
const { setMap,addCustomLayers,removeCustomLayers,setTooltip,setCurrentCoords,setGeojsonEditTooltip,setView } = bmapStore.actions
export { setMap,addCustomLayers,removeCustomLayers,setTooltip,setCurrentCoords,setGeojsonEditTooltip,setView }

const reducer = bmapStore.reducer
export default reducer