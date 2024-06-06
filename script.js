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
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
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

    // Function to create a capsule shape
    function createCapsule(radius, height, radialSegments, heightSegments) {
        const geometry = new THREE.CapsuleGeometry(radius, height - 2 * radius, radialSegments, heightSegments);
        const material = new THREE.MeshBasicMaterial({color: 0xFFBF00});
        return new THREE.Mesh(geometry, material);
    }

    // Add people (capsules)
    const radius = 0.3; // Approximate radius for a person
    for (let i = 0; i < numPeople; i++) {
        const angle = (i / numPeople) * 2 * Math.PI;
        const personX = (roomSide / 2 - 1) * Math.cos(angle);
        const personZ = (roomSide / 2 - 1) * Math.sin(angle);
        const person = createCapsule(radius, personHeight, 16, 16);
        person.position.set(personX, personHeight / 2, personZ); // Adjust Y position to center the capsule vertically
        scene.add(person);
    }

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

function createCapsule(radius, height, radialSegments, heightSegments) {
    const geometry = new THREE.CylinderGeometry(radius, radius, height - 2 * radius, radialSegments);
    const material = new THREE.MeshBasicMaterial({color: 0xFFBF00});
    
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
