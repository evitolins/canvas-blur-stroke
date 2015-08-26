var input_blur = document.getElementById('input_blur');
var input_stroke = document.getElementById('input_stroke');

var canvas = document.getElementsByTagName('canvas')[0];
var ctx = canvas.getContext('2d');
var w = canvas.width;
var h = canvas.height;
var strokes = [];
var stroke = [];
var is_drawing = false;
var blur_radius = 0;
var stroke_radius = 1;

var bounding_box = [0, 0, 0, 0]; //

var listeners = {
    mousedown : function (e) {
        var x = e.offsetX;
        var y = e.offsetY;
        stroke.push([x, y]);
        clearCanvas();
        is_drawing = true;
    },
    mousemove : function (e) {
        var x = e.offsetX;
        var y = e.offsetY;
        if (is_drawing) {
            stroke.push([x, y]);
            clearCanvas();
            drawStroke(canvas, stroke);
            applyBlur(blur_radius, 1);
        }
    },
    mouseup : function (e) {
        clearCanvas();
        drawStroke(canvas, stroke);
        applyBlur(blur_radius, 1);

        strokes.push(stroke);
        stroke = [];
        is_drawing = false;
    },
    input_blur : function (e) {
        blur_radius = this.value;
    },
    input_stroke : function (e) {
        stroke_radius = this.value;
    }

};

var clearCanvas = function () {
    ctx.clearRect(0, 0, w, h);
};

var drawStroke = function (canvas, stroke) {
    var i;
    ctx.beginPath();
    ctx.moveTo(stroke[0][0],stroke[0][1]);
    for (i=1; i<stroke.length; i++) {
        ctx.lineTo(stroke[i][0], stroke[i][1]);
    }
    ctx.strokeStyle = "red";
    ctx.lineWidth = stroke_radius;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
};

var applyBlur = function (blur_radius, iterations) {
    iterations = iterations || 1;
    if (blur_radius){
        boxBlurCanvasRGBA( canvas, 0, 0, w, h, blur_radius, iterations );
    }
};

var drawBlurStroke = function (canvas, stroke) {
    var i;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(stroke[0][0],stroke[0][1]);
    for (i=1; i<stroke.length; i++) {
        ctx.lineTo(stroke[i][0], stroke[i][1]);
    }
    ctx.strokeStyle = "red";
    ctx.lineWidth = stroke_radius;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    ctx.restore();
};





canvas.addEventListener('mousedown', listeners.mousedown);
window.addEventListener('mousemove', listeners.mousemove);
window.addEventListener('mouseup', listeners.mouseup);

input_blur.addEventListener('input', listeners.input_blur);
input_stroke.addEventListener('input', listeners.input_stroke);

