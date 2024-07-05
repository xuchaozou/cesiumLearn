import { Space } from 'antd';
import { Cesium3DTile, BoxGeometry,VertexFormat,GeometryInstance,
    MaterialAppearance,Material,Primitive,
     Transforms, Cesium3DTileset, HeadingPitchRange, Viewer , Math, ScreenSpaceEventHandler, ScreenSpaceEventType, Cesium3DTileFeature, defined, Color, Cartesian3, HeadingPitchRoll, PostProcessStage, PostProcessStageLibrary} from 'cesium';
import Container from '../components/Container';
import { useRef , useState , useEffect } from 'react';


const Template = props => {
    const viewerRef = useRef(null);

    /**
     * 
     * @param {Viewer} viewer 
     */
    const loadedMap = (viewer) => {
       
    }

    return (<Container loadedMap={loadedMap}> </Container>)
}

export default Template