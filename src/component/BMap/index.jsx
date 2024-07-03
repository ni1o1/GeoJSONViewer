import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setMap, setView } from '../../Store/modules/BMap';
import './index.css';
import { setCurrentCoords, setTooltip, setCompass, setGeojsonEditTooltip } from '../../Store/modules/BMap';
import { bd09towgs84_all } from '@/utils/coordtransform';
import axios from 'axios';
import { Button, Switch, AutoComplete, Input } from 'antd';
import Compass from '@@/Compass';
import Legend from '@@/Legend';

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
  const setTooltip_redux = (data) => {
    dispatch(setTooltip(data));
  }
  const setCompass_redux = (data) => {
    dispatch(setCompass(data));
  }

  let markerOverlay = null
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
      const getpixel = (map,distance) => {
        const center = map.getCenter();
        const centerPoint = new BMapGL.Point(center.lng, center.lat);

        // 计算中心点向东1公里的点
        const kmInDegree = (distance/1000) / (111.32 * Math.cos(center.lat * Math.PI / 180)); // 经度上的1公里对应的度数
        const eastPoint = new BMapGL.Point(center.lng + kmInDegree, center.lat);

        // 将地理坐标转换为像素坐标
        const centerPixel = map.pointToPixel(centerPoint);
        const eastPixel = map.pointToPixel(eastPoint);

        // 计算像素距离
        const pixelDistance = Math.sqrt(Math.pow(eastPixel.x - centerPixel.x, 2) + Math.pow(eastPixel.y - centerPixel.y, 2));

        return pixelDistance
      }
      let pixel_distance = getpixel(map,1000)
      let unit = 'KM'
      if ((100/pixel_distance).toFixed(0)==0){
        pixel_distance = getpixel(map,100)
        unit = 'M'
        setCompass_redux({
          width: pixel_distance * (100/pixel_distance).toFixed(0),
          length: (100/pixel_distance).toFixed(0)*100,
          unit
        })
      }else{
        setCompass_redux({
          width: pixel_distance * (100/pixel_distance).toFixed(0),
          length: (100/pixel_distance).toFixed(0),
          unit
        })
      }

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

    const local = new BMapGL.LocalSearch(map, { //智能搜索
      onSearchComplete: () => {
        const poiinfo = local.getResults().getPoi(0)
        console.log(poiinfo)
        var pp = poiinfo.point;    //获取第一个智能搜索的结果
        map.centerAndZoom(pp, 18);
        const marker = new BMapGL.Marker(pp)
        marker.addEventListener('mouseout', function (e) {
          setTooltip_redux({
            title: '',
            x: 0,
            y: 0,
            show: false,
            info: {}
          })
        })
        marker.addEventListener('mouseover', function (e) {
          setTooltip_redux({
            title: poiinfo.title,
            x: e.pixel.x,
            y: e.pixel.y,
            show: true,
            info: {
              '城市': poiinfo.city,
              '电话': poiinfo.phoneNumber,
              '邮编': poiinfo.postcode,
              '地址': poiinfo.address,
              '标签': poiinfo.tags.join(),
            }
          })
        })
        map.addOverlay(marker);    //添加标注
        markerOverlay = marker
      }
    });

    var ac = new BMapGL.Autocomplete(    //建立一个自动完成的对象
      {
        "input": "suggestId"
        , "location": map
      });
    ac.addEventListener("onconfirm", function (e) {    //鼠标点击下拉列表后的事件
      const _value = e.item.value;
      const myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
      setSearchValue(myValue)
      if (markerOverlay) {
        map.removeOverlay(markerOverlay)
      }
      local.search(myValue);
    });
  }, []);

  //地点检索
  const [searchValue, setSearchValue] = useState([]);

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

      <div className='tooltip' id='query_tooltip' style={{
        left: '50%',
        top: '5px',
        position: 'absolute',
        display: 'block',
        zIndex: 999,
      }}>
        <div className='tooltip-title' >
          <Input style={{ width: 400 }} value={searchValue} onChange={(value) => {
            setSearchValue(value.target.value)
          }}

            id="suggestId" size="large" placeholder="地点检索" enterButton />
        </div>
      </div>

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
          {tooltip.info && Object.keys(tooltip.info).map((key, index) => {
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
      <Compass />
      <Legend />
    </>
  );
}

export default App;