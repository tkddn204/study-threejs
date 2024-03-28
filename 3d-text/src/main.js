import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui'

async function Font() {
    const fontLoader = new FontLoader();
    const font = await fontLoader.loadAsync('assets/fonts/SKYBORI_Regular.json');

    const textGeometry = new TextGeometry('안녕', {
        font,
        size: 0.5,
        height: 0.2,
        bevelEnabled: true,
        bevelSegments: 5,
        bevelSize: 0.02,
        bevelThickness: 0.02
    })
    const textMaterial = new THREE.MeshPhongMaterial({
        color: 0x00ff00
    })

    // textGeometry.computeBoundingBox()
    // textGeometry.translate(
    //     -(textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x) * 0.5,
    //     -(textGeometry.boundingBox.max.y - textGeometry.boundingBox.min.y) * 0.5,
    //     -(textGeometry.boundingBox.max.z - textGeometry.boundingBox.min.z) * 0.5,
    // )

    textGeometry.center()
    textMaterial.map = Texture()

    return new THREE.Mesh(textGeometry, textMaterial)
}

function Plane() {
    const planeGeometry = new THREE.PlaneGeometry(2000, 2000)
    const planeMaterial = new THREE.MeshPhongMaterial({ color: 'black' })
    const plane = new THREE.Mesh(planeGeometry, planeMaterial)
    plane.position.z = -10
    return plane
}

function Texture() {
    const textureLoader = new THREE.TextureLoader();
    return textureLoader.load('assets/textures/paper.jpg')
}

function Light() {
    return {
        ambient: new THREE.AmbientLight('white', 1),
        point: new THREE.PointLight('white', 3),
        spot: (() => {
            const spotLight = new THREE.SpotLight('white', 2.5, Math.PI * 0.15, 0.2, 0.5)
            spotLight.position.set(0, 0, 3)
            return spotLight
        })()
    }
}

function App() {
    const gui = new GUI()
    const renderer = new THREE.WebGLRenderer({
        antialias: true
    })
    renderer.setSize(window.innerWidth, window.innerHeight)

    document.body.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
        75, window.innerWidth / window.innerHeight, 1, 500
    )
    camera.position.set(0, 1, 5)

    new OrbitControls(camera, renderer.domElement)

    Font().then(font => scene.add(font))

    const plane = Plane()
    scene.add(plane, new THREE.PlaneHelper(plane))

    const light = Light()
    scene.add(light.ambient)
    scene.add(light.spot, new THREE.SpotLightHelper(light.spot))
    // scene.add(light.point, new THREE.PointLightHelper(light.point, 0.5))

    gui.add(light.point.position, 'x')
        .min(-3).max(3).step(0.1)

    const loop = () => {
        camera.updateProjectionMatrix()

        renderer.render(scene, camera)
        requestAnimationFrame(loop)
    }

    loop()
}

window.addEventListener('load', App)