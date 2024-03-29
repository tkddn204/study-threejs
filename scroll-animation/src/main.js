import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
// import { GUI } from 'lil-gui';

async function App() {
    gsap.registerPlugin(ScrollTrigger)

    const scrollParams = {
        waveColor: '#79edff',
        backgroundColor: '#ffffff',
        fogColor: '#ffffff'
    }

    // const gui = new GUI()
    const clock = new THREE.Clock()

    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        canvas: document.querySelector('#canvas')
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
        75, window.innerWidth / window.innerHeight, 1, 500
    )
    camera.position.set(0, 25, 100)

    // fog
    scene.fog = new THREE.Fog(0xf0f0f0, 0.1, 500)
    // gui.add(scene.fog, 'near')
    //     .min(0)
    //     .max(100)
    //     .step(0.1)

    // gui.add(scene.fog, 'far')
    //     .min(100)
    //     .max(500)
    //     .step(0.1)

    // wave
    const waveGeometry = new THREE.PlaneGeometry(1000, 1000, 100, 100)
    const waveHeight = 2

    const initialZPositions = []

    for (let i = 0; i < waveGeometry.attributes.position.count; i++) {
        const z = waveGeometry.attributes.position.getZ(i) + (Math.random() - 0.5) * waveHeight;
        waveGeometry.attributes.position.setZ(i, z)
        initialZPositions.push(z)
    }
    const waveMaterial = new THREE.MeshStandardMaterial({
        // wireframe: true,
        color: new THREE.Color(scrollParams.waveColor)
    })

    const wave = new THREE.Mesh(waveGeometry, waveMaterial)
    wave.rotation.x = -Math.PI / 2
    wave.receiveShadow = true
    wave.update = () => {
        const elapsedTime = clock.getElapsedTime()
        renderer.render(scene, camera)
        for (let i = 0; i < waveGeometry.attributes.position.count; i++) {
            const z = initialZPositions[i] + Math.sin(elapsedTime * 3 + i ** 2) * waveHeight
            waveGeometry.attributes.position.setZ(i, z)
        }
    }
    scene.add(wave)

    // boat
    const gltfLoader = new GLTFLoader()

    const model = await gltfLoader.loadAsync('./models/boat.glb')
    const boat = model.scene
    boat.position.set(0, 4, 0)
    boat.rotation.y = Math.PI
    boat.scale.set(2, 2, 2)
    boat.castShadow = true
    boat.traverse(obj => {
        if (obj.isMesh) {
            obj.castShadow = true
        }
    })
    boat.update = () => {
        const elapsedTime = clock.getElapsedTime()
        boat.position.y = Math.sin(elapsedTime * 3)
    }
    scene.add(boat)

    // light
    const pointLight = new THREE.PointLight(0xffffff, 5000, 100)
    pointLight.castShadow = true
    pointLight.shadow.mapSize.width = 1024
    pointLight.shadow.mapSize.height = 1024
    pointLight.shadow.radius = 10
    pointLight.position.set(0, 25, 15)
    scene.add(pointLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(-15, 15, 15)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.width = 1024
    directionalLight.shadow.mapSize.height = 1024
    directionalLight.shadow.radius = 10
    scene.add(directionalLight)

    // scroll
    gsap.timeline({
        scrollTrigger: {
            trigger: '.wrapper',
            start: 'top top',
            end: 'bottom bottom',
            scrub: true
        }
    })
        .to(scrollParams, {
            waveColor: '#1466b8',
            onUpdate: () => {
                waveMaterial.color = new THREE.Color(scrollParams.waveColor)
            },
            duration: 1.5
        })
        .to(scrollParams, {
            backgroundColor: '#2a2a2a',
            onUpdate: () => {
                scene.background = new THREE.Color(scrollParams.backgroundColor)
            },
            duration: 1.5
        }, '<')
        .to(scrollParams, {
            fogColor: '#2f2f2f',
            onUpdate: () => {
                scene.fog.color = new THREE.Color(scrollParams.fogColor)
            },
            duration: 1.5
        }, '<')
        .to(camera.position, {
            x: 100,
            z: -50,
            duration: 2.5
        })
        .to(boat.position, {
            z: 150,
            duration: 2
        })
        .to(pointLight.position, {
            z: 165,
            duration: 2
        }, '<')
        .to(camera.position, {
            x: -50,
            y: 25,
            z: 100,
            duration: 2
        })
        .to(camera.position, {
            x: 0,
            y: 50,
            z: 300,
            duration: 2
        })

    gsap.to('.title', {
        opacity: 0,
        scrollTrigger: {
            trigger: '.wrapper',
            end: '+=500',
            scrub: true,
            pin: true
        }
    })

    // resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
        renderer.render(scene, camera)
    })

    const loop = () => {
        // controls.update()
        boat.update()
        camera.lookAt(boat.position)
        wave.update()

        waveGeometry.attributes.position.needsUpdate = true
        requestAnimationFrame(loop)
    }
    loop()
}

window.addEventListener('load', App)