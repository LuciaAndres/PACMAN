class Blinky
{
    constructor(mundo)
    {
        this.mundo = mundo;
        this.gridX = 14;
        this.gridY = 14;
        this.gridSize = this.mundo.gridHeight;

        this.direction = "left"

        this.scatterCol = 25; //horizontal
        this.scatterRow = 0; //vertical

        this.targetGridX
        this.targetGridY
        
        this.x = (this.gridX * this.gridSize + this.gridSize / 2) - this.gridSize / 2;
        this.y = this.gridY * this.gridSize + this.gridSize / 2;
    }
    draw(){
        this.mundo.ctx.beginPath();
        this.mundo.ctx.arc(
            this.x, 
            this.y,
            12,
            0,
            2 * Math.PI);
        this.mundo.ctx.fillStyle = "red";
        this.mundo.ctx.fill();
        this.mundo.ctx.closePath();
        //this.mundo.drawTile(this.scatterCol, this.scatterRow);
    }
    
    move()
    {
        let tempGridX = this.gridX
        let tempGridY = this.gridY

        if (this.direction === "up") tempGridY--;
            else if (this.direction === "down") tempGridY++;
            else if (this.direction === "left") tempGridX--;
            else if (this.direction === "right") tempGridX++;
    }

    distanceToTargetTile()
    {
      return Math.hypot((this.gridX - this.targetGridX),(this.gridY - this.targetGridY));
    }

    canMoveTo(gridX, gridY) {
        return (
            gridX >= 0 &&
            gridY >= 0 &&
            gridY < this.mundo.transparency.length && // Ensure gridY is within bounds
            gridX < this.mundo.transparency[gridY].length && // Ensure gridX is within bounds
            (this.mundo.transparency[gridY][gridX] === 1 ||
                this.mundo.transparency[gridY][gridX] === 2 ||
                this.mundo.transparency[gridY][gridX] === 3 || 
                this.mundo.transparency[gridY][gridX] === 4) // Check if the cell is walkable
        );
    }

    setTarget()
    {
        this.targetX = this.mundo.pacman.gridX;
        this.targetY = this.mundo.pacman.gridY;
    }
}