import { Select, Space } from 'antd';
import { Cesium3DTile, Cesium3DTileset, HeadingPitchRange, Viewer , Math, ScreenSpaceEventHandler, ScreenSpaceEventType, Cesium3DTileFeature, defined, Color, Cartesian3, HeadingPitchRoll, PostProcessStage, PostProcessStageLibrary, EllipsoidTerrainProvider, Cartesian2, HorizontalOrigin, VerticalOrigin} from 'cesium';
import Container from '../components/Container';
import { useRef , useState , useEffect } from 'react';


const Billboard = props => {
    const viewerRef = useRef(null);

    const [type, setType] = useState("addBillBoard")
    const [viewer , setViewer] = useState(null)

    const data = [{
        name : "添加广告牌",
        value : "addBillBoard"
    }, {
        name : "设置广告牌",
        value : "setBillBoard"
    }]

    /**
     * 
     * @param {Viewer} viewer 
     */
    const loadedMap = (viewer) => {
        viewerRef.current = viewer
        setViewer(viewer)
    }

    const reset = () => {
        viewer.camera.flyHome(0);
        viewer.entities.removeAll()
        viewer.scene.terrainProvider = new EllipsoidTerrainProvider()
        viewer.scene.globe.depthTestAgainstTerrain = false
    }

    useEffect(() => {
        if(!viewer) return
        const image = "/images/Cesium_Logo_Color_Overlay.png"

        /**
         * 
         * @param {Viewer} viewer 
         */
        const updateBillBoard = viewer => {
           reset()
            if(type == "addBillBoard") {
                const entity = viewer.entities.add({
                    position: Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883),
                    billboard: {
                      image,
                      width: 100, // default: undefined
                      height: 25, // default: undefined
                      sizeInMeters : false,
                      horizontalOrigin : HorizontalOrigin.CENTER,
                      verticalOrigin : VerticalOrigin.BOTTOM
                    },
                  });
                  viewer.zoomTo(entity);
            } else if(type == "setBillBoard") {
                viewer.entities.add({
                    position : Cartesian3.fromDegrees(-75, 40),
                    billboard : {
                        image,
                        show : true,
                        pixelOffset : new Cartesian2(0, -50),
                        eyeOffset : Cartesian3.ZERO,
                        horizontalOrigin: Cesium.HorizontalOrigin.BOTTOM, // default
                        verticalOrigin: Cesium.VerticalOrigin.BOTTOM, // default: CENTER
                        scale: 2.0, // default: 1.0
                        color: Color.YELLOW, // default: WHITE
                        rotation: Cesium.Math.PI_OVER_FOUR, // default: 0.0
                        alignedAxis: Cesium.Cartesian3.ZERO, // default
                        width: 100, // default: undefined
                        height: 25, // default: undefined
                    }
                })
            }
        }

        updateBillBoard(viewer)
    }, [type, viewer])

    return (<Container loadedMap={loadedMap}>
        <Select value={type} onChange={e => {
            setType(e)
        }}>
            {
                data.map(item => <Select.Option key={item.value}>
                    {item.name}
                </Select.Option>)
            }
        </Select>
    </Container>)
}

export default Billboard