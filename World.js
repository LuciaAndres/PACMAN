class Mundo {
    constructor() {
        this.canvas = document.getElementById("canvas-principal");
        this.ctx = this.canvas.getContext("2d");
        this.image = document.getElementById("map");

        this.gridWidth = 16;
        this.gridHeight = 16;

        this.fps = 1;
        this.lastLoop = new Date();
        this.pacman = new Pacman(this);
        this.blinky = new Blinky(this);
        this.pinky;
        this.inky;
        this.clyde;
        

        window.addEventListener("keydown", (event) => {
            this.pacman.handleKeyPress(event);
        });

        this.debugMode = false;
        this.transparency =
            [
                [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
                [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
                [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                [0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0],
                [0, 4, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 4, 0],
                [0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0],
                [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                [0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0],
                [0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0],
                [0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0],
                [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 3, 0, 0, 3, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 3, 0, 0, 3, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 1, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 1, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 1, 0, 0, 3, 0, 0, 0, 2, 2, 0, 0, 0, 3, 0, 0, 1, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 1, 0, 0, 3, 0, 2, 2, 2, 2, 2, 2, 0, 3, 0, 0, 1, 0, 0, 0, 0, 0, 0],
                [3, 3, 3, 3, 3, 3, 1, 3, 3, 3, 0, 2, 2, 2, 2, 2, 2, 0, 3, 3, 3, 1, 3, 3, 3, 3, 3, 3,],
                [0, 0, 0, 0, 0, 0, 1, 0, 0, 3, 0, 2, 2, 2, 2, 2, 2, 0, 3, 0, 0, 1, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 1, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 1, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 1, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 1, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 1, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 0, 0, 0, 0, 0],
                [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                [0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0],
                [0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0],
                [0, 4, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 3, 3, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 4, 0],
                [0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0],
                [0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0],
                [0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0],
                [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
                [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
                [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
                [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
            ]
        /*
        0 - PARED
        1 - CAMINO CON PELLET
        2 - CASA FANTASMA
        3 - CAMINO SIN PELLET
        4 - POWER PELLET
        */
        if (this.canvas && this.image) {
            this.image.addEventListener("load", () => {
                this.drawBackground();
            });
        } else {
            console.error("Canvas or Image element not found!");
        }

        this.animate();
    }

    drawBackground() {
        this.ctx.drawImage(this.image, 0, 0, 224, 288, 0, 48, 448, 576);
        this.drawPellets();
    }

    drawPellets() {
        this.ctx.fillStyle = "rgba(255, 184, 151, 1)"; // Color for the pellets
        const pelletSize = this.gridWidth / 4; // Size of the square pellets
        const pelletRadius = 7;

        for (let row = 0; row < this.transparency.length; row++) {
            for (let col = 0; col < this.transparency[row].length; col++) {
                if (this.transparency[row][col] === 1) { // Check for pellet
                    const x = col * this.gridWidth + (this.gridWidth - pelletSize) / 2; // Center x
                    const y = row * this.gridHeight + (this.gridHeight - pelletSize) / 2; // Center y
                    this.ctx.fillRect(x, y, pelletSize, pelletSize); // Draw square pellet
                } else if (this.transparency[row][col] === 4) { // Check for pellet
                    const x = col * this.gridWidth + this.gridWidth / 2; // Center x
                    const y = row * this.gridHeight + this.gridHeight / 2; // Center y
                    this.ctx.beginPath();
                    this.ctx.arc(x, y, pelletRadius, 0, Math.PI * 2); // Draw pellet
                    this.ctx.fill(); // Fill the pellet
                    this.ctx.closePath();
                }
            }
        }
    }

    drawTile(col, row)
    {
        this.ctx.fillStyle = "rgba(255, 0, 0, 1)";
        this.ctx.fillRect(col * this.gridWidth, row * this.gridHeight, this.gridWidth, this.gridHeight);
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
        /*
        for (let row = 0; row < this.transparency.length; row++) {
            for (let col = 0; col < this.transparency[row].length; col++) {
                const transparencyValue = this.transparency[row][col]; // Get transparency value (0 or 1)

                // Set the fill color based on transparency value
                if (transparencyValue === 0) {
                    this.ctx.fillStyle = "rgba(255, 0, 255, 0.5)";
                } else if (transparencyValue === 1) {
                    this.ctx.fillStyle = "rgba(169, 169, 169, 0.5)";
                } else if (transparencyValue === 2) {
                    this.ctx.fillStyle = "rgba(10, 29, 196, 0.5)";
                } else if (transparencyValue === 3) {
                    this.ctx.fillStyle = "rgba(10, 196, 26, 0.5)";
                } else if (transparencyValue === 4) {
                    this.ctx.fillStyle = "rgba(255, 230, 0, 0.5)";
                }

                // Draw the square at the correct position
                this.ctx.fillRect(col * this.gridWidth, row * this.gridHeight, this.gridWidth, this.gridHeight);

                this.ctx.fillStyle = "black"; // Set text color
                this.ctx.font = "12px Arial"; // Set font size and style
                this.ctx.textAlign = "center"; // Center the text
                this.ctx.textBaseline = "middle"; // Middle alignment for vertical
                this.ctx.fillText(transparencyValue, col * this.gridWidth + this.gridWidth / 2, row * this.gridHeight + this.gridHeight / 2);
            }
        }*/

    }

    gameLoop()
    {
        var thisLoop = new Date();
        this.fps = 1000/(thisLoop - this.lastLoop);

        this.pacman.updatePosition();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Clear canvas
        this.drawBackground();
        this.pacman.animate();
        this.ghostsUpdate();
        
        if(this.debugMode){
        this.drawGrid(); // Redraw the grid
        }
    }

    ghostsUpdate()
    {
        this.blinky.draw();
    }
    animate(){
        this.gameLoop();
        requestAnimationFrame(this.animate.bind(this));

    }
}





const mundo = new Mundo();
