
import React, { useState, useRef, useEffect } from 'react'
import Draggable, { DraggableCore } from "react-draggable";


import { useDispatch, useSelector } from 'react-redux';


function Legend() {


    const { map, legend } = useSelector((state) => state.BMap);

    return legend.length > 0 && (
        <Draggable
            handle=".drag-handler3"
            defaultPosition={{
                x: window.innerWidth - 300,
                y: 20

            }}
            position={null}
            scale={1}
        >
            <div>
                <div className='drag-handler3' style={{
                    position: 'absolute',
                    //背景颜色
                    backgroundColor: 'rgba(0,0,0,0)',
                    width: '100px',
                    height: '40px',
                    top: '0px',
                    zIndex: 999,
                }} />
                <div className='tooltip' id='geojson_item_tooltip' style={{
                    left: 0,
                    top: 0,
                    position: 'absolute',
                    display: true ? 'block' : 'none',
                    zIndex: 998,
                }}>
                    <div className='tooltip-title' style={{
                        fontFamily: 'Arial',
                        fontSize: '20px',
                    }}>
                        Legend
                    </div>
                    <div className='tooltip-content' style={{
                        fontFamily: 'Arial',
                        fontSize: '15px',

                    }}>
                        {legend.map((layer, index) => {
                            return <div key={index} style={{
                                display: 'flex',
                                alignItems: 'center', // 这是关键属性，用于垂直居中
                              }}
                            >
                                {layer.geoType == 'LineString' && <div style={{
                                    display: 'inline-block',
                                    alignItems: 'center',
                                    width: '20px',
                                    height: '3px',
                                    backgroundColor: layer.strokeColor,
                                    margin: '5px 5px 5px 5px',
                                }} />}
                                {layer.geoType == 'Point' && <div style={{
                                    display: 'inline-block',
                                    alignItems: 'center',
                                    width: '10px',
                                    height: '10px',
                                    borderRadius: '50%',
                                    backgroundColor: layer.strokeColor,
                                   marginLeft: '10px',
                                    marginRight: '10px',
                                    marginTop: '5px',
                                    marginBottom: '5px',
                                }} />}
                                {(['Polygon','MultiPolygon'].indexOf(layer.geoType) != -1) && <div style={{
                                    display: 'inline-block',
                                    alignItems: 'center',
                                    width: '16px',
                                    height: '10px',
                                    backgroundColor: layer.fillColor,
                                    border: `2px solid ${layer.strokeColor}`,
                                    margin: '5px 5px 5px 5px',
                                }} />}
                                <span className='tooltip-key' >{layer.nickName}</span>
                            </div>
                        })}
                    </div>
                </div>
            </div>

        </Draggable>
    )
}
export default Legend;