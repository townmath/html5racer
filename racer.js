/*global Car,TO_RADIANS,drawRotatedImage */

var canvas   = document.getElementById('canvas'),
	context  = canvas.getContext('2d'),
	ctxW     = canvas.width,
	ctxH     = canvas.height,
	player   = new Car(),
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

var x=10,y=10;
function step (car) {
	if (car.code === 'player'){

		// constantly decrease speed
		if (!car.isMoving()){
			car.speed = 0;
			// car.speed = 0.5;
		} else {
			car.speed *= car.speedDecay;
		}
		// keys movements
		if (keys[key.UP])  { car.accelerate(); }
		if (keys[key.DOWN]){ car.decelerate(); }
		if (keys[key.LEFT]){ car.steerLeft(); }
		if (keys[key.RIGHT]){car.steerRight(); }

		var speedAxis = speedXY(car.rotation, car.speed);
		car.x += speedAxis.x;
		car.y += speedAxis.y;

		// collisions
		if (car.collisions.left.isHit(hit)){
			car.steerRight();
			car.decelerate(1);
		}
		if (car.collisions.right.isHit(hit)){
			car.steerLeft();
			car.decelerate(1);
		}
		if (car.collisions.top.isHit(hit)){
			car.decelerate(1);
		}
		if (car.collisions.bottom.isHit(hit)){
			car.decelerate(1);
		}

		// info
		elPX.innerHTML = Math.floor(car.x);
		elPY.innerHTML = Math.floor(car.y);
		elPE.innerHTML = Math.floor(car.energyReserve);
		elPS.innerHTML = Math.floor(car.speed);
		elSG.innerHTML = car.segment;
	}
}
function draw (car) {
	context.clearRect(0,0,ctxW,ctxH);
	context.drawImage(track, 0, 0);
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
function stepT(t) {
	elTC.innerHTML = Math.floor(t*10000)/10000;
	t += speed;
	return t;
}
function drawCurve2(t, p0, p1, p2, p3, player) {
	// p0, p1, p2, p3 define points for bezier curve
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

	// context.clearRect(0, 0, canvas.width, canvas.height);
	// context.beginPath();
	// context.arc(finalx, finaly, 10, 0, 2 * Math.PI, false);
	// context.fillStyle = 'red';
	// context.fill();
	// context.closePath();
	player.x = 	finalx;
	player.y = finaly;

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

function frame () {
	step(player);
	draw(player);
	// drawCurve();
	t = stepT(t,speed);

	if ( player.segment == 5 ) player.segment = 1;
	
	if ( player.segment == 1 ) {
		var p0 = {"x": 268, "y": 362};
		var p1 = {"x": 268, "y": 362};
		var p2 = {"x": 700, "y": 362};
		var p3 = {"x": 700, "y": 362};
		drawCurve2(t, p0, p1, p2, p3, player);
		if (t >= 0.98) {
			t = 0;
			player.segment = 2;
		}
	}
	if ( player.segment == 2 ) {
		var p0 = {"x": 268, "y": 592};
		var p1 = {"x": 124, "y": 598};
		var p2 = {"x": 123, "y": 351};
		var p3 = {"x": 268, "y": 362};
		drawCurve2(t, p0, p1, p2, p3, player);
		if (t >= 0.98) {
			t = 0;
			player.segment = 3;
		}
	}
	if ( player.segment == 3 ) {
		var p0 = {"x": 700, "y": 598};
		var p1 = {"x": 700, "y": 598};
		var p2 = {"x": 268, "y": 598};
		var p3 = {"x": 268, "y": 598};
		drawCurve2(t, p0, p1, p2, p3, player);
		if (t >= 0.9) {
			t = 0;
			player.segment = 4;
		}
	}
	if ( player.segment == 4 ) {
		var p3 = {"x": 309+400, "y": 592};
		var p2 = {"x": 124+800, "y": 598};
		var p1 = {"x": 123+800, "y": 351};
		var p0 = {"x": 306+400, "y": 362};
		drawCurve2(t, p0, p1, p2, p3, player);
		if (t >= 0.9) {
			t = 0;
			player.segment = 5;
		}
	}
	if ( player.segment == 5 ) {
		var p0 = {"x": 268, "y": 362};
		var p1 = {"x": 268, "y": 362};
		var p2 = {"x": 700, "y": 362};
		var p3 = {"x": 700, "y": 362};
		drawCurve2(t, p0, p1, p2, p3, player);
		if (t >= 0.98) {
			t = 0;
			player.segment = 2;
		}
	}
	
	window.requestAnimationFrame(frame);
}
t = 0;
speed = 0.009;
frame();


