var videoFeed; //reference to video from webcam
var lerpPercent = 0; //keep track of lerping
var colorTravelSpeed = .05; //how quickly the color lerps

let backCol = [123, 36, 63, 255]; //background color
let accentColOne = [243, 45, 68, 255];
let accentColTwo = [255, 194, 25, 255];
let accentColThree = [85, 155, 255, 255];
let accentColFour = [133, 197, 130, 255];

let colLineup = [accentColOne, accentColTwo, accentColThree, accentColFour];

let colorIndicies = [0, 1, 2, 3];

//colors that will actually be displayed
let currentColOne = [255, 255, 255, 255];
let currentColTwo = [0, 0, 0, 255];
let currentColThree = [0, 0, 0, 255];
let currentColFour = [0, 0, 0, 255];

function setup() {
  createCanvas(600, 450);
  pixelDensity(1);
  videoFeed = createCapture(VIDEO);
  videoFeed.size(width / 8, height / 8);
}

function draw() {

  //calculate lerpPercent
  lerpPercent += colorTravelSpeed;
  if (lerpPercent > 1) {
    lerpPercent = 0;
    for (var i = 0; i < 4; i++) {
      colorIndicies[i] += 1;
      if (colorIndicies[i] > 3) {
        colorIndicies[i] = 0;
      }
    }
  }

  //lerp each color to the next color in the array
  lerpColors(currentColOne, 0);
  lerpColors(currentColTwo, 1);
  lerpColors(currentColThree, 2);
  lerpColors(currentColFour, 3);


  background(backCol);
  videoFeed.loadPixels();
  //Handle coloring pixels
  for (var y = 0; y < videoFeed.height; y++) {
    for (var x = 0; x < videoFeed.width; x++) {
      var index = (videoFeed.width - x + 1 + (y * videoFeed.width)) * 4;
      var r = videoFeed.pixels[index + 0];
      var g = videoFeed.pixels[index + 1];
      var b = videoFeed.pixels[index + 2];
      var brightMapped = (map(((r + g + b) / 3), 0, 255, 0, 8)) + .5;
      var newWidth = 3.5;
      stroke(0, 0, 0, 0);
      if (brightMapped < 1.5) {
        fill(backCol); //bkg col
      } else if (brightMapped < 3) {
        fill(currentColOne);
        newWidth = 2;
      } else if (brightMapped < 5) {
        fill(currentColTwo);
        newWidth = 3;
      } else if (brightMapped < 7) {
        fill(currentColThree);
        newWidth = 5;
      } else {
        fill(currentColFour);
        newWidth = 5.5;
      }
      rectMode(CENTER);

      ellipse(x * 8, y * 8, newWidth, newWidth);
    }
  }
}

function lerpColors(arr, index) {

  var startInd = colorIndicies[index];
  var finishInd = startInd + 1;
  if (finishInd > 3) {
    finishInd = 0;
  }
  arr[0] = lerp(colLineup[startInd][0], colLineup[finishInd][0], lerpPercent);
  arr[1] = lerp(colLineup[startInd][1], colLineup[finishInd][1], lerpPercent);
  arr[2] = lerp(colLineup[startInd][2], colLineup[finishInd][2], lerpPercent);



}
