import { useRef, useState } from "react"
import { useEffect } from "react"
import "cesiumRoot/Build/Cesium/Widgets/widgets.css"
import * as Cesium from 'cesium'
import style from './style.module.less'
import {useInViewport} from 'ahooks'

window.Cesium = Cesium
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkYzAzYzE4NS0yZmJiLTQ5NzUtOWJlYS0zNjdkMzc2ODBmZDgiLCJpZCI6MjU5LCJpYXQiOjE3MTQ1NzE1MDN9.tIhlyfC7MHSWrQmoAqkvQdXMbg3igaC2HIbQp1HKCVM';
const Container = props => {
    const isCreateMap = props?.isCreateMap ?? true
    const mapOptions = props?.mapOptions || {}
    const ref = useRef(null)
    const [inViewport] = useInViewport(ref)
    const [loadMap , setLoadMap] = useState(false)

    useEffect(() => {
        if(!inViewport) return
        setLoadMap(true)
    }, [inViewport])

    useEffect(() => {
        props.getElement && props.getElement(ref.current)
    }, [])

    useEffect(() => {
        if(!loadMap) return
        if(isCreateMap) {
            const viewer = new Cesium.Viewer(ref.current, mapOptions)
            props.loadedMap && props.loadedMap(viewer)
        }
    }, [loadMap])
    return (<div style={{
        height : "500px",
        width : "100%",
        position : "relative"
    }}
        ref={ref}
    >
        <div className={style.main}>
            {props.children}
        </div>
    </div>)
}

export default Container