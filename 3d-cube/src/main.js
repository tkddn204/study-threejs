import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

function App() {
    const renderer = new THREE.WebGLRenderer({
        antialias: true
    })
    renderer.setSize(window.innerWidth, window.innerHeight)

    document.body.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      75, window.innerWidth / window.innerHeight, 1, 500
    )

    const geometry = new THREE.IcosahedronGeometry(1)
    const material = new THREE.MeshStandardMaterial({
        color: 0xeeeeee,
        emissive: 0x111111
    })
    const cube = new THREE.Mesh(geometry, material)

    const skeletonGeometry = new THREE.IcosahedronGeometry(2)
    const skeletonMaterial = new THREE.MeshBasicMaterial(({
        wireframe: true,
        transparent: true,
        opacity: 0.2,
        color: 0xaaaaaa
    }))

    const skeleton = new THREE.Mesh(skeletonGeometry, skeletonMaterial)

    scene.add(cube, skeleton)

    camera.aspect = window.innerWidth / window.innerHeight
    camera.position.z = 5
    camera.position.set(3, 4, 5)
    camera.lookAt(cube.position)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.autoRotate = true
    controls.enableDamping = true
    controls.maxDistance = 10
    controls.minDistance = 3

    const axesHelper = new THREE.AxesHelper(5)
    scene.add(axesHelper)

    const directionalLight = new THREE.DirectionalLight('white', 1);
    directionalLight.position.set(-1, 2, 3)

    scene.add(directionalLight)

    const ambientLight = new THREE.AmbientLight('black', 0.1);
    ambientLight.position.set(3, 2, 1)
    scene.add(ambientLight)

    const clock = new THREE.Clock()

    const loop = () => {
        camera.updateProjectionMatrix()
        controls.update()

        renderer.render(scene, camera)
        requestAnimationFrame(loop)
    }

    loop()

    const gui = new GUI()
    gui.add(cube.position, 'y', -3, 3)

}

window.addEventListener('load', App)