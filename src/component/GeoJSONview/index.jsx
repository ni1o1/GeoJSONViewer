import React, { useEffect, useState, useCallback } from 'react'
import { Col, Card, Tooltip, ColorPicker, Button, Table, Collapse, Upload, message, InputNumber } from 'antd';
import {
    InfoCircleOutlined, InboxOutlined, DeleteFilled, DownloadOutlined, EyeOutlined, EyeInvisibleOutlined
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import * as turf from '@turf/turf';
import { addCustomLayers, removeCustomLayers, setTooltip, setGeojsonEditTooltip } from '../../Store/modules/BMap';
import { downloadFile } from '@/utils/downloadFile';
import { bd09towgs84, bd09mctobd09 } from '@/utils/coordtransform';
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
    const setGeojsonEditTooltip_redux = (data) => {
        dispatch(setGeojsonEditTooltip(data));
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
                        opacity: 0.8,               // 图层透明度
                        level: -10,                // 显示层级，由于系统内部问题，GeoJSONLayer图层等级使用负数表达，负数越大层级越高，默认-99
                        minZoom: 1,               // 设置图层显示的地图最小等级
                        maxZoom: 30,                // 设置图层显示的地图最大等级
                        polylineStyle: function (properties) {
                            return {
                                fillColor: 'darkolivegreen',
                                fillOpacity: 0.8,
                                strokeColor: 'black',
                                strokeOpacity: 0.8,
                                strokeWeight: 2
                            }
                        },
                        polygonStyle: function (properties) {
                            return {
                                fillColor: 'darkolivegreen',
                                fillOpacity: 0.8,
                                strokeColor: 'black',
                                strokeOpacity: 0.8,
                                strokeWeight: 2
                            }
                        },
                        markerStyle: function (properties) {
                            return {

                            }
                        },
                    });
                    jsondataLayer.strokeColor = 'black'
                    jsondataLayer.fillColor = 'darkolivegreen'
                    jsondataLayer.fillOpacity = 0.8
                    jsondataLayer.strokeOpacity = 0.8
                    jsondataLayer.strokeWeight = 2

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
                            // 获取要素
                            const feature = e.features[0];
                            // 高亮要素
                            feature.setFillColor && feature.setFillColor('red')
                            feature.setStrokeColor && feature.setStrokeColor('red')
                            setTooltip_redux({
                                title: file.name,
                                x: e.pixel.x,
                                y: e.pixel.y,
                                show: true,
                                info: e.features[0].properties
                            })
                        }
                    })
                    jsondataLayer.addEventListener('click', function (e) {
                        if (e.features) {
                            // 获取要素
                            const feature = e.features[0];
                            if (feature._className == 'PolygonOut' || feature._className == 'PolylineOut') {
                                setGeojsonEditTooltip_redux({
                                    title: file.name,
                                    x: e.pixel.x,
                                    y: e.pixel.y,
                                    show: true,
                                    editItem: e.features[0]
                                })
                            }
                        }
                    })

                    jsondataLayer.addEventListener('mouseout', function (e) {
                        // 获取要素
                        // 取消高亮
                        jsondataLayer.getData().map(f => {
                            f.setFillColor && f.setFillColor(jsondataLayer.fillColor)
                        })
                        jsondataLayer.getData().map(f => {
                            f.setStrokeColor && f.setStrokeColor(jsondataLayer.strokeColor)
                        })
                        setTooltip_redux({
                            x: 0,
                            y: 0,
                            show: false,
                            info: {}
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
    const obj2geojson = (obj) => {
        var features = []
        console.log(obj)
        obj.map(f => {
            if (f._className == 'PolylineOut') {
                var feature = {
                    type: 'Feature',
                    properties: f.properties,
                    geometry: {
                        type: 'LineString',
                        coordinates: f.points.map(f => {
                            const bd09 = bd09mctobd09(f.lng, f.lat)
                            return bd09towgs84(bd09[0], bd09[1]).wgs84coord
                        })
                    }
                }
            } else if (f._className == 'PolygonOut') {
                var feature = {
                    type: 'Feature',
                    properties: f.properties,
                    geometry: {
                        type: 'Polygon',
                        coordinates: [f.points.map(f => {
                            const bd09 = bd09mctobd09(f.lng, f.lat)
                            return bd09towgs84(bd09[0], bd09[1]).wgs84coord
                        })]
                    }
                }
            } else if (f._className == 'MarkerOut') {
                var feature = {
                    type: 'Feature',
                    properties: f.properties,
                    geometry: {
                        type: 'Point',
                        coordinates: bd09towgs84(f.lng, f.lat).wgs84coord
                    }
                }
            }

            features.push(feature)
        })
        return {
            type: 'FeatureCollection',
            features: features
        }
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
                        <Panel header="图层管理" key="Layers" style={{ overflowY: 'scroll' }}>
                            <Table size='small' columns={[
                                {
                                    title: '文件',
                                    dataIndex: 'layerName',
                                    key: 'layerName',
                                    render: text => text
                                },
                                {
                                    title: '要素数',
                                    dataIndex: 'overlayData',
                                    key: 'overlayData',
                                    render: text => text
                                },
                                {
                                    title: '层级',
                                    dataIndex: 'level',
                                    key: 'level',
                                    render: (text, record) => (
                                        <InputNumber min={0} max={10} defaultValue={text} size='small'
                                            style={{ width: '40px' }} onChange={(value) => {
                                                const layer = customlayers.filter(item => item.layerName == record.layerName)[0]
                                                layer && layer.setLevel(value - 15)
                                            }} />
                                    )
                                },

                                {
                                    title: '边粗细',
                                    key: 'StrokeWeight',
                                    render: (text, record) => {
                                        const layer = customlayers.filter(item => item.layerName == record.layerName)[0]
                                        return <InputNumber min={0} max={10} defaultValue={layer.strokeWeight} size='small'
                                            style={{ width: '40px' }}
                                            onChange={(value) => {
                                                layer.getData().map(f => {
                                                    f.setStrokeWeight && f.setStrokeWeight(value)
                                                })
                                                layer.strokeWeight = value
                                            }
                                            }></InputNumber>
                                    }
                                },
                                {
                                    title: '边颜色',
                                    key: 'color',
                                    render: (text, record) => {
                                        const layer = customlayers.filter(item => item.layerName == record.layerName)[0]
                                        return <ColorPicker defaultValue={layer.strokeColor} onChange={(color) => {
                                            layer.getData().map(f => {
                                                f.setStrokeColor && f.setStrokeColor(color.toHexString())
                                            })
                                            layer.strokeColor = color.toHexString()

                                            layer.getData().map(f => {
                                                f.setStrokeOpacity && f.setStrokeOpacity(color.metaColor.a)
                                            })
                                            layer.strokeOpacity = color.metaColor.a
                                        }} />
                                    }
                                },
                                {
                                    title: '填充色',
                                    key: 'color',
                                    render: (text, record) => {
                                        const layer = customlayers.filter(item => item.layerName == record.layerName)[0]
                                        return <ColorPicker defaultValue={layer.fillColor} onChange={(color) => {
                                            layer.getData().map(f => {
                                                f.setFillColor && f.setFillColor(color.toHexString())
                                            })
                                            layer.fillColor = color.toHexString()

                                            layer.getData().map(f => {
                                                f.setFillOpacity && f.setFillOpacity(color.metaColor.a)
                                            })
                                            layer.fillOpacity = color.metaColor.a
                                        }} />
                                    }
                                },
                                {
                                    title: '操作',
                                    key: 'action',
                                    render: (text, record) => (
                                        <span>
                                            <Button type="text" size="small" onClick={() => {
                                                const layer = customlayers.filter(item => item.layerName == record.layerName)[0]
                                                layer.setVisible(!layer.visible)
                                            }}
                                            >
                                                {customlayers.filter(item => item.layerName == record.layerName)[0].visible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                                            </Button>
                                            <Button type="text" size="small" onClick={() => {
                                                const layer = customlayers.filter(item => item.layerName == record.layerName)[0]
                                                const geojsonfile = obj2geojson(layer.getData())
                                                downloadFile(geojsonfile,
                                                    'Edited_' + record.layerName)
                                            }}>
                                                <DownloadOutlined />
                                            </Button>

                                            <Button type="text" size="small"
                                                onClick={() => {
                                                    const layer = customlayers.filter(item => item.layerName == record.layerName)[0]
                                                    layer && map.removeGeoJSONLayer(layer)
                                                    removeCustomLayers_redux(record.layerName)
                                                    setTooltip_redux({
                                                        x: 0,
                                                        y: 0,
                                                        show: false,
                                                        info: {}
                                                    })
                                                }}>
                                                <DeleteFilled />
                                            </Button>
                                        </span>
                                    ),
                                }
                            ]}

                                dataSource={customlayers.map((layer, index) => {
                                    return {
                                        layerName: layer.layerName,
                                        overlayData: layer.overlayData.length,
                                        level: layer.level + 15
                                    }
                                }).sort((a, b) => a.level - b.level)
                                } />
                        </Panel>
                    </Collapse>
                </Card>
            </Col>
        </>
    )

}