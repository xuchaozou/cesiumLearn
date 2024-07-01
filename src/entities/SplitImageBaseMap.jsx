import { Checkbox, Slider, Space } from 'antd';
import { Cesium3DTile, Cesium3DTileset, HeadingPitchRange, Viewer , Math, ScreenSpaceEventHandler, ScreenSpaceEventType, Cesium3DTileFeature, defined, Color, Cartesian3, HeadingPitchRoll, PostProcessStage, PostProcessStageLibrary, ImageryLayer, IonImageryProvider, SplitDirection} from 'cesium';
import Container from '../components/Container';
import { useRef , useState , useEffect } from 'react';


const SplitImageBaseMap = props => {
    const viewerRef = useRef(null);
    const [splitNumber , setSplitNumber] = useState(50)
    const [showBingMapLabel , setShowBingMapLabl] = useState(true)
    /**
     * 
     * @param {Viewer} viewer 
     */
    const loadedMap = (viewer) => {
       const layers = viewer.imageryLayers

       const bingMapsAerialWithLabels = ImageryLayer.fromProviderAsync(IonImageryProvider.fromAssetId(3))

       bingMapsAerialWithLabels.splitDirection = SplitDirection.LEFT

       layers.add(bingMapsAerialWithLabels)

       const bingMapsAerial = ImageryLayer.fromProviderAsync(IonImageryProvider.fromAssetId(2))

       bingMapsAerial.splitDirection = SplitDirection.RIGHT

       layers.add(bingMapsAerial)

       const imageryLayer = ImageryLayer.fromProviderAsync(IonImageryProvider.fromAssetId(3827))

       viewer.imageryLayers.add(imageryLayer)

       const bingMapsLabelsOnly = ImageryLayer.fromProviderAsync(IonImageryProvider.fromAssetId(2411391))

       bingMapsLabelsOnly.splitDirection = SplitDirection.RIGHT
       layers.add(bingMapsLabelsOnly)

       viewer.zoomTo(imageryLayer)

       viewerRef.current = viewer
    }

    useEffect(() => {
        if(!viewerRef.current) return  
        viewerRef.current.scene.splitPosition = splitNumber / 100
    }, [splitNumber])

    return (<Container loadedMap={loadedMap}>
        <Space
            size={5}
        >
            <Space
                size={5}            
            >
                分屏比例：
                <Slider style={{
                    width : "150px"
                }} value={splitNumber} min={0} max={100} onChange={e => {setSplitNumber(e)}}/>
            </Space>
            <Checkbox value={showBingMapLabel} onChange={e => {setShowBingMapLabl(e.target.checked)}}>显示show bing maps label</Checkbox>
        </Space>
    </Container>)
}

export default SplitImageBaseMap