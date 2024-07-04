import { Slider, Space } from 'antd';
import { Cesium3DTile, GroundPrimitive, createWorldTerrainAsync, Cesium3DTileset, HeadingPitchRange, Viewer, Math, ScreenSpaceEventHandler, ScreenSpaceEventType, Cesium3DTileFeature, defined, Color, Cartesian3, HeadingPitchRoll, PostProcessStage, PostProcessStageLibrary, PolygonGeometry, PolygonHierarchy, GeometryInstance, MaterialAppearance, Material, Primitive, RectangleGeometry, Rectangle, PrimitiveType, GeometryAttribute, ComponentDatatype, VertexFormat, BoxGeometry, PlaneGeometry, Transforms, EllipsoidSurfaceAppearance, PerInstanceColorAppearance, Entity } from 'cesium';
import Container from '../components/Container';
import { useRef, useState, useEffect } from 'react';
import waterData from '../data/water'



const WaterVolume = props => {
    const viewerRef = useRef(null);

    /**
     * 
     * @param {Viewer} viewer 
     */
    const loadedMap = async (viewer) => {
        const waterFlatdata = waterData.features[0].geometry.coordinates[0].flat()

        window.viewer = viewer
        // const terrainProvider = await createWorldTerrainAsync()
        // viewer.terrainProvider = terrainProvider
        // viewer.scene.verticalExaggeration = 1.5
        // viewer.scene.globe.depthTestAgainstTerrain = true

        // const geometry = new PolygonGeometry({
        //     polygonHierarchy: new PolygonHierarchy(Cartesian3.fromDegreesArray(waterFlatdata)),
        //     vertexFormat: VertexFormat.POSITION_NORMAL_AND_ST,
        // })
        // const geometry = new RectangleGeometry({
        //     rectangle : Rectangle.fromDegrees(113.41 , 29.58 , 115.42,  31.22)
        // })
        const geometry = BoxGeometry.fromDimensions({
            dimensions: new Cartesian3(1, 1, 1),
            vertexFormat: VertexFormat.POSITION_NORMAL_AND_ST
        })


        const geometryInstances = new GeometryInstance({
            geometry,
            id: "polygon",
            modelMatrix: Transforms.eastNorthUpToFixedFrame(Cartesian3.fromDegrees(
                114, 30
            ))
        })


        const appearance = new MaterialAppearance({
            material: new Material({
                fabric: {
                    
                    type: "OceanShader",
                    uniforms: {
                        iTime: 0.2,
                    },
                    source: `
                     uniform float iTime;
                    // Stockholms Ström
// by Peder Norrby / Trapcode in 2016
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0
    in vec3 vOrigin;
                in vec3 vDirection;
   

mat3 rotationMatrix(vec3 axis, float angle)
{
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    
    return mat3(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c          );
                                          
}


//
// Description : Array and textureless GLSL 2D/3D/4D simplex 
//               noise functions.
//      Author : Ian McEwan, Ashima Arts.
//  Maintainer : ijm
//     Lastmod : 20110822 (ijm)
//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
//               Distributed under the MIT License. See LICENSE file.
//               https://github.com/ashima/webgl-noise
// 


vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
     return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

float noise(vec3 v)
  { 
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

// First corner
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

// Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  //   x0 = x0 - 0.0 + 0.0 * C.xxx;
  //   x1 = x0 - i1  + 1.0 * C.xxx;
  //   x2 = x0 - i2  + 2.0 * C.xxx;
  //   x3 = x0 - 1.0 + 3.0 * C.xxx;
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
  vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

// Permutations
  i = mod289(i); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

// Gradients: 7x7 points over a square, mapped onto an octahedron.
// The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
  float n_ = 0.142857142857; // 1.0/7.0
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
  //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

//Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

// Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                dot(p2,x2), dot(p3,x3) ) );
  }



/*
mat4 rotationMatrix(vec3 axis, float angle)
{
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    
    return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                0.0,                                0.0,                                0.0,                                1.0);
}*/



float fnoise( vec3 p)
{
    mat3 rot = rotationMatrix( normalize(vec3(0.0,0.0, 1.0)), 0.5*iTime);
    mat3 rot2 = rotationMatrix( normalize(vec3(0.0,0.0, 1.0)), 0.3*iTime);
    float sum = 0.0;
    
    vec3 r = rot*p;
    
    float add = noise(r);
    float msc = add+0.7;
   	msc = clamp(msc, 0.0, 1.0);
    sum += 0.6*add;
    
    p = p*2.0;
    r = rot*p;
    add = noise(r);
 
    add *= msc;
    sum += 0.5*add;
    msc *= add+0.7;
   	msc = clamp(msc, 0.0, 1.0);
    
    p.xy = p.xy*2.0;
    p = rot2 *p;
    add = noise(p);
    add *= msc;
    sum += 0.25*abs(add);
    msc *= add+0.7;
   	msc = clamp(msc, 0.0, 1.0);
 
    p = p*2.0;
  //  p = p*rot;
    add = noise(p);// + vec3(iTime*5.0, 0.0, 0.0));
    add *= msc;
    sum += 0.125*abs(add);
    msc *= add+0.2;
   	msc = clamp(msc, 0.0, 1.0);

    p = p*2.0;
  //  p = p*rot;
    add = noise(p);
    add *= msc;
    sum += 0.0625*abs(add);
    //msc *= add+0.7;
   	//msc = clamp(msc, 0.0, 1.0);

    
    return sum*0.516129; // return msc as detail measure?
}

float getHeight(vec3 p) // x,z,time
{
    
 	return 0.3-0.5*fnoise( vec3(0.5*(p.x + 0.0*iTime), 0.5*p.z,  0.4*iTime) );   
}

#define box_y 1.0
#define box_x 2.0
#define box_z 2.0
#define bg vec4(0.0, 0.0, 0.0, 1.0)
#define step 0.3
#define red vec4(1.0, 0.0, 0.0, 1.0)
#define PI_HALF 1.5707963267949

vec4 getSky(vec3 rd)
{
    if (rd.y > 0.3) return vec4(0.5, 0.8, 1.5, 1.0); // bright sky
    if (rd.y < 0.0) return vec4(0.0, 0.2, 0.4, 1.0); // no reflection from below
    
    if (rd.z > 0.9 && rd.x > 0.3) {
    	if (rd.y > 0.2) return 1.5*vec4(2.0, 1.0, 1.0, 1.0); // red houses
    	return 1.5*vec4(2.0, 1.0, 0.5, 1.0); // orange houses
    } else return vec4(0.5, 0.8, 1.5, 1.0 ); // bright sky
}


vec4 shadeBox(vec3 normal, vec3 pos, vec3 rd)
{
    float deep = 1.0+0.5*pos.y;
    
    vec4 col = deep*0.4*vec4(0.0, 0.3, 0.4, 1.0);
    
    return col;
 
}

vec4 shade(vec3 normal, vec3 pos, vec3 rd)
{
    float ReflectionFresnel = 0.99;
   	float fresnel = ReflectionFresnel*pow( 1.0-clamp(dot(-rd, normal), 0.0, 1.0), 5.0) + (1.0-ReflectionFresnel);
    vec3 refVec = reflect(rd, normal);
    vec4 reflection = getSky(refVec);
    
    //vec3 sunDir = normalize(vec3(-1.0, -1.0, 0.5));
    //float intens = 0.5 + 0.5*clamp( dot(normal, sunDir), 0.0, 1.0);
    
    float deep = 1.0+0.5*pos.y;
    
    vec4 col = fresnel*reflection;
    col += deep*0.4*vec4(0.0, 0.3, 0.4, 1.0);
    
    return clamp(col, 0.0, 1.0);
}

vec4 intersect_box(vec3 ro, vec3 rd) // no top and bottom, just sides!
{
    //vec3 normal;
    float t_min = 1000.0;
    vec3 t_normal;

    // x = -box_x plane
    float t = (-box_x -ro.x) / rd.x;
    vec3 p = ro + t*rd;

    if (p.y > -box_y && p.z < box_z && p.z > -box_z) {
        t_normal = vec3(-1.0, 0.0, 0.0);
        t_min = t;
        //if (dot(normal, rd) > PI_HALF ) return red;//shadeBox(normal, p, rd);
    }

    
    // x = +box_x plane
    //box_x = ro.x + t*rd.x
    //t*rd.x = box_x - ro.x
   // t = (box_x - ro.x)/rd.x
    
    t = (box_x -ro.x) / rd.x;
    p = ro + t*rd;

    if (p.y > -box_y && p.z < box_z && p.z > -box_z) {
        if (t < t_min) {
        	t_normal = vec3(1.0, 0.0, 0.0);
			t_min = t;
        }
    }

    // z = -box_z plane
	t = (-box_z -ro.z) / rd.z;
    p = ro + t*rd;
    
    if (p.y > -box_y && p.x < box_x && p.x > -box_x) {
        
        if (t < t_min) {
        	t_normal = vec3(0.0, 0.0, -1.0);
            t_min = t;
        }
    }
    
    // z = +box_z plane
	t = (box_z -ro.z) / rd.z;
    p = ro + t*rd;
    
    if (p.y > -box_y && p.x < box_x && p.x > -box_x) {
        
        if (t < t_min) {
        	t_normal = vec3(0.0, 0.0, 1.0);
            t_min = t;
        }
    }
    
    
    if (t_min < 1000.0) return shadeBox(t_normal, ro + t_min*rd, rd);
    
    
    return bg;
}



vec4 trace_heightfield( vec3 ro, vec3 rd)
{
    
    // intersect with max h plane, y=1
    
    //ro.y + t*rd.y = 1.0;
    //t*rd.y = 1.0 - ro.y;
    float t = (1.0 - ro.y) / rd.y;
    
    if (t<0.0) return red;
    
    vec3 p = ro + t*rd;
    
    if (p.x < -2.0 && rd.x <= 0.0) return bg;
    if (p.x >  2.0 && rd.x >= 0.0) return bg;
    if (p.z < -2.0 && rd.z <= 0.0) return bg;
    if (p.z >  2.0 && rd.z >= 0.0) return bg;
   
    
    //float h = getHeight(p);
    float h, last_h;
    bool not_found = true;
    vec3 last_p = p;
    
    for (int i=0; i<20; i++) {
        
        p += step*rd;
    
    	h = getHeight(p);
        
        if (p.y < h) {not_found = false; break;} // we stepped through
        last_h = h;
        last_p = p;
    }
    
    if (not_found) return bg;
 
 	// refine interection
    float dh2 = h - p.y;
    float dh1 = last_p.y - last_h;
 	p = last_p + rd*step/(dh2/dh1+1.0);
   
    // box shenanigans
    if (p.x < -2.0) {
        if (rd.x <= 0.0) return bg; 
        return intersect_box(ro, rd);
    }
    if (p.x >  2.0) {
        if (rd.x >= 0.0) return bg;
        return intersect_box(ro, rd);
    }
    if (p.z < -2.0) {
        if (rd.z <= 0.0) return bg; 
        return intersect_box(ro, rd);
    }
    if (p.z >  2.0) {
        if (rd.z >= 0.0) return bg;
        return intersect_box(ro, rd);
    }
    
    vec3 pdx = p + vec3( 0.01, 0.0,  0.00);
    vec3 pdz = p + vec3( 0.00, 0.0,  0.01);
    
    float hdx = getHeight( pdx );
    float hdz = getHeight( pdz );
   	h = getHeight( p );
    
    p.y = h;
    pdx.y = hdx;
    pdz.y = hdz;
    
    vec3 normal = normalize(cross( p-pdz, p-pdx)) ;
    
 	return shade(normal, p, rd);
}


// Shadertoy camera code by iq

mat3 setCamera( in vec3 ro, in vec3 ta, float cr ) 
{
	vec3 cw = normalize(ta-ro);
	vec3 cp = vec3(sin(cr), cos(cr),0.0);
	vec3 cu = normalize( cross(cw,cp) );
	vec3 cv = normalize( cross(cu,cw) );
    return mat3( cu, cv, cw );
}


   czm_material czm_getMaterial(czm_materialInput materialInput)
           {
                
            czm_material material = czm_getDefaultMaterial(materialInput);
            vec4 color = trace_heightfield( vOrigin, vDirection );

         
                    material.diffuse = vec3(color.rgb);
                    material.alpha = color.a;
                    return material;
           }



                    `
                },
            }),
            translucent: true,
            vertexShaderSource: `in vec3 position3DHigh;
                in vec3 position3DLow;
                in vec3 normal;
                in vec2 st;
                in float batchId;

                out vec3 v_positionEC;
                out vec3 v_normalEC;
                out vec2 v_st;

                    out vec3 vOrigin;
                                out vec3 vDirection;

                void main()
                {
                    vec4 p = czm_computePosition();  //获取世界坐标位置
                vOrigin=czm_encodedCameraPositionMCHigh+czm_encodedCameraPositionMCLow;
                    v_positionEC = (czm_modelViewRelativeToEye * p).xyz;      // position in eye coordinates
                    v_normalEC = czm_normal * normal;                         // normal in eye coordinates
                    v_st = st;
                vec4 position = czm_inverseModel * vec4(p.xyz, 1); 
                                    vDirection=vec3(position.x , position.y , position.z)-vOrigin;
vDirection = position3DHigh+position3DLow - vOrigin;
                    gl_Position = czm_modelViewProjectionRelativeToEye * p;
                }

            `,
            fragmentShaderSource : `
            in vec3 v_positionEC;
in vec3 v_normalEC;
in vec2 v_st;
                void main() {
   vec3 positionToEyeEC = -v_positionEC;
    vec3 normalEC = normalize(v_normalEC);
        #ifdef FACE_FORWARD
        normalEC = faceforward(normalEC, vec3(0.0, 0.0, 1.0), -normalEC);
    #endif
   czm_materialInput materialInput;
                materialInput.normalEC = normalEC;
                    materialInput.positionToEyeEC = positionToEyeEC;
                        materialInput.st = v_st;
                            czm_material material = czm_getMaterial(materialInput);
                            out_FragColor = vec4(vec3(material.diffuse), material.alpha);

                }
            `,
            vertexShaderSource1: `
                out vec3 vOrigin;
                out vec3 vDirection;
                in vec3 position3DHigh;
in vec3 position3DLow;
in vec3 normal;
in vec2 st;
in float batchId;

out vec3 v_positionEC;
                void main() {
                    vOrigin=czm_encodedCameraPositionMCHigh+czm_encodedCameraPositionMCLow;


                    vec4 positionWC = czm_computePosition();
 vec4 position = czm_inverseModel * vec4(positionWC.xyz, 1); 
                    vDirection=vec3(poxition.xyz)-vOrigin;



    gl_Position = czm_modelViewProjectionRelativeToEye * positionWC;

                }
            `,
            fragmentShaderSource1: `
            
            `,
            flat: true,
            renderState: {}
        })

        viewer.scene.primitives.add(new Primitive({
            geometryInstances: geometryInstances,
            appearance: appearance,
            allowPicking: false
        }))

        viewer.camera.flyTo({
            destination: new Cartesian3.fromDegrees(114, 30, 200)
        })
        renderLoop()
        function renderLoop(timestamp) {
            appearance.material.uniforms.iTime = timestamp/1000;
            requestAnimationFrame(renderLoop);
        }


    }

    return (<Container loadedMap={loadedMap}> </Container>)
}

export default WaterVolume