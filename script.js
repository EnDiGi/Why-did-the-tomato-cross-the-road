
let stains = [];
let active_tiles = [];

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 360;
canvas.height = 666;

class Tile{
	constructor(row){

		this.width = canvas.width;
		this.height = 60;
		
		this.x = 0;
		this.y = -(row * this.height)

		this.sprite = new Image;

		this.can_spawn_cars = null
	}
}

class Grass extends Tile{
	constructor(row){
		super(row)
		this.can_spawn_cars = false
	}
}

class Light_Grass extends Grass{
	constructor(row){
		super(row)
		this.number = 0;
		this.sprite.src = 'images/tiles/light_grass.png'
	}
}

class Dark_Grass extends Grass{
	constructor(row){
		super(row)
		this.number = 1;
		this.sprite.src = 'images/tiles/dark_grass.png'
	}
}

class Road extends Tile{
	constructor(row){
		super(row)
		this.number = 2;
		this.sprite.src = 'images/tiles/road.png'
		this.can_spawn_cars = true;
	}
}

tile_types = [Light_Grass, Dark_Grass, Road]

const paths = {
	initial_path: [0, 1, 0, 1, 2],
	paths_to_choose: [
		[0, 1, 2, 2, 2],
		[0, 1, 2, 2, 1],
		[2, 1, 0, 2, 1]
	],
	last_path_generated: 0,
}

let tomato = {
	x: 150,
	y: canvas.height - 120,
	width: 50,
	height: 50,
	move_speed: 60,
	sprite: new Image,
	border: canvas.height,

	current_row: 0,
	max_row: 0,
	next_row_to_generate_path: 5,

	move: function(dir){
		if(dir === "up"){
			this.generate_stain();
			this.y -= this.move_speed
			this.current_row++
			this.max_row = Math.max(this.current_row, this.max_row)
		}
		else if(dir === "right"){
			if(this.x + this.width + this.move_speed <= canvas.width){
				this.generate_stain();
				this.x += this.move_speed
			}
		}
		else if(dir === "down"){
			if(this.y + this.height + this.move_speed <= this.border){
				this.generate_stain();
				this.y += this.move_speed
				this.current_row--
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
		setTimeout(() => {this.onGround = false}, 1350)
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

function choose(array){
	const randomIndex = Math.floor(Math.random() * array.length);
	return array[randomIndex];
}

function generate_path(path = choose(paths.paths_to_choose)){

	path.forEach((tile_num) => {
		switch(tile_num){
			case 0:
				active_tiles.push(new Light_Grass((tomato.current_row + 10) + paths.last_path_generated - 21));
				break;
			case 1:
				active_tiles.push(new Dark_Grass((tomato.current_row + 10) + paths.last_path_generated - 21));
				break;
			case 2:
				active_tiles.push(new Road((tomato.current_row + 10) + paths.last_path_generated - 21));
				break;
		}
		paths.last_path_generated++
	})
}

function draw(){
	ctx.clearRect(0, 0, canvas.width, canvas.height)

	active_tiles.forEach((tile) => {
		ctx.drawImage(tile.sprite, tile.x, tile.y + tomato.current_row * 60, tile.width, tile.height)
	})

	stains.forEach((stain) => {
		let [sx, sy, sWidth, sHeight] = stain.get_phase_coordinates()
		ctx.drawImage(stain.spritesheet, sx, sy, sWidth, sHeight, stain.x, stain.y + tomato.current_row * 60, stain.width, stain.height)
	})
	
	ctx.drawImage(tomato.sprite, tomato.x, tomato.y + tomato.current_row * 60, tomato.width, tomato.height)
}

function update(){
	stains.forEach((stain) => {
		if(stain.onGround){stain.increase_phase()}
		else(stain.decrease_phase())
	})
	
	if(tomato.current_row >= tomato.next_row_to_generate_path){
		generate_path();
	}

	document.getElementById('score_counter').textContent = tomato.max_row

	document.getElementById('score_counter').left = this.width / 2 - document.getElementById('score_counter').width / 2
}

function gameloop(){
	update();
	draw();

	requestAnimationFrame(gameloop)
}

function game(){
	generate_path(paths.initial_path)
	tomato.next_row_to_generate_path = 0;
	gameloop()
}

game()

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
		case 87: // W
			tomato.move("up");
			break;
		case 65: // A
			tomato.move("left");
			break;
		case 83: // S
			tomato.move("down");
			break;
		case 68: // D			
			tomato.move("right");
			break;
	}
}

document.addEventListener("keydown", handleKeydown)