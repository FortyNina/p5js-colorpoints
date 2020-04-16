
var capture;

var fillEllipse = true;
var bg = 50;

function setup() {
  createCanvas(displayWidth, displayHeight);
  var constraints = {
    audio: false,
    video: {
      facingMode: {
        exact: "environment"
      }
    }
    //video: {
      //facingMode: "user"
    //}
  };
  capture = createCapture(constraints);

  capture.hide();
  rectMode(CENTER);
}


function draw() {
 image(capture, 0, 0);

  if (fillEllipse) {
    fill(255);
  }
  else {
    noFill();
  }
  rect(width/2, height/2, 100, 100);
}

function touchStarted() {
  fillEllipse = !fillEllipse;
  bg = 128;
}

function touchEnded() {
  bg = 50;
}

function touchMoved() {
  // otherwise the display will move around
  // with your touch :(
  return false;
}
