function drawRoom() {
    // Get input values
    const roomSize = parseInt(document.getElementById('roomSize').value);
    const numPeople = parseInt(document.getElementById('numPeople').value);
    const personHeight = parseInt(document.getElementById('personHeight').value);

    // Calculate room dimensions (assuming square room for simplicity)
    const roomSide = Math.sqrt(roomSize);

    // Remove previous scene if any
    const oldCanvas = document.querySelector('#canvas-container canvas');
    if (oldCanvas) {
        oldCanvas.remove();
    }

    // Set up the scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(600, 600);
    document.getElementById('canvas-container').appendChild(renderer.domElement);

    // Add grid helper
    const gridHelper = new THREE.GridHelper(roomSide, 10, 0xFFBF00, 0xFFBF00);
    scene.add(gridHelper);

    // Add axes helper
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    // Add lighting
    const light = new THREE.PointLight(0xFFFFFF);
    light.position.set(10, 10, 10);
    scene.add(light);

    // Add the room (a simple cube)
    const roomGeometry = new THREE.BoxGeometry(roomSide, roomSide, roomSide);
    const roomMaterial = new THREE.MeshBasicMaterial({color: 0xFFBF00, wireframe: true});
    const room = new THREE.Mesh(roomGeometry, roomMaterial);
    scene.add(room);

    // Load character model
    const loader = new THREE.GLTFLoader();
    loader.load('path/to/character.glb', function(gltf) {
        const model = gltf.scene;
        model.scale.set(0.1, 0.1, 0.1);  // Adjust scale as necessary
        for (let i = 0; i < numPeople; i++) {
            const angle = (i / numPeople) * 2 * Math.PI;
            const personX = (roomSide / 2 - 1) * Math.cos(angle);
            const personZ = (roomSide / 2 - 1) * Math.sin(angle);
            const person = model.clone();
            person.position.set(personX, 0, personZ);
            person.scale.set(personHeight / 6, personHeight / 6, personHeight / 6);  // Adjust scale to match person height
            scene.add(person);
        }
    }, undefined, function(error) {
        console.error(error);
    });

    // Position the camera
    camera.position.z = roomSide * 1.5;

    // Add rotation to the scene
    function animate() {
        requestAnimationFrame(animate);

        // Rotate the scene
        scene.rotation.y += 0.01;

        renderer.render(scene, camera);
    }
    animate();
}

