import { Space } from 'antd';
import { Cesium3DTile, Cesium3DTileset, HeadingPitchRange, Viewer , Math, ScreenSpaceEventHandler, ScreenSpaceEventType, Cesium3DTileFeature, defined, Color, Cartesian3, HeadingPitchRoll, PostProcessStage, PostProcessStageLibrary, Primitive, GeometryInstance, BoxGeometry, PerInstanceColorAppearance, Matrix4, Transforms, ColorGeometryInstanceAttribute, viewerCesiumInspectorMixin, RectangleGeometry, Rectangle, BillboardCollection} from 'cesium';
import Container from '../components/Container';
import { useRef , useState , useEffect } from 'react';


const BasicPrimitive = props => {
    const viewerRef = useRef(null);

    /**
     * 
     * @param {Viewer} viewer 
     */
    const loadedMap = (viewer) => {
        viewer.scene.globe.depthTestAgainstTerrain = true
        viewer.extend(viewerCesiumInspectorMixin)
        viewer.scene.primitives.add(
            new Primitive({
                geometryInstances : new GeometryInstance({
                    geometry : BoxGeometry.fromDimensions({
                        vertexFormat : PerInstanceColorAppearance.VERTEX_FORMAT,
                        dimensions : new Cartesian3(400000, 300000, 500000)
                    }),
                    modelMatrix : Matrix4.multiplyByTranslation(
                        Transforms.eastNorthUpToFixedFrame(
                            Cartesian3.fromDegrees(-105 , 45)
                        ),
                        new Cartesian3(0, 0 , 250000),
                        new Matrix4()
                    ),
                    attributes : {
                        color : ColorGeometryInstanceAttribute.fromColor(
                            Color.RED.withAlpha(0.5)
                        )
                    }
                }),
                appearance : new PerInstanceColorAppearance({
                    closed : true
                })
            })
       )

        viewer.scene.primitives.add(new Primitive({
            geometryInstances :new GeometryInstance({
                geometry : new RectangleGeometry({
                    rectangle : Rectangle.fromDegrees(
                        -100.0,
                        30.0,
                        -93.0,
                        37.0
                    ),
                    height : 10000,
                    vertexFormat : PerInstanceColorAppearance.VERTEX_FORMAT
                    }),
                    attributes : {
                        color : ColorGeometryInstanceAttribute.fromColor(
                            Color.BLUE.withAlpha(0.9)
                        )
                    }
                    }),
                appearance : new PerInstanceColorAppearance()
            }),
        )

        const billboards = viewer.scene.primitives.add(new BillboardCollection())
        billboards.add({
            position : Cartesian3.fromDegrees(-75 , 40 , 120000),
            image : "/images/Cesium_Logo_overlay.png"
        })
    }

    return (<Container loadedMap={loadedMap}> </Container>)
}

export default BasicPrimitive