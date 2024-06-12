import React, { useEffect, useState, useCallback } from 'react'
import { Col, Card, Tooltip, Row, Collapse, Upload, message } from 'antd';
import {
    InfoCircleOutlined, InboxOutlined
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import * as turf from '@turf/turf';
const { Dragger } = Upload;
const { Panel } = Collapse;
const BMapGL = window.BMapGL;
export default function ODview() {

    const { map } = useSelector((state) => state.BMap);

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
                    console.log(file.name)



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

                    //添加图层
                    map.addGeoJSONLayer(jsondataLayer);

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
                    <Collapse defaultActiveKey={['ImportOD', "Settings", 'Layers']}>
                        <Panel header="导入GeoJSON数据" key="ImportOD">
                            <Row gutters={4}>
                                <Col>
                                    <Dragger maxCount={1} beforeUpload={handleupload_geojson} >
                                        <p className="ant-upload-drag-icon">
                                            <InboxOutlined />
                                        </p>
                                        <p className="ant-upload-text">点击或将GeoJSON数据拖到此处</p>
                                        <p className="ant-upload-hint">
                                            数据默认使用WGS84坐标系
                                        </p>
                                    </Dragger>
                                </Col>
                            </Row>
                        </Panel>
                    </Collapse>
                </Card>
            </Col>
        </>
    )

}