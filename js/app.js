import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import fragment from "./shader/fragment.glsl";
import vertex from "./shader/vertex.glsl";
import * as dat from "lil-gui";
import gsap from "gsap";

export default class Sketch {
  constructor(options) {
    this.scene = new THREE.Scene();

    this.container = options.dom;
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0x000000, 1); 

    this.container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(
      70,
      this.width / this.height,
      0.001,
      1000
    );

    this.camera.position.set(0, 0, 2);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.time = 0;

    this.isPlaying = true;
    
    this.addObjects();
    this.resize();
    this.render();
    this.setupResize();
  }

  settings() {
    this.settings = {
      progress: 0,
    };
    this.gui = new dat.GUI();
    this.gui.add(this.settings, "progress", 0, 1, 0.01);
  }

  setupResize() {
    window.addEventListener("resize", this.resize.bind(this));
  }

  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
  }

  addObjects() {
    const count = 10000;
    let baseGeometry = new THREE.PlaneGeometry(1, 1);
    let geometry = new THREE.InstancedBufferGeometry().copy(baseGeometry);
    geometry.instanceCount = count;

    let positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
     let x = (Math.random() - 0.5)*0.5;
      let y = (Math.random() - 0.5)*0.5;
      let z = (Math.random() - 0.5)*0.5;
      positions.set([x, y, z], i * 3);
    }
    geometry.setAttribute('offset', new THREE.InstancedBufferAttribute(positions, 3, false));

    this.material = new THREE.ShaderMaterial({
      extensions: {
        derivatives: "#extension GL_OES_standard_derivatives : enable"
      },
      side: THREE.DoubleSide,
      uniforms: {
        time: { value: 0 },
        resolution: { value: new THREE.Vector4() },
      },
      vertexShader: vertex,
      fragmentShader: fragment
    });

    this.points = new THREE.Mesh(geometry, this.material);
    this.scene.add(this.points);
  }

  render() {
    if (!this.isPlaying) return;
    this.time += 0.05;
    this.material.uniforms.time.value = this.time;
    requestAnimationFrame(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);
  }
}

new Sketch({
  dom: document.getElementById("container")
});
