import { Space } from 'antd';
import { Cesium3DTile, Cesium3DTileset, HeadingPitchRange, Viewer, Math, ScreenSpaceEventHandler, ScreenSpaceEventType, Cesium3DTileFeature, defined, Color, Cartesian3, HeadingPitchRoll, PostProcessStage, PostProcessStageLibrary } from 'cesium';
import Container from '../components/Container';
import { useRef, useState, useEffect } from 'react';


const CameraControl = props => {
    const viewerRef = useRef(null);

    /**
     * 
     * @param {Viewer} viewer 
     */
    const loadedMap = (viewer) => {
        viewer.geocoder.viewModel.searchText = "武汉物联港"
        viewer.geocoder.viewModel.search()
        viewer.scene.screenSpaceCameraController.enableRotate = false
        viewer.scene.screenSpaceCameraController.enableTranslate = false
        viewer.scene.screenSpaceCameraController.enableZoom = false
        viewer.scene.screenSpaceCameraController.enableTilt = false
        viewer.scene.screenSpaceCameraController.enableLook = false

        let startMousePosition;
        let mousePosition;
        const flags = {
            looking: false,
            moveForward: false,
            moveBackward: false,
            moveUp: false,
            moveDown: false,
            moveLeft: false,
            moveRight: false,
        };

        const handler = new ScreenSpaceEventHandler(viewer.scene.canvas)
        handler.setInputAction(movement => {
            flags.looking = true
            mousePosition = startMousePosition = Cartesian3.clone(movement.position)
        }, ScreenSpaceEventType.LEFT_DOWN)

        handler.setInputAction(movement => {
            mousePosition = movement.endPosition
        }, ScreenSpaceEventType.MOUSE_MOVE)

        handler.setInputAction(function (position) {
            flags.looking = false;
        }, ScreenSpaceEventType.LEFT_UP);

        function getFlagForKeyCode(code) {
            switch (code) {
                case "KeyW":
                    return "moveForward";
                case "KeyS":
                    return "moveBackward";
                case "KeyQ":
                    return "moveUp";
                case "KeyE":
                    return "moveDown";
                case "KeyD":
                    return "moveRight";
                case "KeyA":
                    return "moveLeft";
                default:
                    return undefined;
            }
        }

        document.addEventListener(
            "keydown",
            function (e) {
                const flagName = getFlagForKeyCode(e.code);
                if (typeof flagName !== "undefined") {
                    flags[flagName] = true;
                }
            },
            false
        );

        document.addEventListener(
            "keyup",
            function (e) {
                const flagName = getFlagForKeyCode(e.code);
                if (typeof flagName !== "undefined") {
                    flags[flagName] = false;
                }
            },
            false
        );

        viewer.clock.onTick.addEventListener(clock => {
            const camera = viewer.camera;

            if (flags.looking) {
              const width = viewer.scene.canvas.clientWidth;
              const height = viewer.scene.canvas.clientHeight;
          
              // Coordinate (0.0, 0.0) will be where the mouse was clicked.
              const x = (mousePosition.x - startMousePosition.x) / width;
              const y = -(mousePosition.y - startMousePosition.y) / height;
          
              const lookFactor = 0.05;
              camera.lookRight(x * lookFactor);
              camera.lookUp(y * lookFactor);
            }
          
            // Change movement speed based on the distance of the camera to the surface of the ellipsoid.
            const cameraHeight = viewer.scene.globe.ellipsoid.cartesianToCartographic(
              camera.position
            ).height;
            const moveRate = cameraHeight / 100.0;
          
            if (flags.moveForward) {
              camera.moveForward(moveRate);
            }
            if (flags.moveBackward) {
              camera.moveBackward(moveRate);
            }
            if (flags.moveUp) {
              camera.moveUp(moveRate);
            }
            if (flags.moveDown) {
              camera.moveDown(moveRate);
            }
            if (flags.moveLeft) {
              camera.moveLeft(moveRate);
            }
            if (flags.moveRight) {
              camera.moveRight(moveRate);
            }
        })

    }

    return (<Container loadedMap={loadedMap}> </Container>)
}

export default CameraControl