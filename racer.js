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
	
	elPX     = document.getElementById('px'),
	elPY     = document.getElementById('py'),
	elPE     = document.getElementById('pe'),
	elPS     = document.getElementById('ps'),
	elSG	 = document.getElementById('sg'),
	elTC	 = document.getElementById('tc')

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

function step (car) {
	if (car.code === 'player'){

		// constantly decrease speed
		//if (!car.isMoving()){
		//	car.speed = 0;
		//	// car.speed = 0.5;
		//} else {
		//	car.speed *= car.speedDecay;
		//}

		// keys movements
		//if (keys[key.UP])  { car.accelerate(); }
		//if (keys[key.DOWN]){ car.decelerate(); }
		//if (keys[key.LEFT]){ car.steerLeft(); }
		//if (keys[key.RIGHT]){car.steerRight(); }

		//var speedAxis = speedXY(car.rotation, car.speed);
		//car.x += speedAxis.x;
		//car.y += speedAxis.y;

		// collisions
		//if (car.collisions.left.isHit(hit)){
		//	car.steerRight();
		//	car.decelerate(1);
		//}
		//if (car.collisions.right.isHit(hit)){
		//	car.steerLeft();
		//	car.decelerate(1);
		//}
		//if (car.collisions.top.isHit(hit)){
		//	car.decelerate(1);
		//}
		//if (car.collisions.bottom.isHit(hit)){
		//	car.decelerate(1);
		//}

		// info
		elPX.innerHTML = Math.floor(car.x);
		elPY.innerHTML = Math.floor(car.y);
		elPE.innerHTML = Math.floor(car.energyReserve);
		elPS.innerHTML = Math.floor(car.speed);
		elSG.innerHTML = car.segment;
	}
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
	elTC.innerHTML = Math.floor(car.time*10000)/10000;
	car.time += car.speed;
}
function drawCurve2(p0, p1, p2, p3, car) { 
	// p0, p1, p2, p3 define points for bezier curve 
	// curve starts at p3 and goes to p0
	var t = car.time
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

	car.x = finalx;
	car.y = finaly;
	car.energyReserve -= 10;
	if ( car.x < 270 || car.x > 750) {
		car.rotation = car.rotation - (3.2*at);
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
		if (car.time >= 0.98) {
			car.time = 0;
			car.segment = 2;
		}
	}
	else if ( car.segment == 2 && car.energyReserve > 0) {
		var p3 = {"x": 270, "y": 385-car.offset};
		var p2 = {"x": 140-2*car.offset, "y": 435-car.offset};
		var p1 = {"x": 140-2*car.offset, "y": 515+car.offset};
		var p0 = {"x": 270, "y": 565+car.offset};
		drawCurve2(p0, p1, p2, p3, car);
		if (car.time >= 0.98) {
			car.time = 0;
			car.segment = 3;
		}
	}
	else if ( car.segment == 3 && car.energyReserve > 0) {
		var p3 = {"x": 270, "y": 565+car.offset};
		var p2 = {"x": 270, "y": 565+car.offset};
		var p1 = {"x": 750, "y": 565+car.offset};
		var p0 = {"x": 750, "y": 565+car.offset};
		drawCurve2(p0, p1, p2, p3, car);
		if (car.time >= 0.98) {
			car.time = 0;
			car.segment = 4;
		}
	}
	else if ( car.segment == 4 && car.energyReserve > 0) {
		var p3 = {"x": 750, "y": 565+car.offset};
		var p2 = {"x": 880+2*car.offset, "y": 515+car.offset};
		var p1 = {"x": 880+2*car.offset, "y": 435-car.offset};
		var p0 = {"x": 750, "y": 385-car.offset};
		drawCurve2(p0, p1, p2, p3, car);
		if (car.time >= 0.98) {
			car.time = 0;
			car.segment = 1;
		}
	}
}

function frame () {
	step(player1);
	step(player2);
//	step(player3);
	drawTrack();
	drawCar(player1);
	drawCar(player2);
//	drawCar(player3);
	
	stepT(player1);
	stepT(player2);
//	stepT(player3);
	selfDrive(player1);
	selfDrive(player2);
//	selfDrive(player3);
	
	window.requestAnimationFrame(frame);

}
//t = 0;
//clockSpeed = 0.009;
//player2.y -= 40;
//player2.segment = 3;
player1.offset=0; //lane 1
player2.offset=20;//lane 2
//player3.offset=40;//lane 3
//player2.speed=.005;
frame();
