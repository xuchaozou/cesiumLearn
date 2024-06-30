import { Select, Space } from 'antd';
import { Cesium3DTile, Cesium3DTileset, HeadingPitchRange, Viewer , Math, ScreenSpaceEventHandler, ScreenSpaceEventType, Cesium3DTileFeature, defined, Color, ClippingPlane, ClippingPlaneCollection, Cartesian3, Cartographic, Matrix4, CallbackProperty, Cartesian2, ScreenSpaceCameraController} from 'cesium';
import Container from '../components/Container';
import { useRef , useState , useEffect } from 'react';

export default (props) => {

    const viewerRef = useRef(null);
    const tilestRef = useRef(null)
    const [info , setInfo] = useState({
        type : "3dtiles"
    })
    const planeEntitiesRef = useRef(null)
    const selectPalneRef = useRef(null)
    const targetYRef = useRef(0)
    /**
     * 
     * @param {Viewer} viewer 
     */
    const loadedMap = (viewer) => {
        load3dTiles(viewer)
        setTimeout(() => {
            viewerRef.current = viewer
        }, 100)
        const eventHandler = new ScreenSpaceEventHandler(viewer.scene.canvas)
        eventHandler.setInputAction(movement => {
            const pick = viewer.scene.pick(movement.position)
            if(defined(pick) && defined(pick.id) && defined(pick.id.plane)) {
                selectPalneRef.current = pick.id.plane
                selectPalneRef.current.material = Color.BLUEVIOLET.withAlpha(0.1)
                viewer.scene.screenSpaceCameraController.enableInputs = false
            }
        }, ScreenSpaceEventType.LEFT_DOWN)  
        eventHandler.setInputAction(movement => {
            if(selectPalneRef.current) {
                selectPalneRef.current.material = Color.BLUEVIOLET.withAlpha(0.5)
                viewer.scene.screenSpaceCameraController.enableInputs = true
                selectPalneRef.current = null
            }
        }, ScreenSpaceEventType.LEFT_UP)
        eventHandler.setInputAction(movement => {
            if(!selectPalneRef.current) return
            const {startPosition , endPosition} = movement
            const offset = endPosition.y - startPosition.y
            targetYRef.current -= offset;
        }, ScreenSpaceEventType.MOUSE_MOVE)
    }

    const changeType = (value) => {
        setInfo(info => ({
            ...info,
            type : value
        }))
    }

    const createPlaneUpdateFunction = plane => {
        return () => {
            plane.distance = targetYRef.current;
            return plane
        }
    }

      /**
     * 
     * @param {Viewer} viewer 
     */
    const load3dTiles = async  viewer => {
        // window.viewer = viewer
        const clippingPlanes = new ClippingPlaneCollection({
            planes : [
                new ClippingPlane(new Cartesian3(0, 0 , -1), 0)
            ],
            edgeColor : Color.YELLOW,
            edgeWidth : 1
        })
        const tilest = await Cesium3DTileset.fromIonAssetId(2464651, {
            clippingPlanes
        })
        // window.tilest = tilest
        let boundingSphere = tilest.boundingSphere
        let radius = boundingSphere.radius
      //  tilest.debugShowBoundingVolume = true
        viewer.scene.primitives.add(tilest)
        viewer.zoomTo(tilest)
        let topCartesian3 
        if(!Matrix4.equals(
            tilest.root.transform,
            Matrix4.IDENTITY
        )) {
            const transformCenter = Matrix4.getTranslation(tilest.root.transform,
                new Cartesian3()
            )
            topCartesian3 = new Cartesian3()
            Cartesian3.add(tilest.boundingSphere.center, new Cartesian3(0 , 0, tilest.boundingSphere.radius), topCartesian3)
            const transformCartogrphic = Cartographic.fromCartesian(transformCenter)
            const boundingSphereCartographic = Cartographic.fromCartesian(topCartesian3)
            const height = boundingSphereCartographic.height - transformCartogrphic.height
            clippingPlanes.modelMatrix = Matrix4.fromTranslation(new Cartesian3(0 , 0, height))
        }

        for(let i = 0 ; i<clippingPlanes.length; i++) {
            const plane = clippingPlanes.get(i)
            const planeEntity = viewer.entities.add({
                position : topCartesian3,
                plane : {
                    dimensions : new Cartesian2(tilest.boundingSphere.radius * 3 , tilest.boundingSphere.radius * 3 ),
                    material : Color.BLUEVIOLET.withAlpha(0.5),
                    plane :new  CallbackProperty(createPlaneUpdateFunction(plane), false),
                    outline : true,
                    outlineColor : Color.BLACK,
                    outlineWidth : 5
                }
            }) 
        }
    }

    useEffect(() => {
        const {type} = info
        if(!viewerRef.current) return
        if(type == "3dtiles") {
            load3dTiles(viewerRef.current)
        }
    }, [info.type])

    return (
    <Container loadedMap={loadedMap}>
        <Space direction="vertical" size={10}>
        <Select value={info.type} onChange={changeType}>
            <Select.Option value="3dtiles">加载3dtiles</Select.Option>
            <Select.Option value="glb">加载glb</Select.Option>
        </Select>
        </Space>
    </Container>
    );
};
