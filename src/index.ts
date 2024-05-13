import { ssam } from "ssam";
import type { Sketch, SketchSettings, WebGLProps } from "ssam";
import {
  BoxGeometry,
  Mesh,
  PerspectiveCamera,
  Scene,
  ShaderMaterial,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module";
import vert from "./shaders/vert.glsl";
import frag from "./shaders/frag.glsl";
import * as THREE from "three";

const sketch: Sketch<"webgl2"> = ({
  wrap,
  canvas,
  width,
  height,
  pixelRatio,
}) => {
  if (import.meta.hot) {
    import.meta.hot.dispose(() => wrap.dispose());
    import.meta.hot.accept(() => wrap.hotReload());
  }

  const renderer = new WebGLRenderer({ canvas });
  renderer.setSize(width, height);
  renderer.setPixelRatio(pixelRatio);
  renderer.setClearColor(0xffffff, 1);

  const camera = new PerspectiveCamera(50, width / height, 0.1, 1000);
  camera.position.set(0, 0, 0.1);
  camera.lookAt(0, 0, 0);

  const controls = new OrbitControls(camera, canvas);

  const stats = new Stats();
  document.body.appendChild(stats.dom);

  const scene = new Scene();

  const geometry = new THREE.PlaneGeometry(2, 2);

  const getMaterial = (level) => {
    return new ShaderMaterial({
      transparent: true,
      side: THREE.DoubleSide,
      vertexShader: vert,
      fragmentShader: frag,
      uniforms: {
        time: { value: 0.0 },
        uLevel: { value: level },
      },
    });
  };

  let number = 50;
  let meshes = [];
  let materials = [];
  for (let i = 0; i < number; i++) {
    let mat = getMaterial(i / number);
    let mesh = new THREE.Mesh(geometry, mat);
    materials.push(mat);
    meshes.push(mesh);
    mesh.position.z = -i * 0.1;
    scene.add(mesh);
  }

  wrap.render = ({ playhead } : WebGLProps) => {
    materials.forEach((mat, i) => {
     
    });

    controls.update();
    stats.update();
    renderer.render(scene, camera);
  };

  wrap.resize = ({ width, height }) => {
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  };

  wrap.unload = () => {
    renderer.dispose();
    renderer.forceContextLoss();
  };
};

const settings: SketchSettings = {
  mode: "webgl2",
  // dimensions: [800, 800],
  pixelRatio: window.devicePixelRatio,
  animate: true,
  duration: 6_000,
  playFps: 60,
  exportFps: 60,
  framesFormat: ["webm"],
  attributes: {
    preserveDrawingBuffer: true,
  },
};

ssam(sketch, settings);
