import { Input , Space, Slider} from 'antd';
import Container from '../components/Container';
import {Cartesian3, Viewer , Math, HeadingPitchRoll, Transforms, Cartographic, Entity, Color} from 'cesium'
import { useRef , useState , useEffect } from 'react';

const ModelColor = (props) => {
  const viewerRef = useRef(null);

  const [info, setInfo] = useState({
    silhouetteColor: '#ffff00',
    size: 2,
    height : 0,
    heading : 0
  });

  const changeColor = (e) => {
    setInfo(info => ({
        ...info,
        silhouetteColor : e.target.value
    }))
  };

  const changeValue = (attr, value) => {
    setInfo((info) => ({
      ...info,
      [attr]: value,
    }));
  };

  /**
   *
   * @param {Viewer} viewer
   *
   */
  const loadedMap = (viewer) => {
    viewerRef.current = viewer
    loadModel()
  };

  const loadModel = () => {
    const viewer = viewerRef.current
    viewerRef.current.entities.removeAll()
    const position = Cartesian3.fromDegrees(-123.07 , 44.05, info.height)
    const heading = Math.toRadians(info.heading)
    const pitch = Math.toRadians(0)
    const roll = Math.toRadians(0)
    const hpr = new HeadingPitchRoll(heading, pitch, roll)
    const orientation = Transforms.headingPitchRollQuaternion(position , hpr)

    const entity = viewer.entities.add({
        id : "car",
        name : "car",
        position,
        orientation,
        model : {
            uri : "/models/CesiumMilkTruck/CesiumMilkTruck.glb",
            // minimumPixelSize : 128,
            maximumScale :2000
        }
    })

    viewer.trackedEntity = entity
  }

  useEffect(() => {
    if(!viewerRef.current) return
    const viewer = viewerRef.current
    /**
     * @constant {Entity} 
     */
    const entity = viewer.entities.getById("car")
    if(!entity) return
    entity.model.silhouetteColor = Color.fromCssColorString(info.silhouetteColor)
    entity.model.silhouetteSize = info.size
  }, [info])

  return (
    <Container loadedMap={loadedMap}>
      <Space direction="vertical" size={10}>
        <Space direction="horizontal" size={5}>
          <span>描边颜色:</span>
          <Input
            type="color"
            value={info.silhouetteColor}
            onChange={changeColor}
            style={{
              width: '300px',
            }}
          />
        </Space>
        <Space direction="horizontal" size={5}>
          <span>大小:</span>
          <Slider
            min={0}
            max={8}
            value={info.size}
            step={0.5}
            onChange={changeValue.bind(this, 'size')}
            style={{
              width: '300px',
            }}
          />
        </Space>
      </Space>
    </Container>
  );
};

export default ModelColor;
