import React, { useEffect } from 'react'
import { Map, Marker, NavigationControl, InfoWindow } from 'react-bmapgl';
import { useDispatch, useSelector } from 'react-redux';
import { setMap } from '../../Store/modules/BMap';
import './index.css';
import { setCurrentCoords } from '../../Store/modules/BMap';
import { bd09towgs84 } from './coordtransform';

const BMapGL = window.BMapGL;

function App() {

  //redux
  const { tooltip, currentcoords } = useSelector((state) => state.BMap);

  const dispatch = useDispatch();

  const setMap1 = (map) => {
    dispatch(setMap(map));
  }

  const setCurrentCoords_redux = (data) => {
    dispatch(setCurrentCoords(data));
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
    map.addEventListener('mousemove', function (e) {
      setCurrentCoords_redux(bd09towgs84(e.latlng.lng, e.latlng.lat))
    })
    setMap1(map)

  }, []);

  return (
    <div style={{
      width: "100%",
      height: "100%",
      overflow: 'hidden',
      position: 'absolute',
      top: 0,
      display: 'flex',
      zIndex: 0
    }}>
      <div id="allmap" style={{
        width: "100%",
        height: "100%",
        overflow: 'hidden',
        position: 'absolute',
        top: 0,
        display: 'flex',
        zIndex: 0
      }} />

      <div className='tooltip' style={{
        left: '45px',
        bottom: '42px',
        position: 'absolute',
        display: 'block',
        zIndex: 999,
      }}>
        <div className='tooltip-title'>
          坐标
        </div>
        <div className='tooltip-content'>
          <div> <span className='tooltip-key'>WGS84:</span>{currentcoords.wgs84coord[0].toFixed(6)},{currentcoords.wgs84coord[1].toFixed(6)}</div>
          <div> <span className='tooltip-key'>GCJ02:</span>{currentcoords.gcj02coord[0].toFixed(6)},{currentcoords.gcj02coord[1].toFixed(6)}</div>
          <div> <span className='tooltip-key'>BD09:</span>{currentcoords.bd09coord[0].toFixed(6)},{currentcoords.bd09coord[1].toFixed(6)}</div>
        </div>
      </div>
      <div className='tooltip' style={{
        left: tooltip.x,
        top: tooltip.y,
        position: 'absolute',
        display: tooltip.show ? 'block' : 'none',
        zIndex: 999,
      }}>
        <div className='tooltip-title'>
          {tooltip.title}
        </div>
        <div className='tooltip-content'>
          {Object.keys(tooltip.info).map((key, index) => {
            return <div key={index}>
              <span className='tooltip-key'>{key}:</span>{tooltip.info[key]}</div>
          })}
        </div>
      </div>
    </div>
  );
}

export default App;