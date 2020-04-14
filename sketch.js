var videoFeed; //reference to video from webcam
var lerpPercent = 0; //keep track of lerping
var colorTravelSpeed = .05; //how quickly the color lerps
var prevFrame;
var movementThreshold = 4000;
var maxDotWidth = 15;
var invert = true;

var screenWidth = 600;
var screenHeight = 450;

//COLOR VARIABLES------------------------------------
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
//-----------------------------------------------------------

//SLIDER AND GUI OBJECTS-------------------------------------
var threshSlider;
var invertCheckBox;
var backgroundColorPicker;
var accentOneColorPicker;
var accentTwoColorPicker;
var accentThreeColorPicker;
var accentFourColorPicker;



//-----------------------------------------------------------

function setup() {
  createCanvas(screenWidth, screenHeight);
  pixelDensity(1);
  videoFeed = createCapture(VIDEO);
  videoFeed.size(width / 8, height / 8);
  videoFeed.hide();
  threshSlider = createSlider(0, 10000, 5000);
  invertCheckBox = createCheckbox('Invert',false);

    backgroundColorPicker = createInput(RGBToHex(backCol[0],backCol[1],backCol[2]), 'color');
  accentOneColorPicker = createInput(RGBToHex(accentColOne[0],accentColOne[1],accentColOne[2]), 'color');
    accentTwoColorPicker = createInput(RGBToHex(accentColTwo[0],accentColTwo[1],accentColTwo[2]), 'color');
    accentThreeColorPicker = createInput(RGBToHex(accentColThree[0],accentColThree[1],accentColThree[2]), 'color');
    accentFourColorPicker = createInput(RGBToHex(accentColFour[0],accentColFour[1],accentColFour[2]), 'color');

}


function draw() {

  movementThreshold = threshSlider.value();
  invert = invertCheckBox.checked();
  hexToRGB(accentOneColorPicker.value(), accentColOne);
  hexToRGB(accentTwoColorPicker.value(), accentColTwo);
  hexToRGB(accentThreeColorPicker.value(), accentColThree);
  hexToRGB(accentFourColorPicker.value(), accentColFour);
  hexToRGB(backgroundColorPicker.value(), backCol);



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
      var widthBasedOnMovement = 1;
      //get new width based on pixel comparisons
      //widthBasedOnMovement = whatever
      if (prevFrame != null) {
        var moveDist = getColDist(r, prevFrame[index + 0], g, prevFrame[index + 1], b, prevFrame[index + 2]);

        if (invert) {
          if (moveDist > movementThreshold) {
            widthBasedOnMovement = 0;
          } else if (moveDist < movementThreshold) {
            widthBasedOnMovement = 1;
          }
        } else {
          if (moveDist < movementThreshold) {
            widthBasedOnMovement = 0;
          } else {
            widthBasedOnMovement = 1;
          }
        }



        // print(moveDist);
      }
      //
      var widthBrightnessModifier = 1;
      stroke(0, 0, 0, 0);
      if (brightMapped < 1) {
        fill(currentColOne);
        widthBrightnessModifier = 1;
      } else if (brightMapped < 3) {
        fill(currentColOne);
        widthBrightnessModifier = 4;
      } else if (brightMapped < 5) {
        fill(currentColTwo);
        widthBrightnessModifier = 6;
      } else if (brightMapped < 7) {
        fill(currentColThree);
        widthBrightnessModifier = 8;
      } else {
        fill(currentColFour);
        widthBrightnessModifier = 10;
      }

      rectMode(CENTER);

      var finalWidth = widthBrightnessModifier * widthBasedOnMovement;
      if (finalWidth > maxDotWidth) {
        finalWidth = maxDotWidth;
      }

      ellipse(x * 8, y * 8, finalWidth, finalWidth);
    }
  }
  prevFrame = videoFeed.pixels;

}

function getColDist(r1, g1, b1, r2, g2, b2) {
  var dist = (r2 - r1) * (r2 - r1) + (g2 - g1) * (g2 - g1) + (b2 - b1) * (b2 - b1);
  return dist;

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

function hexToRGB(hexNum, arr) {
      hexNum = hexNum.replace('#', '');

    arr[0] = unhex(hexNum.substring(0,2));
    arr[1] = unhex(hexNum.substring(2,4));
    arr[2] = unhex(hexNum.substring(4,6));
}

function RGBToHex(r,g,b){
  var c = color(r,g,b);
  var hx = "#" + hex(r,2) + hex(g,2) + hex(b,2);
  print(hx);
  return hx;
}
