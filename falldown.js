$(document).ready(function() {
var ctx;
var intervalId;
var canvasMinX;
var WIDTH = 700;
var HEIGHT = 500;
var points;

function Cursor(){
	this.x = WIDTH/2;
	this.y = 10;
	this.w = 25;
	this.h = 25;
	this.updatePos = updatePos;
	this.fall = fallCursor;
}
function updatePos(moX){
	this.x = moX - this.w / 2;
	if(this.x < 0)
		this.x = 0;
	if(this.x + this.w > WIDTH)
		this.x = WIDTH - this.w;
}
function fallCursor(speed,w){
	if(this.y + this.h <= w.y && w.y <= this.y + this.h + speed ){
		if(w.holeX1 < this.x && this.x + this.w < w.holeX2)
			this.y += speed;
		else
			this.y = w.y - this.w;
	}
	else {
		this.y += speed;
	}
	if(this.y + this.h > w.y +5 && this.y < w.y + w.h ){
		if(w.holeX1 > this.x)
			this.x = w.holeX1;
		if(this.x + this.w > w.holeX2)
			this.x = w.holeX2 - this.w;
	}
}
// ] Cursor class

function Wall(){
	this.y = HEIGHT;
	this.h = 25;
	this.holeX1;
	this.holeX2;
	this.draw = drawWall;
}
function drawWall(){
	ctx.fillRect(0,this.y,this.holeX1,this.h);
	ctx.fillRect(this.holeX2,this.y,WIDTH - this.holeX2,this.h);
}

var cur = new Cursor();
var wall = new Wall();
wall.y = 100;
wall.holeX1 = 100;
wall.holeX2 = 200;

function init(){
	points = 0;
	$('#points').html("");
	intervalId = setInterval(draw, 20);
	$("#container").removeClass("end");
}

$(document).mousemove(function(evt) {
	var mouseX = evt.pageX -canvasMinX;
	cur.updatePos(mouseX,wall);
});
function rect(x,y,w,h) {
	ctx.beginPath();
	ctx.rect(x,y,w,h);
	ctx.closePath();
	ctx.fill();
}
function AddPoints(){
	$('#points').html(points += Math.round((250-cur.w)/26*Math.abs(dy)));
}
function clear(){
	 ctx.clearRect(0,0,WIDTH,HEIGHT + 5);
	 ctx.fillStyle = "black";
}
function die() {
	clearInterval(intervalId);
	$("#container").addClass("end");
	$(document).unbind('click', docclick);
}
function draw() {
	clear();
	cur.fall(10,wall);
	rect(cur.x, cur.y, cur.w, cur.h);
	wall.draw();
}
	var canvas = $('#can')[0];
	if(canvas.getContext){
		ctx = canvas.getContext('2d');
		canvasMinX = $("#can").offset().left;
		init();
	}
});

