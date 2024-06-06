        function drawRoom() {
            const roomSize = parseInt(document.getElementById('roomSize').value);
            const numPeople = parseInt(document.getElementById('numPeople').value);
            const personHeight = parseInt(document.getElementById('personHeight').value);

            const canvas = document.getElementById('roomCanvas');
            const ctx = canvas.getContext('2d');

            // Clear the canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw grid
            const gridSize = 20; // Size of grid cells
            ctx.strokeStyle = 'green';
            ctx.lineWidth = 0.5;
            for (let x = 0; x <= canvas.width; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, canvas.height);
                ctx.stroke();
            }
            for (let y = 0; y <= canvas.height; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width, y);
                ctx.stroke();
            }

            // Calculate room dimensions (assuming square room for simplicity)
            const roomSide = Math.sqrt(roomSize) * 10; // Scale up for better visibility
            const roomX = (canvas.width - roomSide) / 2;
            const roomY = (canvas.height - roomSide) / 2;

            // Draw room
            ctx.strokeStyle = 'green';
            ctx.lineWidth = 2;
            ctx.strokeRect(roomX, roomY, roomSide, roomSide);

            // Draw people
            const personRadius = (personHeight / 6) * 5; // Scaled for visibility
            ctx.fillStyle = 'green';
            for (let i = 0; i < numPeople; i++) {
                const angle = (i / numPeople) * 2 * Math.PI;
                const personX = roomX + roomSide / 2 + (roomSide / 2 - personRadius) * Math.cos(angle);
                const personY = roomY + roomSide / 2 + (roomSide / 2 - personRadius) * Math.sin(angle);
                ctx.beginPath();
                ctx.arc(personX, personY, personRadius, 0, 2 * Math.PI);
                ctx.fill();
            }
        }
