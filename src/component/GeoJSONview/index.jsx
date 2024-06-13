import React, { useEffect, useState, useCallback } from 'react'
import { Col, Card, Tooltip, Button, Table, Collapse, Upload, message, InputNumber } from 'antd';
import {
    InfoCircleOutlined, InboxOutlined
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import * as turf from '@turf/turf';
import { addCustomLayers, removeCustomLayers, setTooltip } from '../../Store/modules/BMap';
const { Dragger } = Upload;
const { Panel } = Collapse;
const BMapGL = window.BMapGL;
export default function ODview() {

    //redux
    const { map, customlayers } = useSelector((state) => state.BMap);

    const dispatch = useDispatch();

    const addCustomLayers_redux = (data) => {
        dispatch(addCustomLayers(data));
    }
    const removeCustomLayers_redux = (data) => {
        dispatch(removeCustomLayers(data));
    }
    const setTooltip_redux = (data) => {
        dispatch(setTooltip(data));
    }

    var colorBand = ['darkolivegreen', 'cadetblue', 'orange', 'red', 'tan'];

    const handleupload_geojson = (file) => {
        message.loading({ content: '读取数据中', key: 'readcsv', duration: 0 })
        return new Promise(resolve => {
            const reader = new FileReader();
            reader.readAsText(file)
            reader.onload = function (f) {
                const data = f.target.result
                if (file.name.slice(-4) == 'json') {
                    const jsondata = JSON.parse(data)



                    //geojson图层
                    const jsondataLayer = new BMapGL.GeoJSONLayer(file.name, {
                        reference: 'WGS84',
                        dataSource: jsondata,         // 数据
                        level: -10,                // 显示层级，由于系统内部问题，GeoJSONLayer图层等级使用负数表达，负数越大层级越高，默认-99
                        minZoom: 1,               // 设置图层显示的地图最小等级
                        maxZoom: 30,                // 设置图层显示的地图最大等级
                        polylineStyle: function (properties) {
                            return {
                                strokeColor: 'blue'
                            }
                        },
                        polygonStyle: function (properties) {
                            var index = properties.join || 0;
                            return {
                                fillColor: colorBand[index]
                            }
                        },
                        markerStyle: function (properties) {
                            return {
                            }
                        },
                    });
                    jsondataLayer.addEventListener('mousemove', function (e) {
                        if (e.features.length == 0) {
                            setTooltip_redux({
                                title: file.name,
                                x: 0,
                                y: 0,
                                show: false,
                                info: {}
                            })
                        } else {
                            setTooltip_redux({
                                title: file.name,
                                x: e.pixel.x,
                                y: e.pixel.y,
                                show: true,
                                info: e.features[0].properties
                            })
                        }
                    })
                    jsondataLayer.addEventListener('mouseout', function (e) {

                        setTooltip_redux({
                            x: 0,
                            y: 0,
                            show: false,
                            info: { 'a': 'a' }
                        })
                    })
                    //添加图层
                    map.addGeoJSONLayer(jsondataLayer);
                    addCustomLayers_redux(jsondataLayer)

                    //跳转到数据范围
                    var bbox = turf.bbox(jsondata);
                    map.setViewport([new BMapGL.Point(bbox[0], bbox[1]), new BMapGL.Point(bbox[2], bbox[3])]);
                }
                message.destroy('readcsv')
            }
        })
    }

    return (
        <>
            <Col span={24}>
                <Card title="Data" extra={<Tooltip title='Import OD data to show flow map'><InfoCircleOutlined /></Tooltip>}
                    bordered={false}>
                    <Collapse defaultActiveKey={['ImportData', 'Layers']}>
                        <Panel header="导入GeoJSON数据" key="ImportData">

                            <Dragger maxCount={1} beforeUpload={handleupload_geojson} >
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined />
                                </p>
                                <p className="ant-upload-text">点击或将GeoJSON数据拖到此处</p>
                                <p className="ant-upload-hint">
                                    数据默认使用WGS84坐标系
                                </p>
                            </Dragger>
                        </Panel>
                        <Panel header="图层管理" key="Layers">
                            <Table size='small' columns={[
                                {
                                    title: '图层',
                                    dataIndex: 'layerName',
                                    key: 'layerName',
                                    render: text => text
                                },
                                {
                                    title: '要素数量',
                                    dataIndex: 'overlayData',
                                    key: 'overlayData',
                                    render: text => text
                                },
                                {
                                    title: '层级',
                                    dataIndex: 'level',
                                    key: 'level',
                                    render: (text, record) => (
                                        <InputNumber min={0} max={10} defaultValue={text} onChange={(value) => {
                                            const layer = customlayers.filter(item => item.layerName == record.layerName)[0]
                                            layer && layer.setLevel(value - 15)
                                        }} />
                                    )
                                },
                                {
                                    title: '操作',
                                    key: 'action',
                                    render: (text, record) => (
                                        <span>
                                            <a onClick={() => {
                                                const layer = customlayers.filter(item => item.layerName == record.layerName)[0]
                                                layer && map.removeGeoJSONLayer(layer)
                                                removeCustomLayers_redux(record.layerName)
                                            }}>删除</a>
                                        </span>
                                    ),
                                },
                            ]}
                                onRow={(record) => {
                                    return {
                                        onMouseEnter: () => {
                                            const layer = customlayers.filter(item => item.layerName == record.layerName)[0]
                                            layer.setLevel(record.level + 15)

                                        },
                                        onMouseLeave: () => {
                                            const layer = customlayers.filter(item => item.layerName == record.layerName)[0]
                                            layer.setLevel(record.level - 15)
                                            layer.resetStyle()
                                        },
                                    }
                                }}
                                dataSource={customlayers.map((layer, index) => {
                                    return {
                                        layerName: layer.layerName,
                                        overlayData: layer.overlayData.length,
                                        level: layer.level + 15
                                    }
                                }).sort((a, b) => a.level - b.level)
                                } />
                            <Button onClick={() => { console.log(customlayers) }}>显示</Button>
                        </Panel>
                    </Collapse>
                </Card>
            </Col>
        </>
    )

}