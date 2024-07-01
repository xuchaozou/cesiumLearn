import { Checkbox, Space } from 'antd';
import { Cesium3DTile, Cesium3DTileset, HeadingPitchRange, Viewer , Math, ScreenSpaceEventHandler, ScreenSpaceEventType, Cesium3DTileFeature, defined, Color, Cartesian3, HeadingPitchRoll, PostProcessStage, PostProcessStageLibrary, Terrain, ClassificationType, Cesium3DTileStyle, JulianDate, createGooglePhotorealistic3DTileset, IonResource, GeoJsonDataSource, ClippingPolygonCollection, ClippingPolygon} from 'cesium';
import Container from '../components/Container';
import { useRef , useState , useEffect } from 'react';
import Utils from '../utils/Utils';


const AceClip = props => {
    const viewerRef = useRef(null);

    const [showBuildTilest , setShowBuildTilest] = useState(true)
    const [showFootPrint , setShowFootPrint] = useState(true)
    const [clipTargetLocation, setClipTargetLocation] = useState(true)
    const [inverseClip , setInverseClip] = useState(false)

    /**
     * 
     * @param {Viewer} viewer 
     */
    const loadedMap = async (viewer) => {

        viewer.scene.skyAtmosphere.show = true

        const currentTime = JulianDate.fromIso8601("2020-01-09T23:00:39.018261982600961346Z")

        viewer.clock.currentTime = currentTime

        const googleTilest = await createGooglePhotorealistic3DTileset()
        googleTilest.name = "googleTilest"
        viewer.scene.primitives.add(googleTilest)

        const resource = await IonResource.fromAssetId(2533131)

        const dataSource = await GeoJsonDataSource.load(resource, {
            clampToGround : true
        })
        dataSource.name = "GeoJsonDataSource"
        viewer.dataSources.add(dataSource)

        const footprint = dataSource.entities.values.find(entity => defined(entity.polygon))

        footprint.polygon.outline = false

        const cameraOffset = new HeadingPitchRange(Math.toRadians(95), Math.toRadians(-75), 800)

        viewer.zoomTo(footprint, cameraOffset)

        viewer.homeButton.viewModel.command.beforeExecute.addEventListener(e => {
            e.cancel = true
            viewer.zoomTo(footprint, cameraOffset)
        })

        const positions = footprint.polygon.hierarchy.getValue().positions
        const clippingPolygons = new ClippingPolygonCollection({
            polygons : [new ClippingPolygon({
                positions
            })]
        })
        googleTilest.clippingPolygons = clippingPolygons


        const buildTilest = await Cesium3DTileset.fromIonAssetId(2533124)
        buildTilest.name = "buildTilest"
        viewer.scene.primitives.add(buildTilest)

        viewerRef.current = viewer

        window.viewer = viewer
    }

    useEffect(() => {
        if(!viewerRef.current) return
        const primitive = Utils.getPrimitiveByName({
            name : "buildTilest",
            viewer : viewerRef.current
        })
        primitive.show = showBuildTilest
    }, [showBuildTilest])

    useEffect(() => {
        if(!viewerRef.current) return
        const dataSource = viewerRef.current.dataSources.getByName("GeoJsonDataSource")[0]

        const footprint = dataSource.entities.values.find(entity => defined(entity.polygon))

        footprint.show = showFootPrint
    }, [showFootPrint])

    useEffect(() => {
        if(!viewerRef.current) return
        const googleTilest = Utils.getPrimitiveByName({
            name : "googleTilest",
            viewer : viewerRef.current
        })
        if(googleTilest.clippingPolygons) {
            googleTilest.clippingPolygons.enabled = clipTargetLocation
        }
    }, [clipTargetLocation])

    useEffect(() => {
        if(!viewerRef.current) return
        const googleTilest = Utils.getPrimitiveByName({
            name : "googleTilest",
            viewer : viewerRef.current
        })
        if(googleTilest.clippingPolygons) {
          googleTilest.clippingPolygons.inverse = inverseClip
        }
    }, [inverseClip])

    return (<Container loadedMap={loadedMap} mapOptions = {{
        timeline : false,
        animation : false,
        sceneModePicker : false,
        baseLayerPicker : false,
        globe : false
    }}>
        <div>
            <Space size={5} direction="horizontal">
                <Checkbox checked= {showBuildTilest} onChange={e => setShowBuildTilest(e.target.checked)}>show process desgin</Checkbox>
                <Checkbox checked= {showFootPrint} onChange={e => setShowFootPrint(e.target.checked)}>show footPrint</Checkbox>
                <Checkbox checked= {clipTargetLocation} onChange={e => setClipTargetLocation(e.target.checked)}>clip target location</Checkbox>
                <Checkbox checked= {inverseClip} onChange={e => setInverseClip(e.target.checked)}>inverseClip</Checkbox>
            </Space>
        </div>
    </Container>)
}

export default AceClip