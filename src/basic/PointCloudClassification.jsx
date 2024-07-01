import { Space } from 'antd';
import { Cesium3DTile, Cesium3DTileset, HeadingPitchRange, Viewer , Math, ScreenSpaceEventHandler, ScreenSpaceEventType, Cesium3DTileFeature, defined, Color, Cartesian3, HeadingPitchRoll, PostProcessStage, PostProcessStageLibrary, Terrain, ClassificationType, Cesium3DTileStyle} from 'cesium';
import Container from '../components/Container';
import { useRef , useState , useEffect } from 'react';


const PointCloudClassification = props => {
    const viewerRef = useRef(null);

    /**
     * 
     * @param {Viewer} viewer 
     */
    const loadedMap = async (viewer) => {
        const tilest = await Cesium3DTileset.fromIonAssetId(16421)

        viewer.scene.primitives.add(tilest)

        const terrainWorld = Terrain.fromWorldTerrain()

        viewer.scene.setTerrain(terrainWorld)

        viewer.zoomTo(tilest)

        const classificationTileset = await Cesium3DTileset.fromUrl(
            "/sources/Cesium3DTiles/Classification/PointCloud/tileset.json",
            {
                classificationType : ClassificationType.CESIUM_3D_TILE
            }
        )

        viewer.scene.primitives.add(classificationTileset)

        classificationTileset.style = new  Cesium3DTileStyle({
            color : {
                conditions : [
                    ["${id} === 'roof1'", "color('#004FFF', 0.5)"],
                    ["${id} === 'towerBottom1'", "color('#33BB66', 0.5)"],
                    ["${id} === 'towerTop1'", "color('#0099AA', 0.5)"],
                    ["${id} === 'roof2'", "color('#004FFF', 0.5)"],
                    ["${id} === 'tower3'", "color('#FF8833', 0.5)"],
                    ["${id} === 'tower4'", "color('#FFAA22', 0.5)"],
                    ["true", `color('#ff0000', 0.5)`]
                ]
            }
        })

        const screenSpaceEventHandler = new ScreenSpaceEventHandler(viewer.canvas)

        const highlighted = {
            feature : null,
            originalColor : new Color()
        }
        screenSpaceEventHandler.setInputAction(movement =>{ 
            const pickFeature = viewer.scene.pick(movement.endPosition)

            if(defined(highlighted.feature)) {
                highlighted.feature.color = highlighted.originalColor
                highlighted.feature = null
            }

            if(!defined(pickFeature)) return

            highlighted.feature = pickFeature
            Color.clone(pickFeature.color, highlighted.originalColor)
            pickFeature.color = Color.YELLOW.withAlpha(0.5)

        }, ScreenSpaceEventType.MOUSE_MOVE)
    }

    return (<Container loadedMap={loadedMap}></Container>)
}

export default PointCloudClassification