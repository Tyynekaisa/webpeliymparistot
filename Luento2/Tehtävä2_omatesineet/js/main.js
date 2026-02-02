import { ARButton } from "https://unpkg.com/three@0.126.0/examples/jsm/webxr/ARButton.js"
// import { FBXLoader } from "https://unpkg.com/three@0.126.0/examples/jsm/loaders/FBXLoader.js"

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

    // 4. Lataa malli
    const modelURL = "./gltf/omatesineet.glb"
    const gltfLoader = new THREE.GLTFLoader()
    let model = undefined
    gltfLoader.load(
        modelURL,
        function (file) {
            model = file.scene
            scene.add(model)
            console.log('file:', file)
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
    const light = new THREE.HemisphereLight(0xffffff, 0x000000, 1.2)
    light.position.set(1, 1, 0.25)
    scene.add(light)

    const light2 = new THREE.DirectionalLight(0xffffff, 0.5) // Lisävalo
    light.position.set(5, 10, 7)
    scene.add(light2)


    animate()
    function animate() {
        renderer.setAnimationLoop(render)
    }

    function render() {
        rotate()
        renderer.render(scene, camera)
    }

    let rot = 0
    let time = 0
    const maxAngle = 8
    function rotate() {
        rot += 0.1
        time += 0.01
        if (model != undefined) {
            model.rotation.y = THREE.Math.degToRad(rot) // Pyörii keskipisteen ympäri
            const angle = Math.sin(time) * maxAngle
            model.rotation.x = THREE.Math.degToRad(angle) // Pieni keinumisliike
            model.rotation.z = THREE.Math.degToRad(angle) // Pieni keinumisliike
        }
    }

    // 6. AR painike
    const arButton = ARButton.createButton(renderer)
    document.body.appendChild(arButton)

}