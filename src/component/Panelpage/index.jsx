
import React, { useState, useEffect } from 'react'
import { Tabs, Layout, Button, Menu, Switch } from 'antd';
import GeoJSONview from '../GeoJSONview';
import { Dropdown, Modal, message } from 'antd';
import { PageHeader } from '@ant-design/pro-layout';
import { DownOutlined, SettingOutlined, UpOutlined, SyncOutlined, LockOutlined, ExportOutlined, GlobalOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import {

  MenuUnfoldOutlined, MenuFoldOutlined, NodeIndexOutlined
} from '@ant-design/icons';
import './index.css';
import { darkStyle, snowStyle } from './style.js';
const { TabPane } = Tabs;
const { SubMenu } = Menu;
const { Sider, Content } = Layout;

export default function Panelpage() {

  const { map } = useSelector((state) => state.BMap);

  function handleClick(e) {
    setactivepage(e.key)
  }
  const [collapsedmenu, setcollapsedmenu] = useState(true)

  const cardmenu = (<Sider
    collapsed={collapsedmenu}
    onCollapse={() => { setcollapsedmenu(!collapsedmenu) }}
    theme='light'
  >
    <Menu
      mode="inline"
      onClick={handleClick}
      defaultSelectedKeys={['GeoJSONview']}
      style={{
        borderRight: 0,
        'overflowX': 'hidden',
        'overflowY': 'auto'
      }}
    >
      <SubMenu key="sub1" icon={<NodeIndexOutlined />} title="GeoJSON view">
        <Menu.Item key="GeoJSONview" icon={<NodeIndexOutlined />}>GeoJSON view</Menu.Item>
      </SubMenu>
    </Menu>
    <Button type="text" onClick={() => { setcollapsedmenu(!collapsedmenu) }} style={{ margin: '10px 16px' }}>
      {React.createElement(collapsedmenu ? MenuUnfoldOutlined : MenuFoldOutlined)}
    </Button>
  </Sider>)
  const onItemShowChange = (itemType,checked) => {
    map.setDisplayOptions({
      [itemType]: checked
    })
  }
  const mapstylemenu = [
    {
      key: 'Mapstyle', label: '地图样式', icon: <GlobalOutlined />, children: [
        { key: 'setStyle_normal', label: '出行（普通）' },
        { key: 'setStyle_blackyellow', label: '绿野仙踪（黑黄）' },
        { key: 'setStyle_gray', label: '一蓑烟雨（灰）' },
        { key: 'setStyle_whiteyellow', label: '物流（白橙）' },
        { key: 'setStyle_black', label: '黑' },
        { key: 'setStyle_white', label: '白' },
        { key: 'setStyle_satellite', label: '卫星地图（普通）' },
        { key: 'setStyle_satellite_earth', label: '卫星地图（地球）' },
      ]
    },
    {
      key: 'showPOI', label: <>POI文字  <Switch defaultChecked onChange={(checked)=>{onItemShowChange('poiText',checked)}} /></>,children:[]
    },
    {
      key: 'showPOIicon', label: <>POIicon  <Switch defaultChecked onChange={(checked)=>{onItemShowChange('poiIcon',checked)}} /></>,children:[]
    },
    {
      key: 'showBuilding', label: <>3D建筑物  <Switch defaultChecked onChange={(checked)=>{onItemShowChange('building',checked)}} /></>,children:[]
    },

  ]
  const handleMenuClick = (e) => {
    if (e.key == 'setStyle_normal') {
      map.setMapType(window.BMAP_NORMAL_MAP);
      map.setMapStyleV2({
        styleId: '88bb82d188d05be79684da3ff4804500'
      });
    }
    if (e.key == 'setStyle_blackyellow') {
      map.setMapType(window.BMAP_NORMAL_MAP);
      map.setMapStyleV2({
        styleId: '15bdc45ed0d678b574193de0bf9fe90a'
      });
    }
    if (e.key == 'setStyle_gray') {
      map.setMapType(window.BMAP_NORMAL_MAP);
      map.setMapStyleV2({
        styleId: '2513dfec28fbb53186fb16eef8188a99'
      });
    }
    if (e.key == 'setStyle_whiteyellow') {
      map.setMapType(window.BMAP_NORMAL_MAP);
      map.setMapStyleV2({
        styleId: '95f1127ddd47c9481828a675b1765a8b'
      });
    }
    if (e.key == 'setStyle_black') {
      map.setMapType(window.BMAP_NORMAL_MAP);
      map.setMapStyleV2({ styleJson: darkStyle });
    }
    if (e.key == 'setStyle_white') {
      map.setMapType(window.BMAP_NORMAL_MAP);
      map.setMapStyleV2({ styleJson: snowStyle });
    }
    if (e.key == 'setStyle_satellite') {
      map.setMapType(window.BMAP_SATELLITE_MAP);
    }
    if (e.key == 'setStyle_satellite_earth') {
      map.setMapType(window.BMAP_EARTH_MAP);
    }

  }

  const [activepage, setactivepage] = useState('GeoJSONview')

  const [collapsedpanel, setcollapsedpanel] = useState(true)

  return (
    <Sider
      width={collapsedpanel ? '45%' : '50px'}
      className="panel"
    >
      <Layout>
        {collapsedpanel ? <PageHeader
          className="site-page-header"
          key="site-page-header"
          title="GeoJSON Viewer"
          subTitle=''
          avatar={{ src: 'images/logodark_3durbanmob.png', shape: 'square' }}
          extra={[
            <div key='settings1'>
              <Dropdown key='settings' menu={{
                items: mapstylemenu,
                onClick: handleMenuClick,
              }}>
                <Button key='Settingbuttom' type="text" >
                  <SettingOutlined />
                </Button>
              </Dropdown>
              <Button key='navicollapsed' type="text" onClick={() => { setcollapsedpanel(!collapsedpanel) }}>
                {React.createElement(collapsedpanel ? UpOutlined : DownOutlined)}
              </Button>
            </div>
          ]}
        /> : <Button key='navicollapsed' type="text" onClick={() => { setcollapsedpanel(!collapsedpanel) }}>
          {React.createElement(collapsedpanel ? UpOutlined : DownOutlined)}
        </Button>}
        <div style={collapsedpanel ? {} : { height: '0px', overflowY: 'hidden' }}>
          <Layout>
            <Content>
              <Tabs tabPosition="left" size='small' renderTabBar={(a, b) => cardmenu} activeKey={activepage}>
                <TabPane key="GeoJSONview" >
                  <GeoJSONview />
                </TabPane>
              </Tabs>
            </Content>
          </Layout>
        </div>
      </Layout>
    </Sider>
  )
}
