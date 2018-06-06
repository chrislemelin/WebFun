
var myRequestAnimationFrame =  window.requestAnimationFrame ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame    ||
              window.oRequestAnimationFrame      ||
              window.msRequestAnimationFrame     ||
              function(callback) {setTimeout(callback, 1)};

Number.prototype.clamp = function(min, max) {
    return Math.min(Math.max(this, min), max);
};

const MAX_PIXELS= 1024;
const MIN_PIXEL_LENGTH = 1;
const RANDOM_CURATED_LINKS=['Bn7giN9', 'hIfYTfs', 'A4HN4zB', '0sPlzS9', 'BSEaAlt', 'QAeYhXB',
    'sHjLAYE', 'zZ8QJLf', 'ICHetCo', 'CWRAkgx', 'MP75LeW', 'CUHEsZQ', '2Lm80Bj',
    'yrtguvP', '71bnHwN']
const BASE_URL = 'https://chrislemelin.gitlab.io/WebFun/pixels/'
const DEFAULT_ID = 'MGphLLc';
const IMGUR_API_KEY = '2ab48d8265ee7ba';
const CANVAS_RATIO = .5;


function initPicture()
{
    url_string = window.location.href;
    var url = new URL(url_string);
    var id = url.searchParams.get("id");
    if(id != null)
    {
        loadCanvas('https://i.imgur.com/'+id+".png");
    }
    else {
        //default
        loadCanvas('https://i.imgur.com/'+DEFAULT_ID+'.png');
    }
}

function loadCanvas(url)
{
    var pictureCanvas = document.getElementById('picture');
    pictureCtx = pictureCanvas.getContext('2d');

    var img = new Image();
    img.crossOrigin = "Anonymous";


    //drawing of the test image - img1
    img.onload = function () {

        resizeAndDraw(pictureCanvas, pictureCtx, img)

        imageWidth = pictureCanvas.width;
        imageHeight = pictureCanvas.height;

        var compositeOperation = pictureCtx.globalCompositeOperation;

        //pictureCtx.drawImage(img, 0, 0, imageWidth, imageHeight);


        //set to draw behind current content
        pictureCtx.globalCompositeOperation = "destination-over";

        pictureCtx.fillStyle = "rgb(255,255,255)";
        pictureCtx.fillRect(0, 0, pictureCanvas.width, pictureCanvas.height );



        pictureCtx.globalCompositeOperation = compositeOperation;

        initCanvas();

    };

    img.src = url
}



function imgurUpload(data) {
    var auth = 'Client-ID ' + IMGUR_API_KEY;
    $("#loading").css({"display":"initial"});
    $("#displayText").html("");

    $.ajax({
      url: 'https://api.imgur.com/3/image',
      type: 'POST',
      headers: {
        Authorization: auth,
        Accept: 'application/json'
      },
      data: {
        image: data.substring(22),
        type: 'base64'
      },
      success: function(result) {
          var link = BASE_URL+"?id="+result.data.id;
          $("#displayText").html("Success: copy this <a href="+link+">"+link+"</a>");
          $("#loading").css({"display":"none"});

        },
      error: function(result) {
          $("#displayText").html("Fail: that file is wack");
          $("#loading").css({"display":"none"});

      }

    });
}

function resizedImage(canvas, ctx)
{
    if(loadedImage != "")
    {
        var loadPictureCanvas = document.getElementById('loadPicture');
        var loadPictureCtx = loadPictureCanvas.getContext('2d');

        var image = new Image();
        image.onload = function() {
            resizeAndDraw(loadPictureCanvas, loadPictureCtx, image)
            imgurUpload(loadPictureCanvas.toDataURL("image/png"))
        };
        image.src = loadedImage;



    }
    return "";
}
function resizeAndDraw(canvas, ctx, image)
{
    var resizedWidth = image.width;
    var resizedHeight = image.height;

    if(resizedWidth > resizedHeight)
    {
        mult = MAX_PIXELS/resizedWidth;
        resizedWidth = MAX_PIXELS;
        resizedHeight = resizedHeight * mult;

    }
    else {
        mult = MAX_PIXELS/resizedHeight;
        resizedHeight = MAX_PIXELS;
        resizedWidth = resizedWidth * mult;
    }
    canvas.width = Math.max(resizedWidth, resizedHeight);
    canvas.height = Math.max(resizedWidth, resizedHeight);
    ctx.drawImage(image, 0, 0, resizedWidth, resizedHeight);

}

function imageIsLoaded(e) {

    $('#myImg').attr('src', e.target.result);
    $('#myImg').height(200);
    loadedImage = e.target.result;
};


function initPage()
{
    $(":file").change(function () {
       if (this.files && this.files[0]) {
           var reader = new FileReader();
           reader.onload = imageIsLoaded;
           reader.readAsDataURL(this.files[0]);
       }
   });

    $("#send").click(resizedImage);
    $("#randomCurated").click(goToRandomCuratedLink);
    $("#randomLink").click(goToRealRandomLink);
    document.body.addEventListener("mousemove",handleMouseMove);
    document.body.addEventListener("touchstart", handleTouchMove, false);
    document.body.addEventListener("touchmove", handleTouchMove, false);
}



window.onresize = function() {
    width = canvas.width = imageWidth;
    height = canvas.height = imageHeight;

    world.draw();
}

function handleMouseMove(event)
{
    var rect = canvas.getBoundingClientRect();
    world.handleMouseMove(event.clientX - rect.left, event.clientY - rect.top);
}

function handleTouchMove(event)
{
    var rect = canvas.getBoundingClientRect();
    world.handleMouseMove(event.touches[0].clientX - rect.left, event.touches[0].clientY - rect.top);
}

function goToRandomCuratedLink()
{
    randomLink = RANDOM_CURATED_LINKS[Math.floor(Math.random()*RANDOM_CURATED_LINKS.length)];
    window.location.href = BASE_URL+"?id="+randomLink;
}

function goToRealRandomLink()
{
    var auth = 'Client-ID ' + IMGUR_API_KEY;

    $.ajax({
      url: 'https://api.imgur.com/3/gallery/random/random/',
      type: 'GET',
      headers: {
        Authorization: auth,
        Accept: 'application/json'
    },
      success: function(result)
      {
          var randomGallery = result.data[Math.floor(Math.random()*result.data.length)];
          var randomPic;
          if(randomGallery.images != undefined)
          {
              randomPic = randomGallery.images[Math.floor(Math.random()*randomGallery.images.length)].id
          }
          else {
              randomPic = randomGallery.id;
          }
          window.location.href = BASE_URL+"?id="+randomPic;
        },
      error: function(result) {
          console.log("error: "+result)
      }

    });
}


function init() {

    initPicture();
    initPage();
    loadedImage="";
}

window.onload = init;
