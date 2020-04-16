function setup() {
  createCanvas(400, 400);
  pixelDensity(1);
  videoFeed = createCapture(VIDEO);
  videoFeed.size(width / 8, height / 8);
  
}

function draw() {
  background(220);
}