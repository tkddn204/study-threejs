import * as THREE from 'three';

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
    camera.position.z = 5

    // resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
        renderer.render(scene, camera)
    })
    const loop = () => {
        // controls.update()
        renderer.render(scene, camera)
        requestAnimationFrame(loop)
    }
    loop()
}

window.addEventListener('load', App)