import { ARButton } from "https://unpkg.com/three@0.126.0/examples/jsm/webxr/ARButton.js"

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
    ) // fov, aspect, near, far

    // 3. Luo renderer
    renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true 
    }) // antialias pehmentää reunoja, alpha mahdollistaa läpinäkyvyyden
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.xr.enabled = true // mahdollistaa AR- ja VR-tilat
    container.appendChild(renderer.domElement)

    // 4. Luo geometriat, materiaalit ja meshit
    // Kuutio
    const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2) // leveys, korkeus, syvyys
    const material = new THREE.MeshPhongMaterial({ 
        color: 0xff6666,
        shininess: 10,
        flatShading: false,
        opacity: 0.8
    }) // meshphongmateriaali reagoi valoon
    const cubeMesh = new THREE.Mesh(geometry, material) // yhdistää geometrian ja materiaalin meshiksi
    cubeMesh.position.set(0.2, 0.2, -1) // asettaa positionin x, y, z
    scene.add(cubeMesh) // lisää mesh sceneseen

    // Pallo
    const geometry2 = new THREE.SphereGeometry(0.1, 32, 32) // säde, leveyssegmentit, korkeussegmentit
    const material2 = new THREE.MeshPhongMaterial({ 
        color: 0x049ef4,
        shininess: 10,
        flatShading: false,
        opacity: 0.8
    }) // meshphongmateriaali reagoi valoon
    const sphereMesh = new THREE.Mesh(geometry2, material2)
    sphereMesh.position.set(-0.2, 0.2, -1)
    scene.add(sphereMesh)

    // Donitsi
    const geometry3 = new THREE.TorusGeometry(0.1, 0.035, 16, 100) // säde, putkisäde, leveyssegmentit, korkeussegmentit
    const material3 = new THREE.MeshPhongMaterial({ 
        color: 0xff9ef4,
        shininess: 10,
        flatShading: false,
        opacity: 0.8
    })
    const torusMesh = new THREE.Mesh(geometry3, material3)
    torusMesh.position.set(-0.2, -0.2, -1)
    scene.add(torusMesh)

    // TorusKnot
    const geometry4 = new THREE.TorusKnotGeometry(0.07, 0.03, 100, 16) // säde, putkisäde, pituussegmentit, leveyssegmentit
    const material4 = new THREE.MeshPhongMaterial({ 
        color: 0x66ffcc,
        shininess: 10,
        flatShading: false,
        opacity: 0.8
    })
    const torusKnotMesh = new THREE.Mesh(geometry4, material4)
    torusKnotMesh.position.set(0.2, -0.2, -1)
    scene.add(torusKnotMesh)

    // Icosahedron
    const geometry5 = new THREE.IcosahedronGeometry(0.13, 0) // säde, tasoitus
    const material5 = new THREE.MeshPhongMaterial({
        color: 0xffff66,
        shininess: 10,
        flatShading: false,
        opacity: 0.6
    })
    const icosahedronMesh = new THREE.Mesh(geometry5, material5)
    icosahedronMesh.position.set(0, 0, -1)
    scene.add(icosahedronMesh)



    // 5. Lisää valo sceneen
    const light = new THREE.HemisphereLight(0xffffff, 0x000000, 1) // ylävalo, alavalo, intensiteetti
    light.position.set(1, 1, 0.25)
    scene.add(light)

    // 6. Animointi ja renderöinti

    animate()
    function animate() {
        renderer.setAnimationLoop(render) // kutsuu render-funktiota 60 kertaa sekunnissa
    }

    function render() {
        torusMesh.rotation.x += 0.02
        icosahedronMesh.rotation.y += 0.02
        icosahedronMesh.rotation.x += 0.02
        torusKnotMesh.rotation.y += 0.02
        torusKnotMesh.rotation.z += -0.02
        cubeMesh.rotation.x += 0.01
        cubeMesh.rotation.y += 0.01
        renderer.render(scene, camera) // renderöi scenen kameran näkökulmasta
    }

    // AR painike
    const arButton = ARButton.createButton(renderer)
    document.body.appendChild(arButton)

}