var input_blur = document.getElementById('input_blur');
var input_stroke = document.getElementById('input_stroke');
var input_strokeTypeA = document.getElementById('input_strokeTypeA');
var input_strokeTypeB = document.getElementById('input_strokeTypeB');
var canvas = document.getElementsByTagName('canvas')[0];
var ctx = canvas.getContext('2d');
var w = canvas.width;
var h = canvas.height;
var stroke = [];
var strokes = [];
var is_drawing = false;

var blur_radius = 3;
var stroke_radius = 1;
var stroke_type = 0;

var extra_offset = 0;

var bounding_box = [0, 0, 0, 0];



var applyBlur = function (blur_radius, iterations) {
    iterations = iterations || 1;
    if (blur_radius){
        boxBlurCanvasRGBA( canvas, 0, 0, w, h, blur_radius, iterations );
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
    ctx.strokeStyle = 'red';
    ctx.lineWidth = stroke_radius;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    applyBlur(blur_radius, 1);
};

var drawShadowStroke = function (canvas, stroke) {
    var i;
    var offsetX = w + extra_offset;
    var offsetY = h + extra_offset;
    ctx.save();

    ctx.setTransform(1, 0, 0, 1, offsetX, offsetY);
    ctx.shadowColor = 'red';
    ctx.shadowBlur = blur_radius;
    ctx.shadowOffsetX = 0 - offsetX;
    ctx.shadowOffsetY = 0 - offsetY;

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

var stroke_types = [
    drawStroke,
    drawShadowStroke
];



var listeners = {
    mousedown : function (e) {
        var x = e.offsetX;
        var y = e.offsetY;
        stroke.push([x, y]);
        clearCanvas();
        is_drawing = true;
    },
    mousemove : function (e) {
        if (!is_drawing) return;
        var x = e.offsetX;
        var y = e.offsetY;
        stroke.push([x, y]);
        clearCanvas();
        stroke_types[stroke_type](canvas, stroke);
    },
    mouseup : function (e) {
        if (!is_drawing) return;
        clearCanvas();
        stroke_types[stroke_type](canvas, stroke);

        strokes.push(stroke);
        stroke = [];
        is_drawing = false;
    },
    input_blur : function (e) {
        blur_radius = this.value;
    },
    input_stroke : function (e) {
        stroke_radius = this.value;
    },
    input_strokeType: function (e) {
        stroke_type = parseInt(this.value, 10);
    },
    input_shadowOffset: function (e) {
        extra_offset = parseInt(this.value, 10);
    }
};



canvas.addEventListener('mousedown', listeners.mousedown);
window.addEventListener('mousemove', listeners.mousemove);
window.addEventListener('mouseup', listeners.mouseup);

input_blur.addEventListener('input', listeners.input_blur);
input_stroke.addEventListener('input', listeners.input_stroke);
input_strokeTypeA.addEventListener('change', listeners.input_strokeType);
input_strokeTypeB.addEventListener('change', listeners.input_strokeType);
input_shadowOffset.addEventListener('change', listeners.input_shadowOffset);


var testStroke = [[31,155],[31,154],[31,152],[32,151],[33,149],[34,147],[36,145],[37,143],[38,141],[39,139],[40,137],[41,136],[43,131],[44,128],[45,125],[46,123],[47,120],[47,117],[48,113],[49,110],[49,107],[49,104],[50,101],[51,95],[51,90],[52,85],[52,81],[53,76],[53,72],[53,69],[53,67],[53,66],[53,65],[52,65],[51,66],[50,67],[49,69],[49,70],[49,71],[47,74],[46,77],[45,79],[45,81],[44,83],[44,86],[43,88],[43,90],[42,93],[42,97],[41,101],[41,104],[41,109],[40,112],[40,115],[40,119],[40,121],[40,125],[40,128],[40,130],[40,132],[40,134],[40,136],[40,139],[40,141],[40,142],[39,144],[39,145],[39,146],[39,145],[39,142],[39,138],[41,134],[42,131],[43,128],[45,125],[48,123],[49,121],[51,119],[54,118],[56,117],[58,117],[59,117],[60,117],[60,119],[60,121],[61,123],[61,126],[61,128],[61,130],[61,134],[61,136],[61,137],[61,138],[61,140],[61,141],[61,142],[61,143],[61,144],[62,145],[63,145],[65,146],[67,146],[69,146],[71,146],[74,146],[76,146],[78,145],[81,143],[82,141],[84,139],[85,137],[86,134],[87,131],[87,128],[87,126],[88,124],[88,121],[88,120],[88,118],[88,117],[88,116],[87,116],[86,116],[85,117],[83,120],[81,124],[81,127],[81,130],[81,133],[81,136],[81,138],[81,140],[81,141],[81,143],[81,144],[82,145],[82,146],[84,147],[85,147],[87,147],[89,147],[92,147],[94,147],[97,146],[99,143],[101,140],[102,136],[105,127],[108,118],[109,111],[111,105],[113,99],[114,94],[115,89],[116,84],[116,80],[116,77],[116,76],[115,76],[113,79],[112,80],[111,83],[109,87],[108,91],[108,96],[107,101],[107,104],[107,109],[107,112],[107,116],[106,119],[106,123],[106,127],[105,131],[105,135],[105,138],[105,140],[105,142],[106,145],[106,146],[107,147],[109,148],[110,149],[112,149],[113,149],[114,149],[117,148],[119,145],[122,140],[124,132],[126,124],[128,113],[131,102],[132,96],[132,90],[133,84],[134,80],[134,75],[134,72],[134,70],[134,69],[134,68],[133,68],[132,68],[130,68],[129,69],[128,71],[126,73],[126,75],[125,79],[124,82],[124,87],[124,92],[124,96],[123,100],[123,104],[122,111],[122,116],[122,120],[121,124],[121,128],[121,131],[121,134],[121,136],[121,138],[121,140],[121,141],[121,142],[121,143],[121,145],[122,145],[122,146],[123,146],[124,146],[125,146],[127,146],[128,144],[129,142],[131,140],[132,137],[134,134],[136,132],[137,130],[139,128],[141,126],[142,124],[143,121],[144,118],[145,115],[145,113],[144,113],[143,113],[142,113],[140,116],[139,117],[138,120],[138,122],[136,126],[136,128],[136,131],[136,132],[136,135],[136,136],[137,138],[138,139],[139,141],[140,142],[142,142],[144,143],[146,144],[148,144],[149,143],[150,142],[150,140],[151,136],[152,133],[152,130],[152,128],[152,125],[152,123],[150,119],[148,118],[146,116],[144,115],[143,114],[142,113],[143,114],[150,115],[156,116],[163,117],[172,117],[178,117],[182,117],[184,117]];
drawShadowStroke(canvas, testStroke);
