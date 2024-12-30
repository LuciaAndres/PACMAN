class Pacman {
    constructor(mundo) {
        this.mundo = mundo;
        this.gridSize = this.mundo.gridHeight;
        this.gridX = 14;
        this.gridY = 26;
        this.isPaused = true;
        this.lives = 3;

        this.speed = 2.5;
        this.mouthAngle = 0;
        this.mouthOpening = true;

        this.direction = "right";
        this.lastValidDirection = this.direction;
        this.nextDirection = null;

        this.size = 16;
        this.score = 0;

        this.x = (this.gridX * this.gridSize + this.gridSize / 2) - this.gridSize / 2;
        this.y = this.gridY * this.gridSize + this.gridSize / 2;

    }
    gameOver()
    {
        if(this.lives === 0)
        {
            location.reload();
        }
    }

    // Handle key presses for direction and pause
    handleKeyPress(event) {
        // Check for pause/unpause
        if (event.key === "p") { // Press 'p' to toggle pause
            this.isPaused = !this.isPaused;
            return; // Exit early if just toggling pause
        }

        // Change direction based on arrow keys or WASD
        let newDirection = null;
        if (event.key === "ArrowUp" || event.key === "w") {
            newDirection = "up";
        } else if (event.key === "ArrowDown" || event.key === "s") {
            newDirection = "down";
        } else if (event.key === "ArrowLeft" || event.key === "a") {
            newDirection = "left";
        } else if (event.key === "ArrowRight" || event.key === "d") {
            newDirection = "right";
        }

        // Update the direction to the new direction if it's valid
        if (newDirection) {
            this.nextDirection = newDirection;
        }
    }

    canMoveTo(gridX, gridY) {
        return (
            gridX >= 0 &&
            gridY >= 0 &&
            gridY < this.mundo.transparency.length && // Ensure gridY is within bounds
            gridX < this.mundo.transparency[gridY].length && // Ensure gridX is within bounds
            (this.mundo.transparency[gridY][gridX] === 1 ||
                this.mundo.transparency[gridY][gridX] === 3 ||
                this.mundo.transparency[gridY][gridX] === 4) // Check if the cell is walkable
        );
    }
    // Update Pacman's position
    async updatePosition() {
        if (this.isPaused) return;

        if (this.eatPellet) {
            this.eatPellet();
            await setTimeout(1000 / this.mundo.fps);
        }
        // Calculate the target position (center of the current grid cell)
        const targetX = this.gridX * this.gridSize + this.gridSize / 2; // Center horizontally
        const targetY = this.gridY * this.gridSize + this.gridSize / 2; // Center vertically

        // Move Pacman towards the target position based on speed
        const deltaX = targetX - this.x;
        const deltaY = targetY - this.y;

        // Move Pacman towards the target position based on speed
        if (Math.abs(deltaX) > this.speed) {
            this.x += (deltaX > 0 ? this.speed : -this.speed);
        } else {
            this.x = targetX; // Snap to target if within speed range
        }

        if (Math.abs(deltaY) > this.speed) {
            this.y += (deltaY > 0 ? this.speed : -this.speed);
        } else {
            this.y = targetY; // Snap to target if within speed range
        }

        // Check if Pacman is aligned with the center of the next cell
        const isAlignedX = Math.abs(this.x - targetX) < this.speed;
        const isAlignedY = Math.abs(this.y - targetY) < this.speed;
        // Allow direction change only if Pacman is aligned with the center of the next cell
        if (isAlignedX && isAlignedY) {
            let nextGridX = this.gridX;
            let nextGridY = this.gridY;

            let directionToUse = this.lastValidDirection; // Default to last valid direction

            if (this.nextDirection) {
                // Check if nextDirection is valid
                let tempGridX = this.gridX;
                let tempGridY = this.gridY;

                // Determine the temporary next grid cell based on nextDirection
                if (this.nextDirection === "up") tempGridY--;
                else if (this.nextDirection === "down") tempGridY++;
                else if (this.nextDirection === "left") tempGridX--;
                else if (this.nextDirection === "right") tempGridX++;

                // Check if the nextDirection is valid
                if (this.canMoveTo(tempGridX, tempGridY)) {
                    directionToUse = this.nextDirection; // Use nextDirection if valid
                }
            }

            // Update nextGridX and nextGridY based on the direction to use
            if (directionToUse === "up") nextGridY--;
            else if (directionToUse === "down") nextGridY++;
            else if (directionToUse === "left") nextGridX--;
            else if (directionToUse === "right") nextGridX++;

            // Check for wrapping around the grid
            if (nextGridX < 0) {
                this.gridX = this.mundo.transparency[0].length - 1; // Wrap to the right edge
                this.x = (this.gridX * this.gridSize + this.gridSize / 2) - this.gridSize / 2; // Set position immediately
            } else if (nextGridX >= this.mundo.transparency[0].length) {
                this.gridX = 0; // Wrap to the left edge
                this.x = (this.gridX * this.gridSize + this.gridSize / 2) - this.gridSize / 2; // Set position immediately
            }

            // Update grid coordinates if the next cell is walkable
            if (this.canMoveTo(nextGridX, nextGridY)) {
                this.gridX = nextGridX;
                this.gridY = nextGridY;
                this.lastValidDirection = directionToUse; // Update last valid direction
                this.direction = directionToUse; // Change direction to the current direction
            }
        }
    }

    eatPellet() {
        if (this.mundo.transparency[this.gridY][this.gridX] === 1) {
            this.score += 10;
            this.mundo.transparency[this.gridY][this.gridX] = 3;
            return true
        } else if (this.mundo.transparency[this.gridY][this.gridX] === 4) {
            this.score += 50;
            this.mundo.transparency[this.gridY][this.gridX] = 3;
            this.powerPelletFunc();
            return true
        }
        return false
    }

    powerPelletFunc() {
        for(const ghost of this.mundo.ghosts)
            {
                ghost.getFrightened();
            }
    }
    // Draw Pacman on the canvas
    draw() {
        this.mundo.ctx.beginPath();
        this.mundo.ctx.moveTo(this.x, this.y); // Move to the center of Pac-Man
        this.mundo.ctx.arc(
            this.x,
            this.y,
            this.size - 4, // Radius of Pac-Man
            this.mouthAngle, // Start angle
            2 * Math.PI - this.mouthAngle // End angle
        );
        this.mundo.ctx.lineTo(this.x, this.y); // Close the path to the center
        this.mundo.ctx.fillStyle = "yellow"; // Pacman color
        this.mundo.ctx.fill(); // Fill the shape
        this.mundo.ctx.closePath(); // Close the path
    }
 
    animate() {
        if (!this.isPaused) {
            this.mouthAngle += this.mouthOpening ? 0.16 : -0.16;
            if (this.mouthAngle > 0.3 * Math.PI || this.mouthAngle <= 0) {
                this.mouthOpening = !this.mouthOpening;
            } // Update Pacman's position
        }
        this.draw(); // Draw Pacman
        this.gameOver();
        //console.log(this.lives);
    }
}