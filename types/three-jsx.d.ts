/* eslint-disable @typescript-eslint/no-explicit-any */
import '@react-three/fiber';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      // Core objects
      mesh: any;
      group: any;
      primitive: any;
      // Geometries
      boxGeometry: any;
      sphereGeometry: any;
      planeGeometry: any;
      torusGeometry: any;
      torusKnotGeometry: any;
      icosahedronGeometry: any;
      dodecahedronGeometry: any;
      cylinderGeometry: any;
      coneGeometry: any;
      ringGeometry: any;
      bufferGeometry: any;
      // Materials
      meshStandardMaterial: any;
      meshBasicMaterial: any;
      meshPhysicalMaterial: any;
      meshLambertMaterial: any;
      meshPhongMaterial: any;
      lineBasicMaterial: any;
      pointsMaterial: any;
      shaderMaterial: any;
      // Lights
      ambientLight: any;
      pointLight: any;
      directionalLight: any;
      spotLight: any;
      hemisphereLight: any;
      rectAreaLight: any;
      // Helpers & misc
      color: any;
      fog: any;
      gridHelper: any;
      axesHelper: any;
      // Cameras
      perspectiveCamera: any;
      orthographicCamera: any;
    }
  }
}

export {};
