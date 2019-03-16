var CANVAS_WIDTH = 640;
var CANVAS_HEIGHT = 480;

var IMAGE_WIDTH = 400;
var IMAGE_HEIGHT = 300;

var canvas = document.createElement("canvas");
canvas.setAttribute("width", CANVAS_WIDTH);
canvas.setAttribute("height", CANVAS_HEIGHT);

var body = document.getElementsByTagName("body")[0];
body.appendChild(canvas);

var ctx = canvas.getContext("2d");

var summerUrl = "https://source.unsplash.com/collection/1147624/400x300";
var autumnUrl = "https://source.unsplash.com/collection/1147628/400x300";
var winterUrl = "https://source.unsplash.com/collection/1127163/400x300";
var springUrl = "https://source.unsplash.com/collection/1127173/400x300";

var imageSources = [summerUrl, autumnUrl, winterUrl, springUrl];
var images = [new Image(), new Image(), new Image(), new Image()];

var generation = 0;
var loadedImagesCount = 0;
var areImagesDrawed = false;
var isTextFetched = false;
var textToDraw = null;

function asyncPostRequest(url, body, cb) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) cb(xhr.responseText);
      else throw new Error("Request failed");
    }
  };
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.send(body);
}

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
  return htmlElement.textContent || htmlElement.innerText || "";
}

function tryToDrawText() {
  if (isTextFetched && areImagesDrawed) {
    console.log("Everything is loaded. Draw text");
    console.log("Drawing: " + textToDraw);
  }
}

function onTextFetched(result) {
  var textWithTags = JSON.parse(result)[0].content;
  textToDraw = clearText(textWithTags);
  isTextFetched = true;
  tryToDrawText();
}

function fetchText() {
  asyncGetRequest(
    "http://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1",
    onTextFetched
  );
}

function onAllImagesLoaded() {
  for (var i = 0; i < 4; i++) {
    ctx.globalAlpha = 0.5;
    ctx.drawImage(
      images[i],
      i % 2 && IMAGE_WIDTH,
      Math.floor(i / 2) && IMAGE_HEIGHT
    );
    ctx.globalAlpha = 1;
  }

  areImagesDrawed = true;
  tryToDrawText();
}

function onImageLoaded() {
  loadedImagesCount++;
  if (loadedImagesCount === 4) onAllImagesLoaded();
}

function generatePost() {
  textToDraw = null;
  isTextFetched = false;
  areImagesDrawed = false;
  generation++;
  loadedImagesCount = 0;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (var i = 0; i < 4; i++) {
    images[i].onload = onImageLoaded;
    images[i].src = imageSources[i] + "?generation=" + generation;
  }

  fetchText();
}

generatePost();
