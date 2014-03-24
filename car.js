
function Car () {
	this.img = new Image();   // Create new img element
	this.img.onload = function(){
	  // execute drawImage statements here
	};
	this.img.src = 'car.png'; // Set source path

	// collision
	this.collisions = {
		top: new CollisionPoint(this, 0),
		right: new CollisionPoint(this, 90, 10),
		bottom: new CollisionPoint(this, 180),
		left: new CollisionPoint(this, 270, 10)
	};
}
Car.prototype = {
	x: 730,
	y: 385,
	code: 'player',
	acceleration: 1.1,
	rotationStep: 4,
	rotation: 270,
	speed: .009,
	speedDecay: 0.98,
	maxSpeed: 4,
	backSpeed: 1.1,
	energyReserve: 7000,
	segment: 1,
	time: 0,
	offset: 0, //offset allows the cars to be in different lanes


	isMoving: function (speed) {
		//this.getSegment();

		if (this.speed > 2) {
			this.energyReserve = this.energyReserve - 10;
		}

		if (this.speed < 2 && this.speed > 0.4) {
			this.energyReserve = this.energyReserve - 1;
		}
		
		return !(this.speed > -0.4 && this.speed < 0.4);
	},
	getCenter: function(){
		return {
			x: this.x,
			y: this.y
		};
	},
	accelerate: function(){
		if (this.speed < this.maxSpeed){
			if (this.speed < 0){
				this.speed *= this.speedDecay;
			} else if (this.speed === 0){
				this.speed = 0.4;
			} else {
				this.speed *= this.acceleration;
			}
		}
	},
	decelerate: function(min){
		min = min || 0;
		if (Math.abs(this.speed) < this.maxSpeed){
			if (this.speed > 0){
				this.speed *= this.speedDecay;
				this.speed = this.speed < min ? min : this.speed;
			} else if (this.speed === 0){
				this.speed = -0.4;
			} else {
				this.speed *= this.backSpeed;
				this.speed = this.speed > min ? min : this.speed;
			}
		}
	},
	steerLeft: function(){
		if (this.isMoving()){
			this.rotation -= this.rotationStep * (this.speed/this.maxSpeed);
		}
	},
	steerRight: function(){
		if (this.isMoving()){
			this.rotation += this.rotationStep * (this.speed/this.maxSpeed);
		}
	},
	getSegment: function(){
		if ( this.x < 700 && this.x > 268 && this.y < 420 ) {
			this.segment = 1;
		}
		if ( this.x < 268 && this.y > 270 ) {
			this.segment = 2;
		}
		if ( this.x < 700 && this.x > 268 && this.y > 450 ) {
			this.segment = 3;
		}
		if ( this.x > 700 && this.y > 270 ) {
			this.segment = 4;
		}

	}

};

