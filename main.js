const canvas = document.querySelector("#draw");
const ctx = canvas.getContext("2d");

const undoButton = document.querySelector("#undoButton");
const redoButton = document.querySelector("#redoButton");
const undoRedoSpeed = 100;


canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


// The code snippet is setting the styling properties for the drawing context (`ctx`) of the canvas.
ctx.strokeStyle = "#BADA55";
ctx.lineWidth = 30;
ctx.lineJoin = "round";
ctx.lineCap = "round";

let isDrawing = false; //only when the moused down, draw something
let lastX = 0;
let lastY = 0;
let hue = 0;
let history = [];
let step = -1;
let undoInterval, redoInterval;

function draw(e) {
  if (!isDrawing) return; //stop fn from running when they are not moused down

  // Clear any active undo or redo intervals
  clearInterval(undoInterval);
  clearInterval(redoInterval);

  ctx.strokeStyle = `hsl(${hue},100%,50%)`;
  ctx.beginPath();
  //start from
  ctx.moveTo(lastX, lastY);
  //go to
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
  [lastX, lastY] = [e.offsetX, e.offsetY];
  hue++;
  if (hue > 360) hue = 0;

  // Save draw in history
  if (step < history.length - 1) {
    history = history.slice(0, step + 1);
  }
  history.push(canvas.toDataURL());
  step++;

  // Disable undo button when reaching the first stroke
  if (step === 0) {
    undoButton.disabled = true;
    
  } else {
    undoButton.disabled = false;
  }
}

canvas.addEventListener("mousemove", draw);


canvas.addEventListener("mousedown", (e) => {
  isDrawing = true;
  [lastX, lastY] = [e.offsetX, e.offsetY];

  // Clear any active undo or redo intervals when starting to draw
  clearInterval(undoInterval);
  clearInterval(redoInterval);
});

canvas.addEventListener("mouseup", () => (isDrawing = false));
canvas.addEventListener("mouseout", () => (isDrawing = false));



undoButton.addEventListener("mousedown", () => {
  undoInterval = setInterval(() => {
    if (step > 0) {
      step--;
      const canvasImg = new Image();
      canvasImg.src = history[step];
      canvasImg.onload = function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(canvasImg, 0, 0);
      };
    }
  }, undoRedoSpeed);
});

undoButton.addEventListener("mouseup", () => {
  clearInterval(undoInterval);
});

redoButton.addEventListener("mousedown", () => {
  redoInterval = setInterval(() => {
    if (step < history.length - 1) {
      step++;
      const canvasImg = new Image();
      canvasImg.src = history[step];
      canvasImg.onload = function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(canvasImg, 0, 0);
      };
    }
  }, undoRedoSpeed);
});

redoButton.addEventListener("mouseup", () => {
  clearInterval(redoInterval);
});

const clearButton = document.querySelector("#clearButton");
clearButton.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  history = [];
  step = -1;
  undoButton.disabled = true; // Disable undo button after clearing canvas
});
