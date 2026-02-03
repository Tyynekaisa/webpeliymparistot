import { ARButton } from 'https://unpkg.com/three@0.126.0/examples/jsm/webxr/ARButton.js'

let camera, scene, renderer
let controller
let mesh

init()
function init() {
    const container = document.createElement('div')
    document.body.appendChild(container)

    // 1. Create scene
    scene = new THREE.Scene()

    // 2. Create camera
    camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1, 
        100
    )

    // 3. Create renderer
    renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true 
    })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.xr.enabled = true
    container.appendChild(renderer.domElement)

    controller = renderer.xr.getController(0)
    // console.log('Controller: ', controller)
    controller.addEventListener('select', onSelect, false)
    scene.add(controller)

    function onSelect() { // Event handler for 'select' event
        console.log('Select event fired')
        const geometry = new THREE.ConeGeometry(0.2, 0.2, 16).rotateX(Math.PI / 2)
        const material = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff })
        mesh = new THREE.Mesh(geometry, material)
        mesh.position.set(0, 0, -2).applyMatrix4(controller.matrixWorld)
        mesh.quaternion.setFromRotationMatrix(controller.matrixWorld)
        scene.add(mesh)

    }

    // 4. Create geometry


    // 5. Light, animation and render
    const light = new THREE.HemisphereLight(0xffffff, 0x000000, 1)
    light.position.set(1, 1, 0.25)
    scene.add(light)

    animate()
    function animate() {
        renderer.setAnimationLoop(render)
    }

    function render() {
        renderer.render(scene, camera)
    }


    // 6. AR button
    const arButton = ARButton.createButton(renderer)
    document.body.appendChild(arButton)

}