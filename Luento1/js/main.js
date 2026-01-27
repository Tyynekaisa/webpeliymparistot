// console.log(THREE);
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
    const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2) // leveys, korkeus, syvyys
    const material = new THREE.MeshBasicMaterial({ color: 0xff6666 }) // väri hexamuodossa
    const mesh = new THREE.Mesh(geometry, material) // yhdistää geometrian ja materiaalin meshiksi
    mesh.position.set(0.2, 0.2, -1) // asettaa positionin x, y, z
    // Toinen tapa asettaa position:
    // mesh.position.x = 0.1
    // mesh.position.y = 0.2
    // mesh.position.z = -0.5
    scene.add(mesh) // lisää mesh sceneseen

    const geometry2 = new THREE.SphereGeometry(0.1, 32, 32) // säde, leveyssegmentit, korkeussegmentit
    const material2 = new THREE.MeshPhongMaterial({ 
        color: 0x6666ff,
        shininess: 10,
        flatShading: false,
        opacity: 0.8
    }) // meshphongmateriaali reagoi valoon
    const mesh2 = new THREE.Mesh(geometry2, material2)
    mesh2.position.set(-0.2, 0.2, -1)
    scene.add(mesh2)

    // 5. Lisää valo sceneen
    const light = new THREE.HemisphereLight(0xffffff, 0x000000, 1) // ylävalo, alavalo, intensiteetti
    light.position.set(1, 1, 0.25)
    scene.add(light)

    animate()
    function animate() {
        renderer.setAnimationLoop(render) // kutsuu render-funktiota 60 kertaa sekunnissa
    }

    function render() {
        renderer.render(scene, camera) // renderöi scenen kameran näkökulmasta
    }

    // AR painike
    const arButton = ARButton.createButton(renderer)
    document.body.appendChild(arButton)

}