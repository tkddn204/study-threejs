import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';

// three.js를 개발할 때는 3종세트가 필요함
// scene, camera and renderer
// 카메라로 씬을 렌더링하는 것

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xeeeeee);
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
camera.position.set(0, 0, 50);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

function createCube() {
  const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
  const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });

  return new THREE.Mesh(cubeGeometry, cubeMaterial);
}
function rotateCube() {
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
}

function createLine() {
  const lineMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff });
  const points = [
    new THREE.Vector3(-10, 0, 0),
    new THREE.Vector3(0, 10, 0),
    new THREE.Vector3(10, 0, 0)
  ];
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
  return new THREE.Line(lineGeometry, lineMaterial);
}

const cube = createCube();
const line = createLine();

scene.add(cube);
scene.add(line);

function animate() {
  requestAnimationFrame(animate);

  rotateCube();

  renderer.render(scene, camera);
}

// WebGL 지원여부에 따라 animate 실행
if (WebGL.isWebGLAvailable()) {
  animate();
} else {
  const warning = WebGL.getWebGLErrorMessage();
  document.getElementById('container').appendChild(warning);
}