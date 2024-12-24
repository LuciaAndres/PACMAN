class Mundo {
    constructor() {
        this.canvas = document.getElementById("canvas-principal");
        this.ctx = this.canvas.getContext("2d");
        this.image = document.getElementById("map");

        this.gridWidth = 16;
        this.gridHeight = 16;

        this.pacman;
        this.blinky;
        this.pinky;
        this.inky;
        this.clyde;

        this.transparency =
        [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0],
            [0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0],
            [0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0],
            [0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0],
            [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
            [0,1,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,1,0],
            [0,1,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,1,0],
            [0,1,1,1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,1,1,0],
            [0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0],
            [0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0],
            [0,0,0,0,0,0,1,0,0,1,1,1,1,1,1,1,1,1,1,0,0,1,0,0,0,0,0,0],
            [0,0,0,0,0,0,1,0,0,1,0,0,0,2,2,0,0,0,1,0,0,1,0,0,0,0,0,0],
            [0,0,0,0,0,0,1,0,0,1,0,2,2,2,2,2,2,0,1,0,0,1,0,0,0,0,0,0],
            [1,1,1,1,1,1,1,1,1,1,0,2,2,2,2,2,2,0,1,1,1,1,1,1,1,1,1,1],
            [0,0,0,0,0,0,1,0,0,1,0,2,2,2,2,2,2,0,1,0,0,1,0,0,0,0,0,0],
            [0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0],
            [0,0,0,0,0,0,1,0,0,1,1,1,1,1,1,1,1,1,1,0,0,1,0,0,0,0,0,0],
            [0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0],
            [0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0],
            [0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0],
            [0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0],
            [0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0],
            [0,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,0],
            [0,0,0,1,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,1,0,0,0],
            [0,0,0,1,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,1,0,0,0],
            [0,1,1,1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,1,1,0],
            [0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0],
            [0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0],
            [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        ]

        if (this.canvas && this.image) {
            this.image.addEventListener("load", () => {
                this.drawBackground();
                //this.drawGrid();
            });
        } else {
            console.error("Canvas or Image element not found!");
        }
    }

    drawBackground() {
        this.ctx.drawImage(this.image, 0, 0, 224, 288, 0, 48, 448, 576);
    }

    drawGrid() {
        this.ctx.strokeStyle = "green";
        this.ctx.lineWidth = 1;

        for (let x = 0; x < this.canvas.width; x += this.gridWidth) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }

        for (let y = 0; y < this.canvas.height; y += this.gridHeight) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
            // Loop through the transparency array and draw each square
            for (let row = 0; row < this.transparency.length; row++) {
                for (let col = 0; col < this.transparency[row].length; col++) {
                    const transparencyValue = this.transparency[row][col]; // Get transparency value (0 or 1)
    
                    // Set the fill color based on transparency value
                    if (transparencyValue === 0) {
                        this.ctx.fillStyle = "rgba(255, 0, 255, 0.5)"; // Blue for transparency 0
                    } else if(transparencyValue === 1){
                        this.ctx.fillStyle = "rgba(169, 169, 169, 0.5)"; // Gray for transparency 1
                    } else{
                        this.ctx.fillStyle = "rgba(10, 29, 196, 0.5)";
                    }
    
                    // Draw the square at the correct position
                    this.ctx.fillRect(col * this.gridWidth, row * this.gridHeight, this.gridWidth, this.gridHeight);
                }
            }
        
    }
}

class Pacman {
    constructor(mundo) {
        this.mundo = mundo;
        this.gridSize = this.mundo.gridHeight;

        this.gridX = 14; // Starting grid column
        this.gridY = 20;

        this.speed = 1.8; 
        this.direction = "right";
        this.nextDirections = []; // Queue for buffered directions
        this.size = 16; 
        this.moving = false; 

        this.x = this.gridX * this.gridSize + this.gridSize / 2;
        this.y = this.gridY * this.gridSize + this.gridSize / 2;

        window.addEventListener("keydown", this.changeDirection.bind(this));

        this.animate();
    }

    // Change direction, add it to the queue
    changeDirection(event) {
        let newDirection = null;

        if (event.key === "ArrowUp" || event.key === "w") {
            newDirection = "up";
        } else if (event.key === "ArrowDown"  || event.key === "s") {
            newDirection = "down";
        } else if (event.key === "ArrowLeft" || event.key === "a") {
            newDirection = "left";
        } else if (event.key === "ArrowRight" || event.key === "d") {
            newDirection = "right";
        }

        // Add new direction to the queue if it's not the current direction
        if (newDirection && newDirection !== this.direction) {
            if (this.nextDirections.length === 0) {
                this.nextDirections.push(newDirection);
            } else if (this.nextDirections[this.nextDirections.length - 1] !== newDirection) {
                this.nextDirections.push(newDirection);
            }
        }
    }

    canMoveTo(gridX, gridY) {
        return (
            gridX >= 0 &&
            gridY >= 0 &&
            this.mundo.transparency[gridY] &&
            this.mundo.transparency[gridY][gridX] === 1
        );
    }

    alignToGrid() {
        this.x = this.gridX * this.gridSize + this.gridSize / 2;
        this.y = this.gridY * this.gridSize + this.gridSize / 2;
    }

    // Update Pacman's position
    updatePosition() {
        // Calculate the target position based on current grid position
        const targetX = this.gridX * this.gridSize + this.gridSize / 2;
        const targetY = this.gridY * this.gridSize + this.gridSize / 2;
    
        // Check if Pacman is aligned with the grid center
        const alignedX = Math.abs(this.x - targetX) < this.speed;
        const alignedY = Math.abs(this.y - targetY) < this.speed;
    
        // Only update position if Pacman is aligned
        if (alignedX && alignedY) {
            let nextGridX = this.gridX;
            let nextGridY = this.gridY;
    
            // Determine the next grid cell based on direction
            if (this.direction === "up") nextGridY--;
            else if (this.direction === "down") nextGridY++;
            else if (this.direction === "left") nextGridX--;
            else if (this.direction === "right") nextGridX++;
    
            // Check if Pacman can move in the current direction
            if (this.canMoveTo(nextGridX, nextGridY)) {
                // If Pacman can move, we perform the movement
                if (this.direction === "up") this.y -= this.speed;
                else if (this.direction === "down") this.y += this.speed;
                else if (this.direction === "left") this.x -= this.speed;
                else if (this.direction === "right") this.x += this.speed;
    
                // Update grid position after moving
                this.gridX = nextGridX;
                this.gridY = nextGridY;
            }
    
            // Change direction if possible at the current tile
            if (this.nextDirections.length > 0) {
                let newDirection = this.nextDirections.shift(); // Get the next direction from the queue
    
                let testGridX = this.gridX;
                let testGridY = this.gridY;
    
                if (newDirection === "up") testGridY--;
                else if (newDirection === "down") testGridY++;
                else if (newDirection === "left") testGridX--;
                else if (newDirection === "right") testGridX++;
    
                if (this.canMoveTo(testGridX, testGridY)) {
                    this.direction = newDirection;
                }
            }
        } else {
            // Align to the grid if not aligned
            // Move Pacman towards the target position to align
            if (!alignedX) {
                this.x += (targetX - this.x) > 0 ? this.speed : -this.speed;
            }
            if (!alignedY) {
                this.y += (targetY - this.y) > 0 ? this.speed : -this.speed;
            }
    
            // Ensure Pacman doesn't overshoot the target
            if (Math.abs(this.x - targetX) < this.speed) {
                this.x = targetX;
            }
            if (Math.abs(this.y - targetY) < this.speed) {
                this.y = targetY;
            }
        }
    }
    // Draw Pacman on the canvas
    draw() {
        this.mundo.ctx.beginPath();
        this.mundo.ctx.arc(
            this.x,
            this.y,
            this.gridSize, // Pacman's radius
            0,
            Math.PI * 2
        );
        this.mundo.ctx.fillStyle = "yellow"; // Pacman color
        this.mundo.ctx.fill();
        this.mundo.ctx.closePath();
    }

    // Main animation loop
    animate() {
        this.mundo.ctx.clearRect(0, 0, this.mundo.canvas.width, this.mundo.canvas.height); // Clear canvas
        this.mundo.drawBackground(); // Redraw the background
        this.mundo.drawGrid(); // Redraw the grid
        this.updatePosition(); // Update Pacman's position
        this.draw(); // Draw Pacman
        requestAnimationFrame(this.animate.bind(this)); // Call animate again for smooth animation
    }
}

const mundo = new Mundo();

const pacman = new Pacman(mundo);