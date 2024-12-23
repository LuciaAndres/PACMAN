class Mundo {
    constructor() {
        this.canvas = document.getElementById("canvas-principal");
        this.ctx = this.canvas.getContext("2d");
        this.image = document.getElementById("map");

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
            [0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0],
            [0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0],
            [1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1],
            [0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0],
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

        const gridWidth = 16;
        const gridHeight = 16;

        for (let x = 0; x < this.canvas.width; x += gridWidth) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }

        for (let y = 0; y < this.canvas.height; y += gridHeight) {
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
                    } else {
                        this.ctx.fillStyle = "rgba(169, 169, 169, 0.5)"; // Gray for transparency 1
                    }
    
                    // Draw the square at the correct position
                    this.ctx.fillRect(col * gridWidth, row * gridHeight, gridWidth, gridHeight);
                }
            }
        
    }
}

class Pacman
{
    constructor(mundo) {
        this.mundo = mundo;
        this.x = 224; // Starting X position
        this.y = 326; // Starting Y position
        this.speed = 2; // Speed of movement
        this.direction = "right"; // Initial movement direction
        this.size = 16; // Pacman size (to match the grid)
        this.moving = false; // Pacman starts stopped

        // Listen for key presses to change direction
        window.addEventListener("keydown", this.changeDirection.bind(this));

        // Start the animation loop
        this.animate();
    }

    // Change Pacman's direction and start moving if not already moving
    changeDirection(event) {
        if (event.key === "ArrowUp") {
            this.direction = "up";
            if (!this.moving) this.moving = true;
        } else if (event.key === "ArrowDown") {
            this.direction = "down";
            if (!this.moving) this.moving = true;
        } else if (event.key === "ArrowLeft") {
            this.direction = "left";
            if (!this.moving) this.moving = true;
        } else if (event.key === "ArrowRight") {
            this.direction = "right";
            if (!this.moving) this.moving = true;
        }
    }

    // Check if Pacman can move to the new position based on transparency
    canMoveTo(x, y) {
        // Get the grid position of the next tile Pacman wants to move to
        const centerX = x + this.size / 2;
        const centerY = y + this.size / 2;

        const gridX = Math.floor(centerX / this.mundo.gridWidth);
        const gridY = Math.floor(centerY / this.mundo.gridHeight);
        // Check the transparency value at the grid position
        return this.mundo.transparency[gridY] && this.mundo.transparency[gridY][gridX] === 1;
    }

    // Update Pacman's position if moving
    updatePosition() {
        if (this.moving) {
            let newX = this.x;
            let newY = this.y;

            // Calculate the new position based on the direction
            if (this.direction === "up") {
                newY -= this.speed;
            } else if (this.direction === "down") {
                newY += this.speed;
            } else if (this.direction === "left") {
                newX -= this.speed;
            } else if (this.direction === "right") {
                newX += this.speed;
            }

            // Check if the new position is valid based on the transparency array
            if (this.canMoveTo(newX, newY)) {
                // Update the position only if the move is valid
                this.x = newX;
                this.y = newY;
            }
        }
    }

    // Draw Pacman on the canvas
    draw() {
        const centerX = this.x ;
        const centerY = this.y ;

        this.mundo.ctx.beginPath();
        this.mundo.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); // Draw circle
        this.mundo.ctx.fillStyle = "yellow"; // Pacman color
        this.mundo.ctx.fill();
        this.mundo.ctx.closePath();

        this.mundo.ctx.beginPath();
        this.mundo.ctx.arc(centerX, centerY, 2, 0, Math.PI * 2); // Small circle for center
        this.mundo.ctx.fillStyle = "red"; // Center marker color
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