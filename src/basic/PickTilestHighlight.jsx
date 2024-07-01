import { Space } from 'antd';
import { Cesium3DTile, Cesium3DTileset, HeadingPitchRange, Viewer , Math, ScreenSpaceEventHandler, ScreenSpaceEventType, Cesium3DTileFeature, defined, Color, Cartesian3, HeadingPitchRoll, PostProcessStage, PostProcessStageLibrary} from 'cesium';
import Container from '../components/Container';
import { useRef , useState , useEffect } from 'react';


const PickTilestHighlight = props => {
    const viewerRef = useRef(null);
    const selectedRef = useRef(null)

    const loadedMap = (viewer) => {
        viewerRef.current = viewer
        load3dTiles(viewer)
    }

    const resetDiv = () => ({
        left : -99999,
        top : -99999,
        data : []
    })

    const [divInfo , setDivInfo] = useState(() => resetDiv())

    /**
     * 
     * @param {Viewer} viewer 
     */
    const load3dTiles = async (viewer) => {
        const initPosition = Cartesian3.fromDegrees(
            -74.018,
            40.691,
            753
        )
        const initOrientation = new HeadingPitchRoll.fromDegrees(
            21.27,
            -21.34,
            0.07
        )
        viewer.scene.camera.flyTo({
            destination : initPosition,
            orientation : initOrientation
        })
        const tilest = await Cesium3DTileset.fromIonAssetId(75343)
        viewer.scene.primitives.add(tilest)

        selectedRef.current = {
            feature : undefined,
            originColor : new Color()
        }

        const clickHandler = viewer.screenSpaceEventHandler.getInputAction(ScreenSpaceEventType.LEFT_CLICK)

        if(!PostProcessStageLibrary.isSilhouetteSupported(viewer.scene)) return

        const silhouetteBlue = PostProcessStageLibrary.createEdgeDetectionStage();
        silhouetteBlue.uniforms.color = Color.BLUE;
        silhouetteBlue.uniforms.length = 0.01
        silhouetteBlue.selected = []

        const silhouetteGreen = PostProcessStageLibrary.createEdgeDetectionStage()
        silhouetteGreen.uniforms.color = Color.LIME;
        silhouetteGreen.uniforms.length = 0.01
        silhouetteGreen.selected = []

        viewer.scene.postProcessStages.add(PostProcessStageLibrary.createSilhouetteStage([
            silhouetteBlue,
            silhouetteGreen
        ]))

        viewer.screenSpaceEventHandler.setInputAction(movement => {
            silhouetteBlue.selected = []

            const pickedFeature = viewer.scene.pick(movement.endPosition)

            if(!defined(pickedFeature)) return

            updateNameOverlay(pickedFeature , movement.endPosition)
            if(pickedFeature != selectedRef.current.feature) {
                silhouetteBlue.selected = [pickedFeature]
            }

        }, ScreenSpaceEventType.MOUSE_MOVE)

        viewer.screenSpaceEventHandler.setInputAction(movement => {
            silhouetteGreen.selected = []

            const pickedFeature = viewer.scene.pick(movement.position)

            if(!defined(pickedFeature)) {
                clickHandler(movement)
                return
            }

            if(silhouetteGreen.selected[0] == pickedFeature) return

            const hightLightFeature = silhouetteBlue.selected[0]

            if(hightLightFeature == pickedFeature) {
                silhouetteBlue.selected = []
            }

            silhouetteGreen.selected = [pickedFeature]


        }, ScreenSpaceEventType.LEFT_CLICK)
    }

    
    const updateNameOverlay = (pickedFeature, position) => {
        if(!defined(pickedFeature)) {
            setDivInfo(resetDiv())
            return
        }
        const data =  pickedFeature.getPropertyIds().map(id => ({
            name : id,
            value :  pickedFeature.getProperty(id)
        }))

        setDivInfo({
            left : position.x,
            top : position.y,
            data
        })
    }


    return (<Container loadedMap={loadedMap}>
        <div
            style={{
                position : "absolute",
                left : divInfo.left + 'px',
                top : divInfo.top + 'px',
                pointerEvents : "none",
                background : "rgba(0,0,0,.5)"
            }}
        >
            {
                divInfo.data.map(data => <li
                    key={data.name}
                >
                    {data.name} : {data.value}
                </li>)
            }
        </div>
    </Container>)
}

export default PickTilestHighlight