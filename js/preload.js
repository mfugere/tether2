var preload = function (game) {};

preload.prototype = {
	preload: function () {
		this.load.spritesheet("player1", "img/player-1.png", 32, 32);
		this.load.image("floor", "img/floor.png");
		this.load.tilemap("level1-map", "img/level1.json", null, Phaser.Tilemap.TILED_JSON);
    	this.load.image("blocks", "img/block.png");
    	this.load.image("holes", "img/hole.png");
    	this.load.image("locks", "img/lock.png");
    	this.load.image("walls", "img/wall.png");
	},
	create: function () {
		this.game.state.start("Level1");
	}
};