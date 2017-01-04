/// <reference path="../../typings/index.d.ts" />
namespace ch02.page05 {
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let planeGeometry: THREE.PlaneGeometry;
    let plane: THREE.Mesh;
    let renderer: THREE.WebGLRenderer;
    let mesh: THREE.Object3D;
    let stats: Stats;
    let controlPoints = [
        { x: 3, y: 5, z: 3 },
        { x: 3, y: 5, z: 0 },
        { x: 3, y: 0, z: 3 },
        { x: 3, y: 0, z: 0 },
        { x: 0, y: 5, z: 0 },
        { x: 0, y: 5, z: 3 },
        { x: 0, y: 0, z: 0 },
        { x: 0, y: 0, z: 3 },
    ];

    let controls = {
        clone: clone
    };


    let gui = new dat.GUI();
    gui.add(controls, 'clone');

    for (var i = 0; i < 8; i++) {
        let f1 = gui.addFolder('Vertices ' + (i + 1));
        f1.add(controlPoints[i], 'x', -10, 10);
        f1.add(controlPoints[i], 'y', -10, 10);
        f1.add(controlPoints[i], 'z', -10, 10);

    }


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

        var vertices = [
            new THREE.Vector3(1, 3, 1),
            new THREE.Vector3(1, 3, -1),
            new THREE.Vector3(1, -1, 1),
            new THREE.Vector3(1, -1, -1),
            new THREE.Vector3(-1, 3, -1),
            new THREE.Vector3(-1, 3, 1),
            new THREE.Vector3(-1, -1, -1),
            new THREE.Vector3(-1, -1, 1)
        ];

        var faces = [
            new THREE.Face3(0, 2, 1),
            new THREE.Face3(2, 3, 1),
            new THREE.Face3(4, 6, 5),
            new THREE.Face3(6, 7, 5),
            new THREE.Face3(4, 5, 1),
            new THREE.Face3(5, 0, 1),
            new THREE.Face3(7, 6, 2),
            new THREE.Face3(6, 3, 2),
            new THREE.Face3(5, 7, 0),
            new THREE.Face3(7, 2, 0),
            new THREE.Face3(1, 3, 4),
            new THREE.Face3(3, 6, 4),
        ];

        var geom = new THREE.Geometry();
        geom.faces = faces;
        geom.vertices = vertices;
        geom.computeFaceNormals();

        var materials = [
            new THREE.MeshLambertMaterial({ opacity: 0.6, color: 0x444444, transparent: true }),
            new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true })
        ];

        mesh = THREE.SceneUtils.createMultiMaterialObject(geom, materials);
        mesh.children.forEach(function (e) {
            e.castShadow = true;
        });

        scene.add(mesh);


        var ambientLight = new THREE.AmbientLight(0x0C0C0C);
        scene.add(ambientLight);

        // add spotlight for the shadows
        var spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set(-40, 60, -10);
        spotLight.castShadow = true;
        scene.add(spotLight);

        camera.position.x = -20;
        camera.position.y = 25;
        camera.position.z = 20;
        camera.lookAt(scene.position);

        // scene.fog = new THREE.Fog(0xFFFFFF, 0.015, 100);
        scene.fog = new THREE.FogExp2(0xFFFFFF, 0.01);
        // scene.overrideMaterial = new THREE.MeshLambertMaterial({ color: 0xFFFFFF });

        document.getElementById("WebGL-output").appendChild(renderer.domElement);

        render();
    }

    function clone() {
        var clonedGeometry = mesh.children[0].geometry.clone();
        var materials = [
            new THREE.MeshLambertMaterial({ opacity: 0.6, color: 0xFF44FF, transparent: true }),
            new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true })
        ];
        var mesh2 = THREE.SceneUtils.createMultiMaterialObject(clonedGeometry, materials);
        mesh2.children.forEach(function (childMesh) {
            childMesh.castShadow = true;
        });
        mesh2.translateX(5);
        mesh2.translateY(5);
        mesh2.name = 'clone';
        scene.remove(scene.getChildByName("clone"));
        scene.add(mesh2);
    }

    function render() {
        stats.update();
        // customized code
        var vertices = [];
        for (let i = 0; i < 8; i++) {
            vertices.push(new THREE.Vector3(
                controlPoints[i].x,
                controlPoints[i].y,
                controlPoints[i].z
            ));
        }
        mesh.children.forEach(function (childMesh) {
            childMesh.geometry.vertices = vertices;
            childMesh.geometry.verticesNeedUpdate = true;
            childMesh.geometry.computeFaceNormals();

        });
        // customized code - end
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

window.onload = ch02.page05.init;