/// <reference path="../../typings/index.d.ts" />
namespace ch02.page01 {
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let planeGeometry: THREE.PlaneGeometry;
    let plane: THREE.Mesh;
    let renderer:THREE.WebGLRenderer;

    let stats:Stats;

    let controls = {
        rotationSpeed: 0.02,
        addCube: addCube,
        removeCube: removeCube,
        outputObjects: outputObjects,
        numberOfObjects: 0
    };

    let gui = new dat.GUI();
    gui.add(controls, 'rotationSpeed', 0, 0.5);
    gui.add(controls, 'addCube');
    gui.add(controls, 'removeCube');
    gui.add(controls, 'outputObjects');
    gui.add(controls, 'numberOfObjects').listen();


    export function init() {
        stats = initStats();
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        scene.add(camera);

        renderer = new THREE.WebGLRenderer();
        renderer.setClearColor(0xEEEEEE);
        renderer.shadowMapEnabled = true;
        renderer.setSize(window.innerWidth, window.innerHeight);

        planeGeometry = new THREE.PlaneGeometry(60, 40, 1, 1);
        var planeMaterial = new THREE.MeshLambertMaterial({ color: 0xFFFFFF });
        plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.receiveShadow = true;
        // rotate and position the plane
        plane.rotation.x = -0.5 * Math.PI;
        plane.position.x = 0;
        plane.position.y = 0;
        plane.position.z = 0;
        scene.add(plane);

        var ambientLight = new THREE.AmbientLight(0x0C0C0C);
        scene.add(ambientLight);

        // add spotlight for the shadows
        var spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set(-40, 60, -10);
        spotLight.castShadow = true;
        scene.add(spotLight);

        camera.position.x = -30;
        camera.position.y = 40;
        camera.position.z = 30;
        camera.lookAt(scene.position);

        // scene.fog = new THREE.Fog(0xFFFFFF, 0.015, 100);
        scene.fog = new THREE.FogExp2(0xFFFFFF, 0.01);
        scene.overrideMaterial = new THREE.MeshLambertMaterial({color: 0xFFFFFF});

        document.getElementById("WebGL-output").appendChild(renderer.domElement);

        render();
    }

    function addCube() {
        const cubeSize = Math.ceil(Math.random() * 3);
        const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
        const cubeMaterial = new THREE.MeshLambertMaterial({ color: Math.random() * 0xFFFFFF });
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.castShadow = true;
        cube.name = 'cube-' + scene.children.length;
        cube.position.x = -30 + Math.round((Math.random() * planeGeometry.parameters.width));
        cube.position.y = Math.round((Math.random() * 5));
        cube.position.z = -20 + Math.round((Math.random() * planeGeometry.parameters.height));
        scene.add(cube);
        controls.numberOfObjects = scene.children.length;
    }

    function removeCube() {
        const allChildren = scene.children;
        const lastObject = allChildren[allChildren.length-1];
        if (lastObject instanceof THREE.Mesh) {
            scene.remove(lastObject);
            controls.numberOfObjects = scene.children.length;
        }
    }

    function outputObjects() {
        console.log(scene.children);
    }

    function render() {
        stats.update();
        scene.traverse(function(obj) {
            if (obj instanceof THREE.Mesh && obj != plane) {
                obj.rotation.x += controls.rotationSpeed;
                obj.rotation.y += controls.rotationSpeed;
                obj.rotation.z += controls.rotationSpeed;
            }
        });
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }

    function initStats(): Stats {
        var stats = new Stats();
        stats.setMode(0);
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';
        document.getElementById("Stats-output")
            .appendChild(stats.domElement);
        return stats;
    }
}

window.onload = ch02.page01.init;