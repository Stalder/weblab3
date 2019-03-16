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
ctx.fillRect(0, 0, canvas.width, canvas.height);

var autumnUrl = "https://source.unsplash.com/collection/1147628/400x300";
var summerUrl = "https://source.unsplash.com/collection/1147624/400x300";
var springUrl = "https://source.unsplash.com/collection/1127173/400x300";
var winterUrl = "https://source.unsplash.com/collection/1127163/400x300";

var image1 = new Image();
image1.onload = function() {
  ctx.globalAlpha = 0.5;
  ctx.drawImage(image1, 0, 0);
  ctx.globalAlpha = 1;
};
image1.src = autumnUrl;

var image2 = new Image();
image2.onload = function() {
  ctx.globalAlpha = 0.5;
  ctx.drawImage(image2, IMAGE_WIDTH, 0);
  ctx.globalAlpha = 1;
};
image2.src = summerUrl;

var image3 = new Image();
image3.onload = function() {
  ctx.globalAlpha = 0.5;
  ctx.drawImage(image3, 0, IMAGE_HEIGHT);
  ctx.globalAlpha = 1;
};
image3.src = springUrl;

var image4 = new Image();
image4.onload = function() {
  ctx.globalAlpha = 0.5;
  ctx.drawImage(image4, IMAGE_WIDTH, IMAGE_HEIGHT);
  ctx.globalAlpha = 1;
};
image4.src = winterUrl;

function asyncGet(url, cb) {
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
