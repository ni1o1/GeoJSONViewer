import React, { useEffect } from 'react'
import { Map, Marker, NavigationControl, InfoWindow } from 'react-bmapgl';
import { useDispatch } from 'react-redux';
import { setMap } from '../../Store/modules/BMap';

const BMapGL = window.BMapGL;

function App() {
  const dispatch = useDispatch();

  const setMap1 = (map) => {
    dispatch(setMap(map));
  }

  useEffect(() => {
    const map = new BMapGL.Map("allmap");    // 创建Map实例
    map.centerAndZoom(new BMapGL.Point(116.280190, 40.049191), 12);  // 初始化地图,设置中心点坐标和地图级别
    map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
    map.setHeading(0);
    map.setTilt(0);
    map.setMapStyleV2({
      styleId: '88bb82d188d05be79684da3ff4804500'
    });
    var scaleCtrl = new BMapGL.ScaleControl();  // 添加比例尺控件
    map.addControl(scaleCtrl);
    var zoomCtrl = new BMapGL.ZoomControl();  // 添加缩放控件
    map.addControl(zoomCtrl);
    var locationCtrl = new BMapGL.LocationControl();  // 添加定位控件
    map.addControl(locationCtrl);
    
    var cityCtrl = new BMapGL.CityListControl();  // 添加城市列表控件
    cityCtrl.setAnchor(window.BMAP_ANCHOR_TOP_RIGHT);
    map.addControl(cityCtrl);

    setMap1(map)

  }, []);

  return (
    <div id="allmap" style={{
      width: "100%",
      height: "100%",
      overflow: 'hidden',
      position: 'absolute',
      top: 0,
      display: 'flex',
      zIndex: 0
    }}></div>
  );
}

export default App;