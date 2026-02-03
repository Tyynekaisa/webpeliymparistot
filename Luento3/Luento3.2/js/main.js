import { ARButton } from 'https://unpkg.com/three@0.126.0/examples/jsm/webxr/ARButton.js'

let camera, scene, renderer
let controller
let mesh, pointer
let hitTestSourceAvailable = false
let hitTestSource = null
let localSpace = null


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
    
    // 4. Create geometry
    const ringGeometry = new THREE.RingBufferGeometry(0.25, 0.3, 16).rotateX(-Math.PI / 2)
    const ringMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })
    pointer = new THREE.Mesh(ringGeometry, ringMaterial)
    pointer.matrixAutoUpdate = false
    pointer.visible = false
    scene.add(pointer)

    controller = renderer.xr.getController(0)
    controller.addEventListener('select', onSelect, false)
    scene.add(controller)

    function onSelect() {
        // console.log('Select event fired')
        if (pointer.visible) {
            const geometry = new THREE.ConeGeometry(0.2, 0.2, 16)
            const material = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff })
            mesh = new THREE.Mesh(geometry, material)
            mesh.position.setFromMatrixPosition(pointer.matrix)
            mesh.quaternion.setFromRotationMatrix(controller.matrixWorld)
            scene.add(mesh)
        }
    }

    // 5. Light, animation and render
    const light = new THREE.HemisphereLight(0xffffff, 0x000000, 1)
    light.position.set(1, 1, 0.25)
    scene.add(light)

    animate()
    function animate() {
        renderer.setAnimationLoop(render)
    }

    function render(timeStamp, frame) {
        if (frame) {
            if (!hitTestSourceAvailable) {
                initHitSource()
            }
            if (hitTestSourceAvailable) {
                const hitTestResult = frame.getHitTestResults(hitTestSource)
                if (hitTestResult.length > 0) {
                    const hitPoint = hitTestResult[0]
                    const pose = hitPoint.getPose(localSpace)
                    pointer.matrix.fromArray(pose.transform.matrix)
                    pointer.visible = true
                } else {
                    pointer.visible = false
                }
            }
        }
        renderer.render(scene, camera)
    }

    async function initHitSource() {
        const session = renderer.xr.getSession()
        const viewerSpace = await session.requestReferenceSpace('viewer')
        localSpace = await session.requestReferenceSpace('local')
        hitTestSource = await session.requestHitTestSource({ space: viewerSpace })
        hitTestSourceAvailable = true
        session.addEventListener('end', () => {
            hitTestSourceAvailable = false
            hitTestSource = null
        })
    }


    // 6. AR button
    const arButton = ARButton.createButton(renderer, {
        requiredFeatures: ['hit-test']
    })
    document.body.appendChild(arButton)

}
