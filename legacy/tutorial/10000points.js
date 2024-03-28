import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// three.js를 개발할 때는 3종세트가 필요함
// scene, camera and renderer
// 카메라로 씬을 렌더링하는 것

class App {
  constructor() {
    this._divContainer = document.querySelector('#webgl_container');

    this._renderer = new THREE.WebGLRenderer({ antialias: true });
    this._renderer.setPixelRatio(window.devicePixelRatio);
    this._divContainer.appendChild(this._renderer.domElement);

    this._scene = new THREE.Scene();
    this._scene.background = new THREE.Color(0xeeeeee);

    this._setupCamera();
    this._setupLight();
    this._setupModel();
    this._setupControls();

    window.onresize = this.resize.bind(this);
    this.resize();

    requestAnimationFrame(this.render.bind(this));
  }

  _setupControls() {
    new OrbitControls(this._camera, this._divContainer);
  }

  _setupCamera() {
    const width = this._divContainer.clientWidth;
    const height = this._divContainer.clientHeight;
    this._camera = new THREE.PerspectiveCamera(
      75, width / height, 0.1, 100
    );
    this._camera.position.z = 7;
  }

  _setupLight() {
    const color = 0xffffff;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    this._scene.add(light);
  }


  _setupModel() {
    const vertices = [];
    for (let i = 0; i < 10000; i++) {
      const x = THREE.MathUtils.randFloatSpread(5);
      const y = THREE.MathUtils.randFloatSpread(5);
      const z = THREE.MathUtils.randFloatSpread(5);

      vertices.push(x, y, z);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(vertices), 3)
    );

    const material = new THREE.PointsMaterial({
      color: 0x112277,
      size: 0.1,
      sizeAttenuation: true
    });

    const points = new THREE.Points(geometry, material);
    this._scene.add(points);
  }

  resize() {
    const width = this._divContainer.clientWidth;
    const height = window.innerHeight || document.documentElement.clientHeight ||
      document.body.clientHeight;
    this._camera.aspect = width / height;
    this._camera.updateProjectionMatrix();

    this._renderer.setSize(width, height);
  }

  render(time) {
    this._renderer.render(this._scene, this._camera);
    this.update(time);
    requestAnimationFrame(this.render.bind(this));
  }

  update(time) {
    time *= 0.001;
  }
}

// WebGL 지원여부에 따라 animate 실행
if (WebGL.isWebGLAvailable()) {
  window.onload = () => new App();
} else {
  const warning = WebGL.getWebGLErrorMessage();
  document.getElementById('app').appendChild(warning);
}