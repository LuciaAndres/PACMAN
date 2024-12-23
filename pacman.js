class Mundo
{
    constructor(){
    this.canvas = document.getElementById("juego");
    this.ctx = this.canvas.getContext("2d");
    this.ctx.drawImage("mapa.png",0,0);
    }
}

const canvas = document.getElementById("juego");
const ctx = this.canvas.getContext("2d");
const image = document.getElementById("source");

image.addEventListener("load", (e) => {
  ctx.drawImage(image, 33, 71, 104, 124, 21, 20, 87, 104);
});