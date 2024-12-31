class Pacman {
    constructor(mundo) {
        this.mundo = mundo;
        this.gridSize = this.mundo.gridHeight;
        this.gridX = 14;
        this.gridY = 26;
        this.isPaused = true;
        this.lives = 3;
        this.isHit = false;

        this.speed = 1.3;
        this.mouthAngle = Math.PI / 4; // Initial mouth angle

        this.direction = "right";
        this.lastValidDirection = this.direction;
        this.nextDirection = null;

        this.size = 16;
        this.score = 0;

        this.x = (this.gridX * this.gridSize + this.gridSize / 2) - this.gridSize / 2;
        this.y = this.gridY * this.gridSize + this.gridSize / 2;

        this.currentFrame = 0; // 0 or 1, depending on which frame you're using
        this.frameWidth = 16;  // Width of a single frame
        this.frameHeight = 16; // Height of a single frame
        this.frameSpeed = 10;
        this.animationTimer = 0;
        this.deathAnimationTimer = 0;
        this.frameIndex = 0;

        this.deathIndex = 0;
    }

    resetGame() {
        location.reload();
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
                this.mundo.transparency[gridY][gridX] === 4 ||
                this.mundo.transparency[gridY][gridX] === 5) // Check if the cell is walkable
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
        const currentTile = this.mundo.transparency[this.gridY][this.gridX];
        if (currentTile === 1 || currentTile === 4) { // Pellet or Power Pellet
            const scoreIncrement = currentTile === 1 ? 10 : 50;
            this.score += scoreIncrement;
            this.mundo.transparency[this.gridY][this.gridX] = 3; // Change tile to empty
            if (currentTile === 4) {
                this.powerPelletFunc(); // Activate power pellet effect  
            }
            return true;
        }
        return false;
    }

    powerPelletFunc() {
        for (const ghost of this.mundo.ghosts) {
            ghost.getFrightened();
        }
    }
    // Draw Pacman on the canvas
    draw() {
        let frameRow = 0; // Default to right direction
        if (this.direction === 'left') {
            frameRow = 1;
        } else if (this.direction === 'down') {
            frameRow = 3;
        } else if (this.direction === 'up') {
            frameRow = 2;
        }

        // Calculate the x and y coordinates for the sprite from the sprite sheet
        const frameX = this.frameWidth * this.frameIndex;
        if (this.frameIndex == 2) {
            frameRow = 0;
        }
        const frameY = frameRow * this.frameHeight;
        // Center the sprite on Pac-Man's position
        const drawX = this.x - this.frameWidth;
        const drawY = this.y - this.frameHeight;

        // Draw the current frame from the sprite sheet
        this.mundo.ctx.drawImage(
            this.mundo.spriteSheet,
            frameX, frameY,
            this.frameWidth, this.frameHeight,
            drawX, drawY,
            32, 32
        );
    }

    updateAnimation() {
        const now = Date.now();

        // Change the frame every 100ms (adjust the value for faster/slower animation)
        if (now - this.animationTimer > 100) {
            if (this.frameIndex === 0) {
                this.frameIndex = 1; // Transition from open to closed
            } else if (this.frameIndex === 1) {
                this.frameIndex = 2; // Transition from closed to neutral
            } else if (this.frameIndex === 2) {
                this.frameIndex = 0; // Transition from neutral back to open
            }
            this.animationTimer = now; // Reset timer
        }
    }

    handleHitAnimation() {

        // If the death animation is done (e.g., after 2 seconds), reset the game or stop drawing
        if (this.deathIndex == 13) {
            this.resetGame();
        } else {
            this.updateDeathAnimation(); // Update the death animation frame
            this.drawDeathFrame(); // Draw the death animation frame
        }
    }

    updateDeathAnimation() {
        const now = Date.now();

        if (now - this.deathAnimationTimer > 100) {
            if (this.deathIndex !== 13) {
                this.deathIndex++;
                this.deathAnimationTimer = now; // Reset timer
            }
        }
    }

    drawDeathFrame() {
        const frameX = this.frameWidth * this.deathIndex + 2 * this.frameWidth;
        const frameY = 0;  //Death animation is in the first row

        const drawX = this.x - this.frameWidth;
        const drawY = this.y - this.frameHeight;

        // Draw the death frame from the sprite sheet
        this.mundo.ctx.drawImage(
            this.mundo.spriteSheet,
            frameX, frameY,
            this.frameWidth, this.frameHeight,
            drawX, drawY,
            32, 32
        );
    }
    checkCollisionsWithGhosts()
    {
        for (const ghost of this.mundo.ghosts) {
            if(ghost.gridX == this.gridX && ghost.gridY == this.gridY)
            {
                this.isHit = true;
            }
        }
    }

    update() {
        if (!this.isPaused) {
            this.checkCollisionsWithGhosts
            this.updatePosition();
            this.updateAnimation(); // Update Pacman's position
        }
        this.draw(); // Draw Pacman
        //this.mundo.drawTile(this.gridX, this.gridY, "yellow");
    }
}
