import { Space } from 'antd';
import { Cesium3DTile, Cesium3DTileset, HeadingPitchRange, Viewer , Math, ScreenSpaceEventHandler, ScreenSpaceEventType, Cesium3DTileFeature, defined, Color, Cartesian3, HeadingPitchRoll, PostProcessStage, PostProcessStageLibrary, Terrain, createWorldTerrainAsync, ClassificationType, Cesium3DTileStyle} from 'cesium';
import Container from '../components/Container';
import { useRef , useState , useEffect } from 'react';
import {Checkbox} from 'antd'

const Classification = props => {

    const [checked , setChecked] = useState(true)
    const viewerRef = useRef(null)
    /**
     * 
     * @param {Viewer} viewer 
     */
    const loadedMap = async viewer => {
        const tilest = await Cesium3DTileset.fromIonAssetId(40866, {
            show : true
        })
        viewer.scene.primitives.add(tilest)
        tilest.name = "mainTilest"
        viewer.zoomTo(tilest)
        // const terrainWorld =  Terrain.fromWorldTerrain()
        // viewer.scene.setTerrain(terrainWorld)
        const terrainProvider = await createWorldTerrainAsync()
        viewer.terrainProvider = terrainProvider


        const classificationTilesetUrl = "/sources/Cesium3DTiles/Classification/Photogrammetry/tileset.json"
        const  classificationTileset = await Cesium3DTileset.fromUrl(classificationTilesetUrl, {
            classificationType : ClassificationType.CESIUM_3D_TILE
        })
        classificationTileset.name = "classificationTilesetUrl"

        classificationTileset.style = new Cesium3DTileStyle({
            color : "rgba(255, 255, 0, 0.5)"
        })

        viewer.scene.primitives.add(classificationTileset)

        const nonClassificationTileset = await Cesium3DTileset.fromUrl(classificationTilesetUrl, {
            show : true,
        })
        nonClassificationTileset.name = "nonClassificationTileset"

        nonClassificationTileset.style = new Cesium3DTileStyle({
            color : "rgba(255, 0, 0, 0.5)"
        })

        viewer.scene.primitives.add(nonClassificationTileset)

        viewerRef.current = viewer

    }

    useEffect(() => {
        if(!viewerRef.current) return
        const primitives = viewerRef.current.scene.primitives
        for(let i = 0 ; i <primitives.length ; i++) {
            const primitive = primitives.get(i)
            if(primitive.name == "classificationTilesetUrl") {
                primitive.show = checked
            }
            if(primitive.name == "nonClassificationTileset") {
                primitive.show = !checked
            }
        }
   
    }, [checked])

    return (<Container
        loadedMap={loadedMap}
    >
        <Checkbox onChange={e => setChecked(e.target.checked)} checked={checked}>show Classification</Checkbox>
    </Container>)
}

export default Classification