class Ghost {
    constructor(mundo, gridX, gridY, scatterCol, scatterRow, color) {
        this.mundo = mundo;
        this.gridX = gridX;
        this.gridY = gridY;
        this.gridSize = this.mundo.gridHeight;

        this.speed = 0.8 * this.mundo.pacman.speed;
        this.ORIGINAL_SPEED = this.speed;
        this.direction = "right";
        this.lastValidDirection= this.direction;

        this.scatterMode = true;
        this.scatterCol = scatterCol;
        this.scatterRow = scatterRow;
        this.x = (this.gridX * this.gridSize + this.gridSize / 2) - this.gridSize / 2;
        this.y = this.gridY * this.gridSize + this.gridSize / 2;
        this.isFrighted = false;

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
        this.mundo.ctx.beginPath();
        this.mundo.ctx.arc(this.x, this.y, 12, 0, 2 * Math.PI);
        this.mundo.ctx.fillStyle = this.color;
        this.mundo.ctx.fill();
        this.mundo.ctx.closePath();
        //this.mundo.drawTile(this.targetGridX, this.targetGridY, this.color);
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
        }
    }

    takeRandomTurn() {
        const validDirections = this.checkSurroundingTiles();
        const newDirections = [];

        // Exclude the direction it just came from
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
                } else if (this.mundo.transparency[this.gridY - 1] && this.mundo.transparency[this.gridY - 1][this.gridX] === 5) {
                    // Wrap around to the bottom
                    this.gridY = this.mundo.transparency.length - 1; // Wrap to the bottom
                }
                break;
            case "down":
                if (this.canMoveTo(this.gridX, this.gridY + 1)) {
                    this.gridY++;
                } else if (this.mundo.transparency[this.gridY + 1] && this.mundo.transparency[this.gridY + 1][this.gridX] === 5) {
                    // Wrap around to the top
                    this.gridY = 0; // Wrap to the top
                }
                break;
            case "left":
                if (this.canMoveTo(this.gridX - 1, this.gridY)) {
                    this.gridX--;
                } else if (this.canMoveTo(this.gridX - 1, this.gridY) && this.mundo.transparency[this.gridY][this.gridX - 1] === 5) {
                    // Wrap around to the right edge
                    this.gridX = this.mundo.transparency[0].length - 1; // Wrap to the right
                }
                break;
            case "right":
                if (this.canMoveTo(this.gridX + 1, this.gridY)) {
                    this.gridX++;
                } else if (this.canMoveTo(this.gridX + 1, this.gridY) && this.mundo.transparency[this.gridY][this.gridX + 1] === 5) {
                    // Wrap around to the left edge
                    this.gridX = 0; // Wrap to the left
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
        if ((this.targetGridX === this.gridX) && (this.targetGridY === this.gridY)) {
            this.mundo.pacman.lives -= 1;
        }
    }

    updateMode() {
        if (this.mundo.pacman.isPaused || this.isFrighted) return;

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

    update() {
        this.updatePosition(); // Update ghost's position
        this.updateMode();
        this.draw(); // Draw ghost
    }
}

class Blinky extends Ghost {
    constructor(mundo) {
        super(mundo, 14, 14, 26, 0, "red");
    }
}

class Pinky extends Ghost {
    constructor(mundo) {
        super(mundo, 12, 14, 3, 0, "pink");
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
        super(mundo, 16, 14, 27, 35, "lightblue");
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
        super(mundo, 18, 14, 0, 35, "orange");
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