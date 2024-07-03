import { Space } from 'antd';
import { Cesium3DTile, Cesium3DTileset, HeadingPitchRange, Viewer, Math, ScreenSpaceEventHandler, ScreenSpaceEventType, Cesium3DTileFeature, defined, Color, Cartesian3, HeadingPitchRoll, PostProcessStage, PostProcessStageLibrary, PolygonGeometry, VertexFormat, GeometryInstance, EllipsoidSurfaceAppearance, Material, Primitive, PolygonHierarchy, createWorldTerrainAsync, GroundPrimitive } from 'cesium';
import Container from '../components/Container';
import { useRef, useState, useEffect } from 'react';
import waterData from '../data/water'


const RiverPolygon = props => {
    const viewerRef = useRef(null);

    /**
     * 
     * @param {Viewer} viewer 
     */
    const loadedMap = async (viewer) => {
        const waterFlatdata =  waterData.features[0].geometry.coordinates[0].flat()
        const terrainProvider = await createWorldTerrainAsync()
        viewer.terrainProvider = terrainProvider
        viewer.scene.verticalExaggeration = 1.5
        viewer.scene.globe.depthTestAgainstTerrain = true

        const geometry = new PolygonGeometry({
            polygonHierarchy: new PolygonHierarchy(Cartesian3.fromDegreesArray(waterFlatdata)),
            vertexFormat: VertexFormat.POSITION_NORMAL_AND_ST,
        })

        const geometryInstances = new GeometryInstance({
            geometry
        })

        const appearance = new EllipsoidSurfaceAppearance({
            material: Material.fromType("Color",{
                color : new Color(0.0 , 153 / 255 , 238 / 255 , 0.5)
            }),
            aboveGround: true,
            translucent: true
        })

        viewer.scene.primitives.add(new GroundPrimitive({
            geometryInstances,
            appearance
        }))
        viewer.camera.flyTo({
            destination : new Cartesian3.fromDegrees( 118.1617353,
                24.6872519, 2000)
        })
    }

    return (<Container loadedMap={loadedMap}> </Container>)
}

export default RiverPolygon