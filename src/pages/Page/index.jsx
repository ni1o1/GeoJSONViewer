import React from 'react'
//import './index.css'
import BMap from "@@/BMap"

import Panelpage from '@@/Panelpage'
function App() {

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <BMap />
      <Panelpage />
    </div>

  );
}

export default App;
