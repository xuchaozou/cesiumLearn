import { Space } from 'antd';
import { Cesium3DTile, Cesium3DTileset, HeadingPitchRange, Viewer , Math, ScreenSpaceEventHandler, ScreenSpaceEventType, Cesium3DTileFeature, defined, Color, Cartesian3, HeadingPitchRoll} from 'cesium';
import Container from '../components/Container';
import { useRef , useState , useEffect } from 'react';


const PickTilestHighlight = props => {
    const viewerRef = useRef(null);

    const loadedMap = (viewer) => {
        viewerRef.current = viewer
        load3dTiles(viewer)
    }

    /**
     * 
     * @param {Viewer} viewer 
     */
    const load3dTiles = (viewer) => {
        const initPosition = Cartesian3.fromDegrees(
            -74.018,
            40.691,
            753
        )
        const initOrientation = new HeadingPitchRoll(
            21.27,
            -21.34,
            0.07
        )
        viewer.scene.camera.flyTo({
            destination : initPosition,
            orientation : initOrientation
        })
    }

    return (<Container loadedMap={loadedMap}>

    </Container>)
}

export default PickTilestHighlight