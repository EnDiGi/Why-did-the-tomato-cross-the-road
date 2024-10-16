
let stains = [];

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 360;
canvas.height = 666;

let tomato = {
	x: 150,
	y: canvas.height - 120,
	width: 50,
	height: 50,
	move_speed: 60,
	sprite: new Image,

	move: function(dir){
		if(dir === "up"){
			this.generate_stain();
			this.y -= this.move_speed
		}
		else if(dir === "right"){
			if(this.x + this.width + this.move_speed <= canvas.width){
				this.generate_stain();
				this.x += this.move_speed
			}
		}
		else if(dir === "down"){
			if(this.y + this.height + this.move_speed <= canvas.height){
				this.generate_stain();
				this.y += this.move_speed
			}
		}
		else if(dir === "left"){
			if(this.x - this.move_speed > 0){
				this.generate_stain();
				this.x -= this.move_speed
			}
		}
	},

	generate_stain: function(){
		stains.push(new Stain(this.x, this.y, this.width, this.height))
	}
}

class Stain{

	constructor(tomato_x, tomato_y, tomato_width, tomato_height){
		this.x = tomato_x
		this.y = tomato_y
		this.width = tomato_width
		this.height = tomato_height

		this.spritesheet = new Image;
		this.spritesheet.src = 'images/tomato/stain_spritesheet.png'
		this.phase = 0;

		this.onGround = true;
		setTimeout(() => {this.onGround = false}, 3000)
	}

	increase_phase(){
		if(this.phase != 6){
			this.phase += 1;
		}
	}

	decrease_phase(){
		this.phase -= 1;
		if(this.phase === 0){
			stains.unshift()
		}	
	}

	get_phase_coordinates(){
		let row = Math.floor(this.phase / 3)
		let col = this.phase % 3

		let width = 256;
		let height = 256;

		let x = col * height
		let y = row * width

		return [x, y, width, height]
	}
}

tomato.sprite.src = 'images/tomato/tomato.png'

function draw(){
	ctx.clearRect(0, 0, canvas.width, canvas.height)

	stains.forEach((stain) => {
		let [sx, sy, sWidth, sHeight] = stain.get_phase_coordinates()
		ctx.drawImage(stain.spritesheet, sx, sy, sWidth, sHeight, stain.x, stain.y, stain.width, stain.height)
	})
	
	ctx.drawImage(tomato.sprite, tomato.x, tomato.y, tomato.width, tomato.height)
}

function update(){
	stains.forEach((stain) => {
		if(stain.onGround){stain.increase_phase()}
		else(stain.decrease_phase())
	})
}

function gameloop(){
	update();
	draw();

	requestAnimationFrame(gameloop)
}

gameloop()

function handleKeydown(event){
	switch(event.keyCode){
		case 37: // Left arrow
			tomato.move("left");
			break;
		case 38: // Up arrow
			tomato.move("up");
			break;
		case 39: // Right arrow
			tomato.move("right");
			break;
		case 40: // Down arrow
			tomato.move("down");
			break;
	}
}

document.addEventListener("keydown", handleKeydown)