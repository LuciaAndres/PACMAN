class Ghost {
    constructor(mundo, gridX, gridY, houseX, houseY, scatterCol, scatterRow, color, frameY, dotsEatenToExit) {
        this.mundo = mundo;
        this.gridX = gridX;
        this.gridY = gridY;
        this.gridSize = this.mundo.gridHeight;
        this.gridXHouse = 14;
        this.gridYHouse = 17;
        this.speed = 0.8 * this.mundo.pacman.speed;
        this.ORIGINAL_SPEED = this.speed;
        this.direction = "right";
        this.lastValidDirection = this.direction;

        this.currentFrame = 0; // 0 or 1, depending on which frame you're using
        this.frameWidth = 16;  // Width of a single frame
        this.frameHeight = 16; // Height of a single frame
        this.frameSpeed = 10;
        this.animationTimer = 0;
        this.frameIndex = 0;
        this.frameY = frameY;

        this.blink = false;
        this.blinkTimer = 0;
        this.blinkInterval = 200;

        this.scatterMode = true;
        this.scatterCol = scatterCol;
        this.scatterRow = scatterRow;
        this.houseX = houseX;
        this.houseY = houseY;
        this.x = (this.gridX * this.gridSize + this.gridSize / 2) - this.gridSize / 2;
        this.y = this.gridY * this.gridSize + this.gridSize / 2;

        this.isFrighted = false;
        this.isDead = false;
        this.inGhostHouse = false;
        this.dotsEatenToExit = dotsEatenToExit;

        this.targetX = this.x; // Target position for smooth movement
        this.targetY = this.y; // Target position for smooth movement

        this.scatterDuration = 7000; // 7 seconds
        this.chaseDuration = 20000; // 20 seconds
        this.currentModeDuration = 0; // Time spent in the current mode
        this.modeSwitchTime = Date.now(); // Time when the mode was last switched
        this.modeSequence = [
            { mode: 'scatter', duration: 7000 },
            { mode: 'chase', duration: 20000 },
            { mode: 'scatter', duration: 5000 },
            { mode: 'chase', duration: Infinity } // Permanent chase
        ];
        this.currentModeIndex = 0;
        this.color = color; // Color for drawing the ghost
    }

    draw() {
        let updatedIndex = this.frameIndex;
        if(this.direction === "left")
        {
            updatedIndex += 2;
        } else if(this.direction === "up")
        {
            updatedIndex += 4;
        } else if(this.direction === "down")
        {
          updatedIndex += 6;
        }
        let frameX = updatedIndex * this.frameWidth;
        
        let frameYGrid = this.frameY * this.frameHeight;
        // Center the sprite on Pac-Man's position
        const drawX = this.x - this.frameWidth;
        const drawY = this.y - this.frameHeight;
        if (this.isFrighted) {
            frameYGrid = 4 * this.frameHeight;
            
            const elapsedTime = Date.now() - this.mundo.pacman.frightenedTimerStart; // Time since frightened state started
            const remainingTime = 10000 - elapsedTime; // Calculate remaining time
        // Start blinking when the timer is nearing its end
        if (remainingTime > 0 && remainingTime <= 2000) { // 2 seconds left
            // Blinking effect: alternate between visible and transparent
            if (this.blinkTimer >= this.blinkInterval) {
                this.blink = !this.blink; // Toggle blink state
                this.blinkTimer = 0; // Reset the blink timer
            } else {
                this.blinkTimer += 16; // Increment by the frame time (approx. 60 FPS)
            }

            if (this.blink) {
                frameX = (this.frameIndex + 10) * this.frameWidth; // Alternate frame for blinking
            } else {
                frameX = (this.frameIndex + 8) * this.frameWidth; // Normal frightened frame
            }
        } else {
            frameX = (this.frameIndex + 8) * this.frameWidth; // Normal frightened frame
        }
        
        }
        if(this.isDead)
        {
            frameYGrid = 5 * this.frameHeight;
            
            updatedIndex = 8;
            if(this.direction === "left")
                {
                    updatedIndex = 9;
                } else if(this.direction === "up")
                {
                    updatedIndex = 10;
                } else if(this.direction === "down")
                {
                  updatedIndex = 11;
                }
                frameX = updatedIndex * this.frameWidth
            
        }

        // Draw the current frame from the sprite sheet
        this.mundo.ctx.drawImage(
            this.mundo.spriteSheet, 
            frameX, frameYGrid,
            this.frameWidth, this.frameHeight,
            drawX, drawY,
            32, 32
        );
    }

    updateAnimation() {
        if(this.isDead) return;
        const now = Date.now();

        // Change the frame every 200ms (adjust the value for faster/slower animation)
        if (now - this.animationTimer > 100) {
            if (this.frameIndex === 0) {
                this.frameIndex = 1; // Transition from open to neutral
            } else if (this.frameIndex === 1) {
                this.frameIndex = 0; // Transition from neutral back to open
            }
            this.animationTimer = now; // Reset timer
        }
    }

    getEaten()
    {
        this.isDead = true;
        this.speed = this.ORIGINAL_SPEED;
    }

    canMoveTo(gridX, gridY) {
        return (
            gridX >= 0 &&
            gridY >= 0 &&
            gridY < this.mundo.transparency.length && // Ensure gridY is within bounds
            gridX < this.mundo.transparency[gridY].length && // Ensure gridX is within bounds
            (this.mundo.transparency[gridY][gridX] === 1 ||
                (this.mundo.transparency[gridY][gridX] === 2 && ((this.isDead || this.inGhostHouse)) && !this.isFrighted) ||
                this.mundo.transparency[gridY][gridX] === 3 ||
                this.mundo.transparency[gridY][gridX] === 4 ||
                this.mundo.transparency[gridY][gridX] === 5) // Check if the cell is walkable
        );
    }

    updatePosition() {
        if (this.mundo.pacman.isPaused) return;

        const targetGridX = this.gridX * this.gridSize + this.gridSize / 2; // Center horizontally
        const targetGridY = this.gridY * this.gridSize + this.gridSize / 2; // Center vertically

        const deltaX = targetGridX - this.x;
        const deltaY = targetGridY - this.y;

        // Update position smoothly
        if (Math.abs(deltaX) > this.speed) {
            this.x += (deltaX > 0 ? this.speed : -this.speed);
        } else {
            this.x = targetGridX; // Snap to target if within speed range
        }

        if (Math.abs(deltaY) > this.speed) {
            this.y += (deltaY > 0 ? this.speed : -this.speed);
        } else {
            this.y = targetGridY; // Snap to target if within speed range
        }

        const isAlignedX = Math.abs(this.x - targetGridX) < this.speed;
        const isAlignedY = Math.abs(this.y - targetGridY) < this.speed;
        if (isAlignedX && isAlignedY) {
            this.setTargetTiles(); // Update target positions based on Pacman's position
            if (this.isFrighted) {
                this.takeRandomTurn(); // Take a random turn if frightened
            } else {
                this.findBestDirection(); // Find the best direction to move
            }

            if (this.gridX - 1 < 0) {
                this.gridX = this.mundo.transparency[0].length - 1; // Wrap to the right edge
                this.x = (this.gridX * this.gridSize + this.gridSize / 2) - this.gridSize / 2;
            } else if (this.gridX + 1 >= this.mundo.transparency[0].length) {
                this.gridX = 0; // Wrap to the left edge
                this.x = (this.gridX * this.gridSize + this.gridSize / 2) - this.gridSize / 2;
            }
        }
    }

    takeRandomTurn() {
        const validDirections = this.checkSurroundingTiles();
        const newDirections = [];

        const oppositeDirection = this.invertDirection(this.lastValidDirection);

        for (const dir of validDirections) {
            if (dir !== oppositeDirection) {
                newDirections.push(dir);
            }
        }

        if (newDirections.length > 0) {
            // Select a random direction from the new valid directions
            const randomIndex = Math.floor(Math.random() * newDirections.length);
            this.direction = newDirections[randomIndex]; // Update the current direction
            this.lastValidDirection = this.direction; // Update last valid direction
            this.moveInDirection(this.direction); // Move in the selected direction
        }
    }

    moveInDirection(direction) {
        switch (direction) {
            case "up":
                if (this.canMoveTo(this.gridX, this.gridY - 1)) {
                    this.gridY--;
                }
                break;
            case "down":
                if (this.canMoveTo(this.gridX, this.gridY + 1)) {
                    this.gridY++;
                }
                break;
            case "left":
                if (this.canMoveTo(this.gridX - 1, this.gridY)) {
                    this.gridX--;
                }
                break;
            case "right":
                if (this.canMoveTo(this.gridX + 1, this.gridY)) {
                    this.gridX++;
                }
                break;
        }

    }

    findBestDirection() {
        const validDirections = this.checkSurroundingTiles();
        let shortestDistance = Infinity;
        let shortestDirection = null;

        for (const direction of validDirections) {
            if (direction !== this.invertDirection(this.direction)) {
                const newGridX = this.gridX + (direction === "left" ? -1 : direction === " right" ? 1 : 0);
                const newGridY = this.gridY + (direction === "up" ? -1 : direction === "down" ? 1 : 0);
                const distance = this.distanceToTargetTile(newGridX, newGridY);

                if (distance < shortestDistance) {
                    shortestDistance = distance;
                    shortestDirection = direction;
                }
            }
        }

        if (shortestDirection) {
            this.direction = shortestDirection;
            this.updateGridPosition();
        }
    }

    updateGridPosition() {
        if (this.direction === "up") this.gridY--;
        else if (this.direction === "down") this.gridY++;
        else if (this.direction === "left") this.gridX--;
        else if (this.direction === "right") this.gridX++;

        // Update the target position based on the new grid coordinates
        this.targetX = (this.gridX * this.gridSize + this.gridSize / 2) - this.gridSize / 2;
        this.targetY = this.gridY * this.gridSize + this.gridSize / 2;
    }

    invertDirection(direction) {
        switch (direction) {
            case "up": return "down";
            case "down": return "up";
            case "left": return "right";
            case "right": return "left";
            default: return direction;
        }
    }

    getFrightened() {
        this.direction = this.invertDirection(this.direction);
        this.findBestDirection();
        this.isFrighted = true;
        this.speed = this.ORIGINAL_SPEED * 0.5;
    }

    revertToNormal()
    {
        this.findBestDirection();
        this.isFrighted = false;
        this.speed = this.ORIGINAL_SPEED;
        this.blink = false;
    }
    

    checkSurroundingTiles() {
        const directions = ["up", "down", "left", "right"];
        return directions.filter(dir => {
            switch (dir) {
                case "up": return this.canMoveTo(this.gridX, this.gridY - 1);
                case "down": return this.canMoveTo(this.gridX, this.gridY + 1);
                case "left": return this.canMoveTo(this.gridX - 1, this.gridY);
                case "right": return this.canMoveTo(this.gridX + 1, this.gridY);
                default: return false;
            }
        });
    }

    distanceToTargetTile(gridX, gridY) {
        return Math.hypot((gridX - this.targetGridX), (gridY - this.targetGridY));
    }

    setTargetTiles() {
        if (!this.scatterMode) {
            this.targetGridX = this.mundo.pacman.gridX;
            this.targetGridY = this.mundo.pacman.gridY;
        } else {
            this.targetGridX = this.scatterCol;
            this.targetGridY = this.scatterRow;
        }
        if(this.isDead) {
            const sound = new Audio('./Pacman Sounds/ghost-eyes.mp3'); // Ruta del archivo de audio
            sound.volume = 0.3; //Le bajamos el volumen ya que sino suena muy alto
            sound.play();
            this.targetGridX = this.houseX;
            this.targetGridY = this.houseY;
            if(this.gridX == this.targetGridX && this.gridY == this.targetGridY)
            {
                this.isDead = false;
                this.inGhostHouse = true;
            }
        }

    }

    checkIfHit()
    {
        if ((this.targetGridX === this.gridX) && (this.targetGridY === this.gridY)) {
            if(!this.isDead)
            {
                this.mundo.pacman.isHit = true;
            }
        }  
    }

    updateMode() {
        if (this.mundo.pacman.isPaused || this.isFrighted || this.isDead) return;

        const now = Date.now();
        this.currentModeDuration += now - this.modeSwitchTime;
        this.modeSwitchTime = now;

        if (this.currentModeDuration >= this.modeSequence[this.currentModeIndex].duration) {
            this.scatterMode = !this.scatterMode; // Toggle mode
            this.currentModeIndex++;
            this.currentModeDuration = 0;

            // Check if we reached the end of the sequence
            if (this.currentModeIndex >= this.modeSequence.length) {
                this.currentModeIndex = 1; // Start from the second mode (chase)
            }
        }
    }
    exitHouseAnim()
    {
        this.targetGridX = 14;
        this.targetGridY = 14;
        //this.findBestDirection();
        this.inGhostHouse = false; // Mark the ghost as out of the house
    }
    exitGhotsHouse()
    {
        if(this.inGhostHouse)
        {  
            if(this.gridX < this.gridXHouse || this.gridX > this.gridXHouse)
            {
                this.direction = this.invertDirection(this.direction);
            }
            if(this.mundo.pacman.dotsEaten >= this.dotsEatenToExit){
                setTimeout(() => {
                    this.exitHouseAnim(); // Move to scatter row
                }, 4000); // Delay of 1 second before exiting
            }
        }
    }
    update() {
        this.updatePosition(); // Update ghost's position
        this.draw(); // Draw ghost
        if(!this.mundo.pacman.isPaused)
        {
            this.updateMode();
            this.updateAnimation();
        }
    
        this.checkIfHit();
        this.exitGhotsHouse();
        this.mundo.drawTile(this.gridX, this.gridY, this.color);
    }
}

class Blinky extends Ghost {
    constructor(mundo) {
        super(mundo, 14, 14, 14, 17, 26, 0, "red", 4, 0);
    }
}

class Pinky extends Ghost {
    constructor(mundo) {
        super(mundo, 14, 17, 14, 17, 3, 0, "pink", 5, 0);
        this.inGhostHouse = true;
    }

    setTargetTiles() {
        if (!this.scatterMode) {
            this.targetGridX = this.mundo.pacman.gridX;
            this.targetGridY = this.mundo.pacman.gridY;

            switch (this.mundo.pacman.direction) {
                case 'up':
                    this.targetGridY -= 4; // Move up 4 squares
                    break;
                case 'down':
                    this.targetGridY += 4; // Move down 4 squares
                    break;
                case 'left':
                    this.targetGridX -= 4; // Move left 4 squares
                    break;
                case 'right':
                    this.targetGridX += 4; // Move right 4 squares
                    break;
            }
        } else {
            super.setTargetTiles(); // Call the base class method for scatter mode
        }
    }
}

class Inky extends Ghost {
    constructor(mundo) {
        super(mundo, 12, 17, 12, 17, 27, 35, "lightblue", 6, 70);
        this.inGhostHouse = true;
    }

    setTargetTiles() {
        if (!this.scatterMode) {
            const pacmanGridX = this.mundo.pacman.gridX;
            const pacmanGridY = this.mundo.pacman.gridY;

            // Determine the target position two tiles in front of Pac-Man
            let targetGridX = pacmanGridX;
            let targetGridY = pacmanGridY;

            switch (this.mundo.pacman.direction) {
                case 'up':
                    targetGridY -= 2; // Move up 2 squares
                    break;
                case 'down':
                    targetGridY += 2; // Move down 2 squares
                    break;
                case 'left':
                    targetGridX -= 2; // Move left 2 squares
                    break;
                case 'right':
                    targetGridX += 2; // Move right 2 squares
                    break;
            }

            const vectorX = (targetGridX - this.gridX);
            const vectorY = (targetGridY - this.gridY);

            // Double the vector
            this.targetGridX = targetGridX + vectorX;
            this.targetGridY = targetGridY + vectorY;
        } else {
            super.setTargetTiles(); // Call the base class method for scatter mode
        }
    }
}

class Clyde extends Ghost {
    constructor(mundo) {
        super(mundo, 16, 17, 16, 17, 0, 35, "orange", 7, 90);
        this.inGhostHouse = true;
    }

    setTargetTiles() {
        if (!this.scatterMode) {
            const pacmanGridX = this.mundo.pacman.gridX;
            const pacmanGridY = this.mundo.pacman.gridY;

            // Calculate the Manhattan distance between Clyde and Pac-Man
            const distance = Math.abs(this.gridX - pacmanGridX) + Math.abs(this.gridY - pacmanGridY);
            if (distance > 8) {
                this.targetGridX = pacmanGridX;
                this.targetGridY = pacmanGridY;
            } else {
                super.setTargetTiles(); // Call the base class method for scatter mode
            }
        } else {
            super.setTargetTiles(); // Call the base class method for scatter mode
        }
    }
}