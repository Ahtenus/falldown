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
	var hit = false;
	if(this.y + this.h <= w.y && w.y <= this.y + this.h + speed ){ // Will the wall be hit?
		if(w.holeX1 < this.x && this.x + this.w < w.holeX2)
			this.y += speed;
		else {
			this.y = w.y - this.w;
			hit = true;
		}
	}
	else {
		this.y += speed;
	}
	if(this.y + this.h > w.y && this.y < w.y + w.h ){ // Hole collision
		if(w.holeX1 > this.x)
			this.x = w.holeX1;
		if(this.x + this.w > w.holeX2)
			this.x = w.holeX2 - this.w;
	}
	return hit;
}
// ] Cursor class

function Wall(y){
	this.y = y;
	this.h = 25;
	this.holeX1 = 100;
	this.holeX2 = 200;
	this.draw = drawWall;
	this.moveUp = moveUpWall;
}
function drawWall(){
	ctx.fillRect(0,this.y,this.holeX1,this.h);
	ctx.fillRect(this.holeX2,this.y,WIDTH - this.holeX2,this.h);
}
function moveUpWall(speed){
	this.y -= speed;
}

var cur = new Cursor();
var walls = new Array();
for(i = 0; i < 10; i++) {
	walls[walls.length] = new Wall(i * 100);
}


function init(){
	points = 0;
	$('#points').html("");
	intervalId = setInterval(draw, 100);
	$("#container").removeClass("end");
}

$(document).mousemove(function(evt) {
	var mouseX = evt.pageX -canvasMinX;
	cur.updatePos(mouseX);
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
	var current = true;
	var hit;
	for(i = 0; i < 10; i++) {
		if(current && cur.y  <= walls[i].y + walls[i].h) // Current wall to collide with.
		{
			current = false;
			hit = cur.fall(5,walls[i]);
		}
		walls[i].moveUp(5);
		walls[i].draw();
		if(hit) { // Move cursor upwards if it's colliding
			cur.y = walls[i].y - cur.h;
			hit = false;
		}
	}
	rect(cur.x, cur.y, cur.w, cur.h);	
}
	var canvas = $('#can')[0];
	if(canvas.getContext){
		ctx = canvas.getContext('2d');
		canvasMinX = $("#can").offset().left;
		init();
	}
});

