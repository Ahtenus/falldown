$(document).ready(function() {
/*
 TODO:	Don't shift array
		Death
		Points
		Fair random
		Levels
*/

var ctx;
var intervalId;
var canvasMinX;
var WIDTH = 700;
var HEIGHT = 500;
var points;

function Cursor(){
	this.x = WIDTH/2;
	this.w = 25;
	this.h = 25;
	this.y = HEIGHT - this.h;
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
function fallCursor(w){
	var speed = 10;
	var hit = false;
	if(w == null){
		this.y += speed
	}
	else {
		if(this.y + this.h <= w.y && w.y <= this.y + this.h + speed ){ // Will the wall be hit?
			if(w.holeX1 <= this.x && this.x + this.w <= w.holeX2)
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
	}
	if(this.y + this.h > HEIGHT)
		this.y = HEIGHT - this.h;
	return hit;
}
// ] Cursor class

function Wall(){
	this.y = HEIGHT;
	this.h = 25;
	var holewidth = Math.floor((5)*Math.random()) + 2;
	this.holeX1 = Math.floor((29 - holewidth)*Math.random())*25;
	this.holeX2 = this.holeX1 + holewidth*25;
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
walls[0] = new Wall();
function init(){
	points = 0;
	$('#points').html("");
	intervalId = setInterval(draw, 20);
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
function addPoints(p){
	$('#points').html(points += p);
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
	var speed = 4;
	for(i = 0; i < walls.length; i++) {
		if(current && cur.y  <= walls[i].y + walls[i].h) // Current wall to collide with.
		{
			current = false;
			hit = cur.fall(walls[i]);
		}
		walls[i].moveUp(speed);
		walls[i].draw();
		if(hit) { // Move cursor upwards if it's colliding
			cur.y = walls[i].y - cur.h;
			hit = false;
		}
	}
	addPoints(speed);
	if(current)
		cur.fall(null);
		
	if(walls[walls.length -1 ].y < HEIGHT - 125)
		walls[walls.length] = new Wall();
	if(walls[0].y + walls[0].h < 0)
		walls.shift();
	ctx.fillStyle = "orange";
	rect(cur.x, cur.y, cur.w, cur.h);	
	ctx.fillStyle = "black";
}
var canvas = $('#can')[0];
if(canvas.getContext){
	ctx = canvas.getContext('2d');
	canvasMinX = $("#can").offset().left;
	init();
}
});

