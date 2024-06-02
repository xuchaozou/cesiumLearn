import Container from "../components/Container"
// import * as Cesium from 'cesium/Build/CesiumUnminified/index'
// import "cesium/Build/CesiumUnminified/Cesium"
import {Viewer} from 'cesium'
import { Button } from "antd"
import { useRef } from "react"

const LoadModel = props => {

    const viewerRef = useRef(null)

    const loadedMap = viewer => {
        viewerRef.current = viewer
    }

    const addModel = () => {
        console.log(111)
    }

    return <Container loadedMap = {loadedMap}>
        <Button type="primary" onClick={addModel}>加载模型</Button>
    </Container>
}

export default LoadModel