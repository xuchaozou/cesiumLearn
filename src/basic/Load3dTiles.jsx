import { Space } from 'antd';
import { Cesium3DTile, Cesium3DTileset, HeadingPitchRange, Viewer , Math, ScreenSpaceEventHandler, ScreenSpaceEventType, Cesium3DTileFeature, defined, Color} from 'cesium';
import Container from '../components/Container';
import { useRef , useState , useEffect } from 'react';

export default (props) => {

    const viewerRef = useRef(null);
    const selectedFeatureRef = useRef(null)
    const restoreColorRef = useRef(null)
    const heightColor = Color.YELLOW

    window.features = []

  /**
   *
   * @param {Viewer} viewer
   *
   */
  const loadedMap = (viewer) => {
    viewerRef.current = viewer;
    load3dTiles(viewer)
  };

    /**
   *
   * @param {Viewer} viewer
   *
   */
  const load3dTiles = async (viewer) => {
    const tileset = await Cesium3DTileset.fromIonAssetId(2464651)
    viewerRef.current.scene.primitives.add(tileset)

    tileset.tileLoad.addEventListener(function (tile) {
      // console.log(tile , 'load')
      processTileFeatures(tile);
    });
  
    tileset.tileUnload.addEventListener(function (tile) {
      console.log('tileUnload')
      // console.log(tile , 'unLoad')
      // processTileFeatures(tile, unloadFeature);
    });

    viewer.zoomTo(tileset, new HeadingPitchRange(
        Math.toRadians(0),
        Math.toRadians(-30),
        tileset.boundingSphere.radius * 2
    ))

    const handler = new ScreenSpaceEventHandler(viewer.scene.canvas)

    const processTileFeatures = (tile , callBack) => {
      const content = tile.content
      const innerContents = content.innerContents
      const result = innerContents || [content]
      result.map(content => {
          const featureLength = content.featuresLength
          for(let i =0 ; i<featureLength ; i++) {
            const feature =  content.getFeature(i)
            const element = feature.getProperty("element")
            // console.log(feature.featureId)
            if(element == "130853") {
              console.log(feature.getProperty("assembly"))
            }
            if(element == "130853") {
              feature.color = Color.YELLOW
              // window.features.push(feature)
            } else if(feature._originColor) {
              // feature.color = Color.fromCssColorString(feature._originColor)
            }
          }
        })
    }

    handler.setInputAction(movement => {
      const feature = viewer.scene.pick(movement.position)
      if(!feature) return
      const element = feature.getProperty("element")
      if(element == "130853") {
        feature.color = Color.YELLOW}
      return
      window.features = []
     unSelectFeature(feature)
      selectedFeatureRef.current = feature
      window.features.push(feature)
      if(feature instanceof Cesium3DTileFeature) {
        const ids = feature.getPropertyIds()

        restoreColorRef.current = feature.color.toCssColorString()
        feature._originColor = feature.color.toCssColorString()
        feature.color = heightColor
      }

    }, ScreenSpaceEventType.LEFT_CLICK)



  }

  const unSelectFeature = (feature) => {
    if(!defined(selectedFeatureRef.current) || !defined(feature)) return
    const element = selectedFeatureRef.current.getProperty("element") 
    if(element == feature.getProperty("element") ) return
    selectedFeatureRef.current.color = Color.fromCssColorString(restoreColorRef.current)
  }

  return (
    <Container loadedMap={loadedMap}>
      <Space direction="vertical" size={10}>
        <Space direction="horizontal" size={5}>
          {/* <span>描边颜色:</span>
        <Input
          type="color"
          value={info.silhouetteColor}
          onChange={changeColor}
          style={{
            width: '300px',
          }}
        /> */}
        </Space>
      </Space>
    </Container>
  );
};
