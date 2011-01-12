/* 
 * Falldown canvas game
 * Copyright 2011 Viktor Barsk
 * Licenced under CC BY-SA 2.5 
 * http://creativecommons.org/licenses/by-sa/2.5/se/
 * Source code: https://github.com/Ahtenus/falldown
 */

$(document).ready(function() {
/*
 TODO:	
 	Fair random
	Slightly different distance between walls
	Empthy JSON
*/

var ctx;
var intervalId;
var canvasMinX;
var WIDTH = 700;
var HEIGHT = 480;
var points;
var cur;
var walls;
var cursor;
var level;
var frame;
var top10;
var highscore;
$.ajaxSetup({cache : false})
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
function fallCursor(w,wallspeed){
	var speed = 7 + level;
	var hit = false;
	if(w == null){
		this.y += speed
	}
	else {
		if(this.y + this.h <= w.y && w.y <= this.y + this.h + speed + wallspeed){ // Will the wall be hit?
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

function updateScore(data) {
	$('#highscore').html("");
	if(data.length < 10)
		top10 = 5;
	else
		top10 = data[data.length-1].s;
	highscore = data[0].s;
	$.each(data, function(i,item){
		$('#highscore').append("<tr><td>"+item.n+"<td>"+item.s+"</tr>");
	});
}
function getScore(){
	$.getJSON("score.json",function(data){updateScore(data);});
}
function init(){
	cur = new Cursor();
	$("#inp").show();
	points = 0;
	$('#points').html("");
	frame = 0;
	$('#level').html(level = 1);
	walls = new Array();
	walls[0] = new Wall();
	cursor = 0;
	$("body").removeClass();
	getScore();
	$(document).bind('mousemove', mousem);
	intervalId = setInterval(draw, 25);

}

var mousem = function(evt){
	var mouseX = evt.pageX - canvasMinX;
	cur.updatePos(mouseX);
};
$(window).resize(function() {
	canvasMinX = $("#can").offset().left;
});
function rect(x,y,w,h) {
	ctx.beginPath();
	ctx.rect(x,y,w,h);
	ctx.closePath();
	ctx.fill();
}
function addPoints(p){
	if(points == top10)
		$("body").addClass("top10");
	if(points == highscore)
		$("body").addClass("highscore").removeClass("top10");
	$('#points').html(points += p);
}
function clear(){
	 ctx.clearRect(0,0,WIDTH,HEIGHT + 5);
	 ctx.fillStyle = "#1A1A18";
}
function die() {
	clearInterval(intervalId);
	$(document).unbind('mousemove', mousem);
	$("body").addClass("end");
}
function draw() {
	clear();
	var current = true;
	var hit;
	var speed = 4 + level; 
	var k;
	for(k = 0; k < walls.length; k++) {
		var i = cursor + k < walls.length ? cursor + k : cursor + k - walls.length; // To avoid array.shift()
		if(current && cur.y  <= walls[i].y + walls[i].h) // Current wall to collide with.
		{
			current = false;
			hit = cur.fall(walls[i],speed);
		}
		walls[i].moveUp(speed);
		walls[i].draw();
		if(hit) { // Move cursor upwards if it's colliding
			cur.y = walls[i].y - cur.h;
			hit = false;
		}
	}
	if(current){
		cur.fall(null);
	}
	if(walls.length < 4){
		if(walls[walls.length -1 ].y < HEIGHT - 125) {
			walls[walls.length] = new Wall();
		
		}
	}
	else {
		if(walls[cursor].y + walls[cursor].h < 0) {
			walls[cursor] = new Wall();
			cursor++;
			if(cursor == walls.length)
				cursor = 0;
		}
	}

	ctx.fillStyle = "#CCCC49";
	rect(cur.x, cur.y, cur.w, cur.h);	
	addPoints(level);
	if (cur.y < 0)
		die();
	frame++;
	if (frame >= 500){
		frame  = 0;
		$('#level').html(++level);
	}
}
var canvas = $('#can')[0];
if(canvas.getContext){
	ctx = canvas.getContext('2d');
	$(window).resize();
}
$('a.play').click( function(){
	init();
});
 $("form").submit(function() {
	var name = $("#name").val();
	$.getJSON('postscore.php?n='+name+'&s='+points,function(data){updateScore(data);});
	$("#inp").hide();
	return false;
    });
// end document.ready
});

