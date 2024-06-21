
import React, { useState, useRef, useEffect } from 'react'
import Draggable, { DraggableCore } from "react-draggable";
import './index.css'

import { useDispatch, useSelector } from 'react-redux';
const BMapGL = window.BMapGL;
function Compass() {


    const { map,compass } = useSelector((state) => state.BMap);


    
    
    
    return (
        <Draggable
            handle=".drag-handler2"
            defaultPosition={{
                x: 300,
                y: window.innerHeight-120

            }}
            position={null}
            scale={1}
        >
            <div>
                <div className='drag-handler2' style={{
                    position: 'absolute',
                    //背景颜色
                    backgroundColor: 'rgba(0,0,0,0)',
                    width: '60px',
                    height: '100px',
                    top: '0px',
                    zIndex: 999,
                }} />
                <div className='compass' style={{
                    display: true ? 'block' : 'none',
                    zIndex: 998,
                }}>
                    <img src="images/compass.png" alt=""
                        style={{ 
                            display: 'inline-block',
                            width: 30 }}
                    />
                     <div style={{
                        display: 'inline-block',
                        width: `20px`,
                        height: '10px',
                    }}/>
                    <div style={{
                        display: 'inline-block',
                        width: `${compass.width}px`,
                        height: '10px',
                        backgroundColor: 'white',
                        border: '1px solid black',
                    }}/>
                    <div style={{
                           display: 'inline-block',
                        width: `${compass.width}px`,
                        height: '10px',
                        backgroundColor: 'black',
                        border: '1px solid black',
                    }}/>
                    <div style={{
                        position: 'relative',
                        left: '10px',
                         display: 'inline-block',
                         fontFamily: 'Arial',
                         color: 'black',
                         fontSize: '15px',
                    }}>{compass.unit}</div>
                    <div 
                    style={{
                        position: 'absolute',
                        top: '40px',
                        fontFamily: 'Arial',
                        color: 'black',
                        fontSize: '15px',
                         left: `${compass.width+25+30}px`,
                    }}>{1*compass.length}</div>
                    <div style={{
                        position: 'absolute',
                        top: '40px',
                        fontFamily: 'Arial',
                        color: 'black',
                        fontSize: '15px',
                         left: `${compass.width*2+25+30}px`,
                    }}>{2*compass.length}</div>
                </div>
            </div>

        </Draggable>
    )
}
export default Compass;