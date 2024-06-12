
import React, { useState, useEffect } from 'react'
import { Tabs, Layout, Button, Menu, Switch } from 'antd';
import ODview from '../ODview';
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
      defaultSelectedKeys={['ODview']}
      style={{
        borderRight: 0,
        'overflowX': 'hidden',
        'overflowY': 'auto'
      }}
    >
      <SubMenu key="sub1" icon={<NodeIndexOutlined />} title="OD view">
        <Menu.Item key="ODview" icon={<NodeIndexOutlined />}>OD view</Menu.Item>
      </SubMenu>
    </Menu>
    <Button type="text" onClick={() => { setcollapsedmenu(!collapsedmenu) }} style={{ margin: '10px 16px' }}>
      {React.createElement(collapsedmenu ? MenuUnfoldOutlined : MenuFoldOutlined)}
    </Button>
  </Sider>)

  const mapstylemenu = (<Menu>
    <SubMenu key='Mapstyle' title="地图样式" icon={<GlobalOutlined />}>
      <Menu.Item key="dark2" onClick={() => {
        map.setMapType(window.BMAP_NORMAL_MAP);
        map.setMapStyleV2({
          styleId: '88bb82d188d05be79684da3ff4804500'
        });
      }}>出行（普通）</Menu.Item>
      <Menu.Item key="dark" onClick={() => {
        map.setMapType(window.BMAP_NORMAL_MAP);
        map.setMapStyleV2({
          styleId: '15bdc45ed0d678b574193de0bf9fe90a'
        });
      }}>绿野仙踪（黑黄）</Menu.Item>
      <Menu.Item key="light" onClick={() => {
        map.setMapType(window.BMAP_NORMAL_MAP);
        map.setMapStyleV2({
          styleId: '2513dfec28fbb53186fb16eef8188a99'
        });
      }}>一蓑烟雨（灰）</Menu.Item>
      <Menu.Item key="light2" onClick={() => {
        map.setMapType(window.BMAP_NORMAL_MAP);
        map.setMapStyleV2({
          styleId: '95f1127ddd47c9481828a675b1765a8b'
        });
      }}>物流（白橙）</Menu.Item>
      <Menu.Item key="darkstyle" onClick={() => {
        map.setMapType(window.BMAP_NORMAL_MAP);
        map.setMapStyleV2({ styleJson: darkStyle });
      }}>黑</Menu.Item>
      <Menu.Item key="snowStyle" onClick={() => {
        map.setMapType(window.BMAP_NORMAL_MAP);
        map.setMapStyleV2({ styleJson: snowStyle });
      }}>白</Menu.Item>
      <Menu.Item key="satellite" onClick={() => {
        map.setMapType(window.BMAP_SATELLITE_MAP);
      }}>卫星地图（普通）</Menu.Item>
      <Menu.Item key="satellite_earth" onClick={() => {
        map.setMapType(window.BMAP_EARTH_MAP);
      }}>卫星地图（地球）</Menu.Item>
    </SubMenu>
  </Menu>
  );
  const [activepage, setactivepage] = useState('ODview')

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
              <Dropdown key='settings' overlay={mapstylemenu} trigger={['click']}>
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
                <TabPane key="ODview" >
                  <ODview />
                </TabPane>
              </Tabs>
            </Content>
          </Layout>
        </div>
      </Layout>
    </Sider>
  )
}
