import { useRef } from "react"
import { useEffect } from "react"
import "cesiumRoot/Build/Cesium/Widgets/widgets.css"
import * as Cesium from 'cesium'
import style from './style.module.less'

window.Cesium = Cesium
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkYzAzYzE4NS0yZmJiLTQ5NzUtOWJlYS0zNjdkMzc2ODBmZDgiLCJpZCI6MjU5LCJpYXQiOjE3MTQ1NzE1MDN9.tIhlyfC7MHSWrQmoAqkvQdXMbg3igaC2HIbQp1HKCVM';
const Container = props => {
    const isCreateMap = props?.isCreateMap ?? true
    const ref = useRef(null)
    useEffect(() => {
        props.getElement && props.getElement(ref.current)
    }, [])

    useEffect(() => {
        if(isCreateMap) {
            const viewer = new Cesium.Viewer(ref.current)
            props.loadedMap && props.loadedMap(viewer)
        }
    }, [])
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