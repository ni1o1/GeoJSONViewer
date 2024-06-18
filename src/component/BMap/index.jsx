import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setMap, setView } from '../../Store/modules/BMap';
import './index.css';
import { setCurrentCoords, setGeojsonEditTooltip } from '../../Store/modules/BMap';
import { bd09towgs84_all } from '@/utils/coordtransform';
import axios from 'axios';
import { Button, Switch } from 'antd';

const BMapGL = window.BMapGL;
const mapvgl = window.mapvgl;
function App() {

  //redux
  const { tooltip, currentcoords, geojson_edit_tooltip } = useSelector((state) => state.BMap);

  const dispatch = useDispatch();

  const setMap_redux = (map) => {
    dispatch(setMap(map));
  }
  const setView_redux = (view) => {
    dispatch(setView(view));
  }
  const setCurrentCoords_redux = (data) => {
    dispatch(setCurrentCoords(data));
  }

  const setGeojsonEditTooltip_redux = (data) => {
    dispatch(setGeojsonEditTooltip(data));
  }
  useEffect(() => {
    const map = new BMapGL.Map("allmap", { enableIconClick: true });    // 创建Map实例
    // 2. 创建MapVGL图层管理器
    const view = new mapvgl.View({
      map: map
    });
    
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

    map.addEventListener('mousemove', function (e) {
      setCurrentCoords_redux(bd09towgs84_all(e.latlng.lng, e.latlng.lat))
    })

    // 地图选poi展示提示框
    //全局变量记录插入的jsonp标签
    window.clickPoint = null;
    window.script = null;
    let clickPoint
    let script
    window.sucess = function (res) {
      if (res.uii_err === 0 && res.content) {
        var info = res.content;
        var sContent = `<h4 style='margin:0 0 5px 10px;'>${info.name}</h4>
				<h5 style='margin:0 0 5px 10px;'>地址：${info.addr}</h4>
				<h5 style='margin:0 0 35px 10px;'>分类：${info.tag !== '境外区域' || info.tag === info.name ? info.tag : '地址'}</h4>`;
        var infoWindow = new BMapGL.InfoWindow(sContent);  // 创建信息窗口对象 
        map.openInfoWindow(infoWindow, clickPoint); //开启信息窗口
        // 移除插入的标签，防止越插入越多
        document.getElementsByTagName('head')[0].removeChild(script);
      }
    }
    map.addEventListener('click', e => {
      //关闭之前的提示框
      setGeojsonEditTooltip_redux({
        x: 0,
        y: 0,
        show: false,
        editItem: null
      })
      clickPoint = e.latlng;
      const point = e.point;
      const itemId = map.getIconByClickPosition(e);

      if (itemId) {
        let url = `https://api.map.baidu.com/?qt=inf&uid=${itemId.uid}&operate=mapclick&clicktype=tile&ie=utf-8&oue=1&fromproduct=jsapi&res=api&&ak=f8GgvXGNa3rCqHkmrAdAgPm3YFV12uTi&callback=sucess`
        script = document.createElement('script');
        script.setAttribute('src', url);
        document.getElementsByTagName('head')[0].appendChild(script);
      }

    });
    setMap_redux(map)
    setView_redux(view)
  }, []);

  return (


    <>
      <div id="allmap" style={{
        width: "100%",
        height: "100%",
        overflow: 'hidden',
        position: 'absolute',
        top: 0,
        display: 'flex',
        zIndex: 0
      }} />


      <div className='tooltip' id='coords_tooltip' style={{
        left: '45px',
        bottom: '42px',
        position: 'absolute',
        display: 'block',
        zIndex: 999,
      }}>
        <div className='tooltip-title' >
          坐标
        </div>
        <div className='tooltip-content'>
          <div> <span className='tooltip-key'>WGS84:</span>{currentcoords.wgs84coord[0].toFixed(6)},{currentcoords.wgs84coord[1].toFixed(6)}</div>
          <div> <span className='tooltip-key'>GCJ02:</span>{currentcoords.gcj02coord[0].toFixed(6)},{currentcoords.gcj02coord[1].toFixed(6)}</div>
          <div> <span className='tooltip-key'>BD09:</span>{currentcoords.bd09coord[0].toFixed(6)},{currentcoords.bd09coord[1].toFixed(6)}</div>
        </div>
      </div>
      <div className='tooltip' id='geojson_item_tooltip' style={{
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
      <div className='tooltip' id='geojson_edit_tooltip' style={{
        left: geojson_edit_tooltip.x,
        top: geojson_edit_tooltip.y,
        position: 'absolute',
        display: geojson_edit_tooltip.show ? 'block' : 'none',
        zIndex: 999,
      }}>
        <div className='tooltip-title'>
          编辑模式<Switch checkedChildren="开"
            unCheckedChildren="关"
            defaultChecked={geojson_edit_tooltip.editItem && geojson_edit_tooltip.editItem._config.enableEditing}
            onChange={(checked) => {
              if (checked) {
                geojson_edit_tooltip.editItem.enableEditing()
              } else {
                geojson_edit_tooltip.editItem.disableEditing()
              }
            }}
          />
        </div>
        <div className='tooltip-content'>
          拖动空心点增加节点<br />
          拖动实心点编辑节点<br />
          右键实心点删除节点
        </div>
      </div>
    </>
  );
}

export default App;