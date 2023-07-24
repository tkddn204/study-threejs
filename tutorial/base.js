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
    this._camera.position.z = 2;
  }

  _setupLight() {
    const color = 0xffffff;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    this._scene.add(light);
  }


  _setupModel() {
    const geometry = new THREE.ConeGeometry(
      0.5, 2, 3
    );
    const material = new THREE.MeshPhongMaterial({ color: 0x515151 });
    // const material = new THREE.MeshBasicMaterial({ color: 0x456789 });
    const cube = new THREE.Mesh(geometry, material);

    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffff00 });
    const line = new THREE.LineSegments(
      new THREE.WireframeGeometry(geometry), lineMaterial
    );

    const group = new THREE.Group();
    group.add(cube);
    group.add(line);

    this._scene.add(group);
    this._cube = group;
  }

  resize() {
    const width = this._divContainer.clientWidth;
    const height = window.innerHeight;
    console.log(height);
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
    // this._cube.rotation.x = time;
    // this._cube.rotation.y = time;
  }
}

// WebGL 지원여부에 따라 animate 실행
if (WebGL.isWebGLAvailable()) {
  window.onload = () => new App();
} else {
  const warning = WebGL.getWebGLErrorMessage();
  document.getElementById('app').appendChild(warning);
}