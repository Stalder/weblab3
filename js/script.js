// https://jsfiddle.net/user2314737/28wqq1gu/
// Thanks to this example for downloading

var CANVAS_WIDTH = 640;
var CANVAS_HEIGHT = 480;

var IMAGE_WIDTH = 400;
var IMAGE_HEIGHT = 300;

var canvas = document.createElement("canvas");
canvas.setAttribute("width", CANVAS_WIDTH);
canvas.setAttribute("height", CANVAS_HEIGHT);

var br = document.createElement("br");

var generateText = document.createElement("p");
generateText.innerText = "Generate";

var generateButton = document.createElement("button");
generateButton.setAttribute("onclick", "generatePost()");
generateButton.setAttribute("style", "margin-right: 15px");
generateButton.appendChild(generateText);

var saveText = document.createElement("p");
saveText.innerText = "Save";

var saveButton = document.createElement("button");
saveButton.appendChild(saveText);

var saveButtonLinkWrapper = document.createElement("a");
saveButtonLinkWrapper.setAttribute("id", "download");
saveButtonLinkWrapper.setAttribute("download", "collage.jpg");
saveButtonLinkWrapper.setAttribute("href", "");
saveButtonLinkWrapper.appendChild(saveButton);

var body = document.getElementsByTagName("body")[0];
body.appendChild(canvas);
body.appendChild(br);
body.appendChild(generateButton);
body.appendChild(saveButtonLinkWrapper);

var ctx = canvas.getContext("2d");

var summerUrl = "https://source.unsplash.com/collection/1147624/400x300";
var autumnUrl = "https://source.unsplash.com/collection/1147628/400x300";
var winterUrl = "https://source.unsplash.com/collection/1127163/400x300";
var springUrl = "https://source.unsplash.com/collection/1127173/400x300";

var imageSources = [summerUrl, autumnUrl, winterUrl, springUrl];
var images = [];

var generation = 0;
var areImagesDrawed = false;
var isTextFetched = false;
var textToDraw = null;

var resultImage = null;

function asyncGetRequest(url, cb) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) cb(xhr.responseText);
      else throw new Error("Request failed");
    }
  };
  xhr.open("GET", url, true);
  xhr.send(null);
}

function clearText(textWithTags) {
  var htmlElement = document.createElement("div");
  htmlElement.innerHTML = textWithTags;
  var textWithoutTags = htmlElement.textContent || htmlElement.innerText || "";
  return textWithoutTags.trim();
}

function separateTextByLines(text) {
  var charWidth = 20;
  var canvasPadding = 20;
  if (text.length * charWidth < CANVAS_WIDTH - canvasPadding) {
    return [text];
  } else {
    var words = text.split(" ");
    var result = [];
    var currentLine = " ";
    for (var i = 0; i < words.length; i++) {
      if (
        currentLine.length * charWidth + words[i].length * charWidth <
        CANVAS_WIDTH - canvasPadding
      ) {
        currentLine += words[i] + " ";
      } else {
        if (result.length === 4) {
          currentLine += "...";
          result.push(currentLine);
          return result;
        }
        result.push(currentLine);
        currentLine = " " + words[i] + " ";
      }
    }
    return result;
  }
}

function tryToDrawText() {
  if (isTextFetched && areImagesDrawed) {
    ctx.textAlign = "center";
    ctx.font = "30px Helvetica";
    ctx.fillStyle = "white";

    var lineHeight = 36;

    var lines = separateTextByLines(textToDraw);
    var startY = CANVAS_HEIGHT / 2 - (lines.length / 2) * lineHeight;

    for (var i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], 320, startY + i * lineHeight);
    }

    resultImage = canvas.toDataURL("image/jpg");
    saveButtonLinkWrapper.href = resultImage;
  }
}

function onTextFetched(result) {
  var textWithTags = JSON.parse(result)[0].content;
  textToDraw = clearText(textWithTags);
  isTextFetched = true;
  tryToDrawText();
}

function fetchText() {
  var random = Math.random();
  asyncGetRequest(
    "http://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1&generation=" +
      random,
    onTextFetched
  );
}

function onAllImagesLoaded() {
  var displacementX = (CANVAS_WIDTH - 2 * IMAGE_WIDTH) * Math.random();
  var displacementY = (CANVAS_HEIGHT - 2 * IMAGE_HEIGHT) * Math.random();
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (var i = 0; i < 4; i++) {
    ctx.globalAlpha = 0.5;
    ctx.drawImage(
      images[i],
      (i % 2 && IMAGE_WIDTH) + displacementX,
      (Math.floor(i / 2) && IMAGE_HEIGHT) + displacementY
    );
    ctx.globalAlpha = 1;
  }

  areImagesDrawed = true;
  tryToDrawText();
}

var responseCount = 0;

function tryToFetchNext(suitableImages) {
  responseCount++;
  var image = new Image();

  image.onerror = function(error) {
    console.log("Catched CORS error");
    tryToFetchNext(suitableImages);
  }.bind(this);

  image.onload = function() {
    console.log("Successfully requested");
    suitableImages.push(image);
    if (suitableImages.length < 4) {
      tryToFetchNext(suitableImages);
    } else {
      images = suitableImages;
      onAllImagesLoaded();
    }
  }.bind(this);

  image.setAttribute("crossOrigin", "Anonymous");
  image.src = imageSources[suitableImages.length] + "?random=" + Math.random();
}

function collectFourImages() {
  var suitableImages = [];
  responseCount = 0;
  tryToFetchNext(suitableImages);

  return suitableImages;
}

function generatePost() {
  textToDraw = null;
  isTextFetched = false;
  areImagesDrawed = false;
  generation++;

  collectFourImages();
  fetchText();
}

generatePost();
