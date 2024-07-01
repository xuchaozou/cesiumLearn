import { Space } from 'antd';
import { Cesium3DTile, CallbackProperty,  Cesium3DTileset, HeadingPitchRange, Viewer , Math, ScreenSpaceEventHandler, ScreenSpaceEventType, Cesium3DTileFeature, defined, Color, Cartesian3, HeadingPitchRoll, PostProcessStage, PostProcessStageLibrary, JulianDate, Ellipsoid, Cartographic, Cartesian2, EllipsoidGeodesic} from 'cesium';
import Container from '../components/Container';
import { useRef , useState , useEffect } from 'react';


const CallBackProertyCom = props => {
    const viewerRef = useRef(null);

    /**
     * 
     * @param {Viewer} viewer 
     */
    const loadedMap = (viewer) => {
       viewer.clock.shouldAnimate = true

        const startLat = 35, startLon = -120;
        let endLon
        const startTime = Cesium.JulianDate.now();
        const redLine = viewer.entities.add({
            polyline : {
                positions : new CallbackProperty((time , result ) => {
                    endLon = startLon + 0.001 * JulianDate.secondsDifference(time, startTime)
                    return Cartesian3.fromDegreesArray(
                        [startLon, startLat, endLon , startLat],
                        Ellipsoid.WGS84
                    )
                }, false),
                width : 5,
                material : Color.RED
            }
        })

        const startCartgoraphic = Cartographic.fromDegrees(
            startLon,
            startLat
        )

        let endCartographic = new Cartographic()
        const scratch = new Cartographic()
        const geodesic = new EllipsoidGeodesic()

        const getLength = (time, result) => {
            const endPoint = redLine.polyline.positions.getValue(time, result)[1]
            endCartographic = Cartographic.fromCartesian(endPoint)
            geodesic.setEndPoints(startCartgoraphic, endCartographic)
            const length = window.Math.round(geodesic.surfaceDistance)
            return `${(length / 1000).toFixed(1)}km`
        }

        const getMidPoint = (time, result) => {
            const endPoint = redLine.polyline.positions.getValue(time , result)[1]
            endCartographic = Cartographic.fromCartesian(endPoint)
            geodesic.setEndPoints(startCartgoraphic, endCartographic)
            const midPointCartographic = geodesic.interpolateUsingFraction(
                0.5,
                scratch
            )
            return Cartesian3.fromRadians(midPointCartographic.longitude, midPointCartographic.latitude)
        }

        const label = viewer.entities.add({
            position : new CallbackProperty(getMidPoint, false),
            label : {
                text : new CallbackProperty(getLength , false),
                font : "20px",
                pixelOffset : new Cartesian2(0, 20)
            }
        })

        viewer.trackedEntity = label
    }

    return (<Container loadedMap={loadedMap}> </Container>)
}

export default CallBackProertyCom