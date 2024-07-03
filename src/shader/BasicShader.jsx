import { Space } from 'antd';
import { Cesium3DTile, Cesium3DTileset, HeadingPitchRange, Viewer, Math, ScreenSpaceEventHandler, ScreenSpaceEventType, Cesium3DTileFeature, defined, Color, Cartesian3, HeadingPitchRoll, PostProcessStage, PostProcessStageLibrary, Primitive, GeometryInstance, RectangleGeometry, Rectangle, EllipsoidSurfaceAppearance, Material, MaterialAppearance } from 'cesium';
import Container from '../components/Container';
import { useRef, useState, useEffect } from 'react';


const BasicShader = props => {
    const viewerRef = useRef(null);

    /**
     * 
     * @param {Viewer} viewer 
     */
    const loadedMap = (viewer) => {


        const customMaterial = new Material({
            fabric: {
                type: "custom1",
                uniforms : {
                    bottomColor: new Color(0.6, 0.0, 0.0, 1.0), // 底部颜色
                    topColor: new Color(0.0, 0.6, 1.0, 1.0) // 顶部颜色
                },
                source: `
                    uniform vec4 bottomColor;
                                 uniform vec4 topColor;
                     czm_material czm_getMaterial(czm_materialInput materialInput)
                    {
                        czm_material material = czm_getDefaultMaterial(materialInput);
                        
                        vec2 st = materialInput.st;
                        float t = st.y; // 使用纹理坐标的y作为渐变因子，从底部到顶部渐变
                        
                        // 线性插值计算颜色
                        material.diffuse = mix(bottomColor.rgb, topColor.rgb, t);
                        
                        return material;
                    }
                `
            }
        })

        const rectangle = viewer.scene.primitives.add(
            new Primitive({
                geometryInstances: new GeometryInstance({
                    geometry: new RectangleGeometry({
                        rectangle: Rectangle.fromDegrees(116, 39, 117, 39.7),
                        vertexFormat: EllipsoidSurfaceAppearance.VERTEX_FORMAT
                    })
                }),
                appearance: new MaterialAppearance({
                    aboveGround: true,
                    material : customMaterial
                })
            })
        )
        //    viewer.zoomTo(rectangle)
        viewer.camera.flyTo({
            destination: new Cartesian3.fromDegrees(116.5, 39.2, 80000)
        })
    }

    return (<Container loadedMap={loadedMap}> </Container>)
}

export default BasicShader