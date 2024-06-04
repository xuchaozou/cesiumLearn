import Container from "../components/Container"
import {Cartesian3, Viewer , Math, HeadingPitchRoll, Transforms, Cartographic} from 'cesium'
import { Button, Slider, Space } from "antd"
import { useEffect, useRef, useState } from "react"

const LoadModel = props => {

    const viewerRef = useRef(null)

    const [info , setInfo] = useState({
        height : 0,
        heading : 0
    })

    /**
     * 
     * @param {Viewer} viewer
     *  
     */
    const loadedMap = viewer => {
        viewerRef.current = viewer
        // viewer.camera.flyTo({
        //     destination : Cartesian3.fromDegrees(117, 30 , 100),
        // })
        viewer.entities.removeAll()
        const position = Cartesian3.fromDegrees(-123.07 , 44.05, info.height)
        const heading = Math.toRadians(info.heading)
        const pitch = Math.toRadians(0)
        const roll = Math.toRadians(0)
        const hpr = new HeadingPitchRoll(heading, pitch, roll)
        const orientation = Transforms.headingPitchRollQuaternion(position , hpr)

        const entity = viewer.entities.add({
            id : "car",
            name : "car",
            position,
            orientation,
            model : {
                uri : "/models/CesiumMilkTruck/CesiumMilkTruck.glb",
                // minimumPixelSize : 128,
                maximumScale :2000
            }
        })

        viewer.trackedEntity = entity
    }

    const addModel = () => {
        console.log(111)
    }

    const changeValue = (attr , value) => {
        setInfo(info => ({
            ...info,
            [attr] : value
        }))
    }

    useEffect(() => {
        const {height, heading} = info
        if(!viewerRef.current) return
        const entity =  viewerRef.current.entities.getById("car")
        const cartographic = Cartographic.fromCartesian(entity.position._value)
        const lng = Math.toDegrees(cartographic.longitude)
        const lat = Math.toDegrees(cartographic.latitude)
        const cartesian3 = Cartesian3.fromDegrees(lng, lat, height)
        entity.position = cartesian3

        const heading_ = Math.toRadians(heading)
        const pitch = Math.toRadians(0)
        const roll = Math.toRadians(0)
        const hpr = new HeadingPitchRoll(heading_, pitch, roll)
        const orientation = Transforms.headingPitchRollQuaternion(cartesian3 , hpr)
        entity.orientation = orientation

    }, [info])

    return <Container loadedMap = {loadedMap}>
        <Space
            direction="vertical"
            size={10}
        >
            <Space
                direction="horizontal"
                size={5}
            >
                <span>高度:</span>
                <Slider min={0} max={300} value={info.height} step={1} onChange={changeValue.bind(this, "height")} style={{
                    width : "300px"
                }}/>
            </Space>
            <Space
                direction="horizontal"
                size={5}
            >
                <span>朝向:</span>
                <Slider min={0} max={360} value={info.heading} step={1} onChange={changeValue.bind(this, "heading")} style={{
                    width : "300px"
                }}/>
            </Space>
        </Space>
    </Container>
}

export default LoadModel