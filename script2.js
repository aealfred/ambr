let rotate = true;
function pauseAnimation() {
    rotate = false;
    document.getElementById('pauseButton').style.display = 'none';
    document.getElementById('playButton').style.display = 'inline-block';
}

function playAnimation() {
    rotate = true;
    document.getElementById('pauseButton').style.display = 'inline-block';
    document.getElementById('playButton').style.display = 'none';
}

function drawRoom() {
    const roomSize = parseInt(document.getElementById('roomSize').value);
    const quantity = parseInt(document.getElementById('quantity').value);
    const secondStory = document.getElementById('secondStory').checked;
    const firstStoryHeight = parseInt(document.getElementById('firstStoryHeight').value);
    const secondStoryHeight = parseInt(document.getElementById('secondStoryHeight').value);
    const distribution = document.getElementById('distribution').value;

    const shapeHeight = 6; 

    const roomHeight = secondStory ? firstStoryHeight + secondStoryHeight : firstStoryHeight;
    const roomLength = Math.sqrt(roomSize);
    const roomWidth = roomSize / roomLength;

    const oldCanvas = document.querySelector('#canvas-container canvas');
    if (oldCanvas) {
        oldCanvas.remove();
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('canvas-container').appendChild(renderer.domElement);

    const gridHelper = new THREE.GridHelper(roomLength, 10, 0xFF8C00}, 0xFF8C00});
    gridHelper.position.y = 0;
    scene.add(gridHelper);

    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    const light = new THREE.PointLight(0xFFFFFF);
    light.position.set(10, 10, 10);
    scene.add(light);

    const roomGeometry = new THREE.BoxGeometry(roomLength, roomHeight, roomWidth);
    const roomMaterial = new THREE.MeshBasicMaterial({color: 0xFF8C00}, wireframe: true});
    const room = new THREE.Mesh(roomGeometry, roomMaterial);
    room.position.y = roomHeight / 2;
    scene.add(room);

    if (secondStory) {
        const secondFloorGeometry = new THREE.BoxGeometry(roomLength, 0.1, roomWidth);
        const secondFloorMaterial = new THREE.MeshBasicMaterial({color: 0xFF8C00}, wireframe: true});
        const secondFloor = new THREE.Mesh(secondFloorGeometry, secondFloorMaterial);
        secondFloor.position.y = firstStoryHeight + 0.05;
        scene.add(secondFloor);

        const secondGridHelper = new THREE.GridHelper(roomLength, 10, 0xFF8C00}, 0xFF8C00});
        secondGridHelper.position.y = firstStoryHeight;
        scene.add(secondGridHelper);
    }

    function createCapsule(radius, height, radialSegments, heightSegments) {
        const geometry = new THREE.CylinderGeometry(radius, radius, height - 2 * radius, radialSegments);
        const material = new THREE.MeshBasicMaterial({color: 0xFF8C00}});
        
        const cylinder = new THREE.Mesh(geometry, material);
        
        const sphereGeometry = new THREE.SphereGeometry(radius, radialSegments, heightSegments);
        const topSphere = new THREE.Mesh(sphereGeometry, material);
        const bottomSphere = new THREE.Mesh(sphereGeometry, material);
        
        topSphere.position.y = (height / 2) - radius;
        bottomSphere.position.y = -(height / 2) + radius;
        
        const capsule = new THREE.Group();
        capsule.add(cylinder);
        capsule.add(topSphere);
        capsule.add(bottomSphere);
        
        return capsule;
    }

    const positions = [];
    const radius = 0.5;
    const maxColumns = Math.floor(Math.sqrt(quantity));
    const horizontalSpacing = roomLength / (maxColumns + 1);
    const numRows = Math.ceil(quantity / maxColumns);
    const verticalSpacing = roomWidth / (numRows + 1);

    if (distribution === 'grid') {
        for (let i = 0; i < quantity; i++) {
            const row = Math.floor(i / maxColumns);
            const col = i % maxColumns;
            const shapeX = -roomLength / 2 + (col + 1) * horizontalSpacing;
            const shapeZ = -roomWidth / 2 + (row + 1) * verticalSpacing;

            let shapeY;
            if (secondStory) {
                shapeY = (i % 2 === 0) ? shapeHeight / 2 : firstStoryHeight + shapeHeight / 2 + 0.1;
            } else {
                shapeY = shapeHeight / 2;
            }

            positions.push({ x: shapeX, y: shapeY, z: shapeZ });
        }
    } else if (distribution === 'random') {
        for (let i = 0; i < quantity; i++) {
            const shapeX = Math.random() * roomLength - roomLength / 2;
            const shapeZ = Math.random() * roomWidth - roomWidth / 2;

            let shapeY;
            if (secondStory) {
                shapeY = Math.random() < 0.5 ? shapeHeight / 2 : firstStoryHeight + shapeHeight / 2 + 0.1;
            } else {
                shapeY = shapeHeight / 2;
            }

            positions.push({ x: shapeX, y: shapeY, z: shapeZ });
        }
    }

    positions.forEach(position => {
        const shape = createCapsule(radius, shapeHeight, 16, 16);
        shape.position.set(position.x, position.y, position.z);
        scene.add(shape);
    });

    camera.position.set(0, roomHeight / 2, roomLength * 1.5);
    camera.lookAt(0, roomHeight / 2, 0);

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false;
    controls.maxPolarAngle = Math.PI;

    window.addEventListener('wheel', (event) => {
        if (event.deltaY < 0) {
            camera.position.z -= 1;
        } else {
            camera.position.z += 1;
        }
    });

    function animate() {
        requestAnimationFrame(animate);

        if (rotate) {
            scene.rotation.y += 0.01;
        }

        renderer.render(scene, camera);
    }
    animate();

    function exportGLB() {
        const exporter = new THREE.GLTFExporter();
        exporter.parse(scene, function (gltf) {
            const blob = new Blob([gltf], { type: 'model/gltf-binary' });
            const link = document.createElement('a');
            link.style.display = 'none';
            document.body.appendChild(link);
            link.href = URL.createObjectURL(blob);
            link.download = 'room_layout.glb';
            link.click();
            URL.revokeObjectURL(link.href);
            document.body.removeChild(link);
        }, { binary: true });
    }

    document.getElementById('exportGLB').addEventListener('click', exportGLB);
}  
