import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Card from './Card';

import { gsap } from 'gsap';
import { GUI } from 'lil-gui';

const CARD_COLORS = [
    'blue', 'red', 'silver', 'gold'
]

function App() {
    const gui = new GUI()
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    })
    renderer.setClearAlpha(0.5)
    renderer.setClearColor(0xaaeeee, 0.5)
    renderer.setSize(window.innerWidth, window.innerHeight)

    document.body.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load('./textures/paper.jpg')
    scene.background = texture
    const camera = new THREE.PerspectiveCamera(
        75, window.innerWidth / window.innerHeight, 1, 500
    )
    camera.position.z = 25

    // orbit controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.autoRotate = true
    controls.autoRotateSpeed = 2.5
    controls.rotateSpeed = 0.75
    controls.enableDamping = true
    controls.enableZoom = false
    controls.minPolarAngle = Math.PI / 2 - Math.PI / 3
    controls.maxPolarAngle = Math.PI / 2 + Math.PI / 3

    // card
    const card = new Card({
        width: 10,
        height: 15.8,
        radius: 0.5,
        color: CARD_COLORS[0]
    })
    card.mesh.rotation.z = Math.PI * 0.1
    scene.add(card.mesh)

    gsap.to(card.mesh.rotation, {
        y: -Math.PI * 4,
        duration: 2.5,
        ease: 'slow'
    })

    // gui
    const cardFolder = gui.addFolder('Card')
    cardFolder
        .add(card.mesh.material, 'roughness')
        .min(0).max(1).step(0.01)
        .name('material.roughness')
    cardFolder
        .add(card.mesh.material, 'metalness')
        .min(0).max(1).step(0.01)
        .name('material.metalness')

    // light
    const ambientLight = new THREE.AmbientLight();
    ambientLight.intensity = 0.8;
    ambientLight.position.set(-5, -5, -5)

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.6)
    const directionalLight2 = directionalLight1.clone()

    directionalLight1.position.set(1, 1, 3)
    directionalLight2.position.set(-1, 1, -3)

    scene.add(directionalLight1, directionalLight2)
    scene.add(ambientLight)

    // resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
        renderer.render(scene, camera)
    })
    const loop = () => {
        controls.update()
        renderer.render(scene, camera)
        requestAnimationFrame(loop)
    }
    loop()

    const colorListContainer = document.querySelector('.color-list')
    CARD_COLORS.forEach(color => {
        const button = document.createElement('button')
        button.style.backgroundColor = color
        button.addEventListener('click', () => {
            card.mesh.material.color = new THREE.Color(color)
            gsap.to(card.mesh.rotation, { y: card.mesh.rotation.y - Math.PI / 2, duration: 1, ease: 'back' })
        })
        colorListContainer.appendChild(button)
    })
}

window.addEventListener('load', App)