import { ARButton } from "https://unpkg.com/three@0.126.0/examples/jsm/webxr/ARButton.js"
import { FBXLoader } from "https://unpkg.com/three@0.126.0/examples/jsm/loaders/FBXLoader.js"

let camera, scene, renderer

init()
function init() {
    const container = document.createElement('div')
    document.body.appendChild(container) // appendChild lisää elementin bodyyn viimeiseksi lapsielementiksi

    // 1. Luo scene
    scene = new THREE.Scene()

    // 2. Luo kamera
    camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1, 
        100
    )

    // 3. Luo renderer
    renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true 
    })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.xr.enabled = true
    container.appendChild(renderer.domElement)

    // Lisäksi import { FBXLoader } from "https://unpkg.com/three@0.126.0/examples/jsm/loaders/FBXLoader.js"
    // 4. Lataa malli
    const modelURL = "./fbx/DoughNut_FBX.fbx"
    const fbxLoader = new FBXLoader()
    let model = undefined
    fbxLoader.load(
        modelURL,
        function (object) {
            model = object
            model.scale.set(0.05, 0.05, 0.05)
            object.position.z = -10
            scene.add(model)
            console.log('model:', model)
        },
        function (xhr) {
            console.log('xhr:', xhr)
        },
        function (error) {
            console.log('error:', error)
        }
    )

    // 5. Valo, animointi ja renderöinti
    const light = new THREE.HemisphereLight(0xffffff, 0x000000, 1)
    light.position.set(1, 1, 0.25)
    scene.add(light)

    animate()
    function animate() {
        renderer.setAnimationLoop(render)
    }

    function render() {
        rotate()
        renderer.render(scene, camera)
    }

    let rot = 0
    function rotate() {
        rot += 0.01
        if (model != undefined) {
            model.rotation.y = rot;
            model.rotation.x = rot*2;
            // model.rotation.z = rot;
        }
    }

    // 6. AR painike
    const arButton = ARButton.createButton(renderer)
    document.body.appendChild(arButton)

}