/*global Car,TO_RADIANS,drawRotatedImage */

var canvas   = document.getElementById('canvas'),
	context  = canvas.getContext('2d'),
	ctxW     = canvas.width,
	ctxH     = canvas.height,
	player1  = new Car(),
	player2	 = new Car(),
//	player3  = new Car(),
	track    = new Image(),
	trackHit = new Image(),
	
//	elPX     = document.getElementById('px'),
//	elPY     = document.getElementById('py'),
	//car 1 data
	spd1In  = document.getElementById('spd1'),
	erg1In  = document.getElementById('erg1'),
	dist1In = document.getElementById('dist1'),
	time1In = document.getElementById('time1'),
	//car 2 data
	spd2In  = document.getElementById('spd2'),
	erg2In  = document.getElementById('erg2'),
	dist2In = document.getElementById('dist2'),
	time2In = document.getElementById('time2')

;

track.src = "track2.png";
trackHit.src = "track2-hit.png";

// collision
var hit = new HitMap(trackHit);

// Keyboard Variables
var key = {
	UP: 38,
	DOWN: 40,
	LEFT: 37,
	RIGHT: 39
};

var keys = {
	38: false,
	40: false,
	37: false,
	39: false
};


function speedXY (rotation, speed) {
	return {
		x: Math.sin(rotation * TO_RADIANS) * speed,
		y: Math.cos(rotation * TO_RADIANS) * speed * -1,
	};
}

function step (car1,car2) {
		// update car 1 data
		spd1In.innerHTML = Math.floor(car1.speed*1000);
		erg1In.innerHTML = Math.floor(car1.energyReserve);
		dist1In.innerHTML = Math.floor(car1.distance);
		time1In.innerHTML = Math.floor(car1.time);
		// update car 2 data
		spd2In.innerHTML = Math.floor(car2.speed*1000);
		erg2In.innerHTML = Math.floor(car2.energyReserve);
		dist2In.innerHTML = Math.floor(car2.distance);
		time2In.innerHTML = Math.floor(car2.time);
		//?time.innerHTML = Math.floor(car.time*10000)/10000;
		car1.time+=.05;
		car2.time+=.05;
}
function drawTrack () {
	context.clearRect(0,0,ctxW,ctxH);
	context.drawImage(track, 0, 0);
}
function drawCar (car) {
	drawRotatedImage(car.img, car.x, car.y, car.rotation);
}
function drawCurve() {
	context.lineWidth = 2;
	context.strokeStyle = "#bbb";
	context.beginPath();
	sx = 0;
	sx = 40;
	sy = 200;

	context.moveTo(309, 592);
	context.bezierCurveTo(124, 598, 123, 351, 306, 362);
	context.stroke();
}
function stepT(car) {
	car.curve += car.speed;
	car.distance=car.time*car.speed*1000
}
function drawCurve2(p0, p1, p2, p3, car) { 
	// p0, p1, p2, p3 define points for bezier curve 
	// curve starts at p3 and goes to p0
	var t = car.curve
	var at = 1 - t;
	var green1x = p0.x * t + p1.x * at;
	var green1y = p0.y * t + p1.y * at;
	var green2x = p1.x * t + p2.x * at;
	var green2y = p1.y * t + p2.y * at;
	var green3x = p2.x * t + p3.x * at;
	var green3y = p2.y * t + p3.y * at;
	var blue1x = green1x * t + green2x * at;
	var blue1y = green1y * t + green2y * at;
	var blue2x = green2x * t + green3x * at;
	var blue2y = green2y * t + green3y * at;
	var finalx = blue1x * t + blue2x * at;
	var finaly = blue1y * t + blue2y * at;
	// color reference for above http://en.wikipedia.org/wiki/File:Bezier_3_big.gif

	var rotationRate=3.2*car.speed/0.009 //3.2 was guess and checked to be the correct rotation speed for car speed of .009, so I need to adjust for different speeds
	car.x = finalx;
	car.y = finaly;
	car.energyReserve -= .28*Math.pow((car.speed*1000-5),2)+3; //ideal speed of 5, grows quadratically as you move away from .005
	if ( car.x < 270 || car.x > 750) {
		car.rotation = car.rotation - (rotationRate*at);
		return;
	}
	if ( car.x > 270 && car.y > 550) {
		car.rotation = 90;
		return;
	}
	if ( car.x > 270 && car.y < 550) {
		car.rotation = 270;
		return;
	}

}

// Keyboard event listeners
$(window).keydown(function(e){
	if (keys[e.keyCode] !== 'undefined'){
		keys[e.keyCode] = true;
		// e.preventDefault();
	}
});
$(window).keyup(function(e){
	if (keys[e.keyCode] !== 'undefined'){
		keys[e.keyCode] = false;
		// e.preventDefault();
	}
});
function selfDrive(car) {
	
	if ( car.segment == 5 ) car.segment = 1;
	
	if ( car.segment == 1 && car.energyReserve > 0) {
		var p3 = {"x": 750, "y": 385-car.offset};
		var p2 = {"x": 750, "y": 385-car.offset};
		var p1 = {"x": 270, "y": 385-car.offset};
		var p0 = {"x": 270, "y": 385-car.offset};
		drawCurve2(p0, p1, p2, p3, car); 
		if (car.curve >= 0.98) {
			car.curve = 0;
			car.segment = 2;
		}
	}
	else if ( car.segment == 2 && car.energyReserve > 0) {
		var p3 = {"x": 270, "y": 385-car.offset};
		var p2 = {"x": 140-2*car.offset, "y": 435-car.offset};
		var p1 = {"x": 140-2*car.offset, "y": 515+car.offset};
		var p0 = {"x": 270, "y": 565+car.offset};
		drawCurve2(p0, p1, p2, p3, car);
		if (car.curve >= 0.98) {
			car.curve = 0;
			car.segment = 3;
		}
	}
	else if ( car.segment == 3 && car.energyReserve > 0) {
		var p3 = {"x": 270, "y": 565+car.offset};
		var p2 = {"x": 270, "y": 565+car.offset};
		var p1 = {"x": 750, "y": 565+car.offset};
		var p0 = {"x": 750, "y": 565+car.offset};
		drawCurve2(p0, p1, p2, p3, car);
		if (car.curve >= 0.98) {
			car.curve = 0;
			car.segment = 4;
		}
	}
	else if ( car.segment == 4 && car.energyReserve > 0) {
		var p3 = {"x": 750, "y": 565+car.offset};
		var p2 = {"x": 880+2*car.offset, "y": 515+car.offset};
		var p1 = {"x": 880+2*car.offset, "y": 435-car.offset};
		var p0 = {"x": 750, "y": 385-car.offset};
		drawCurve2(p0, p1, p2, p3, car);
		if (car.curve >= 0.98) {
			car.curve = 0;
			car.segment = 1;
		}
	}
}

function frame () {
	step(player1, player2);
	drawTrack();
	//car 1
	drawCar(player1);
	if (player1.energyReserve>0){
		stepT(player1);
		selfDrive(player1);
	}
	else {
		player1.speed=0;
		player1.energyReserve=0;
	}
	//car 2
	drawCar(player2);
	if (player2.energyReserve>0){
		stepT(player2);
		selfDrive(player2);
	}
	else {
		player2.speed=0;
		player2.energyReserve=0;
	}
	
	window.requestAnimationFrame(frame);

}

player1.offset=0; //lane 1
player2.offset=20;//lane 2
//player3.offset=40;//lane 3
player2.speed=.005;
frame();

