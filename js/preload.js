var preload = function (game) {};

preload.prototype = {
	preload: function () {
		this.load.spritesheet("player1", "img/player-1.png", 32, 32);
		this.load.spritesheet("player2", "img/player-2.png", 32, 32);
		this.load.image("floor", "img/floor.png");
		this.load.tilemap("level1-map", "img/level1.json", null, Phaser.Tilemap.TILED_JSON);
    	this.load.image("blocks", "img/block.png");
    	this.load.image("holes", "img/hole.png");
    	this.load.image("locks", "img/lock.png");
    	this.load.image("walls", "img/wall.png");
    	this.load.image("aura", "img/aura.png");
	},
	create: function () {
		this.game.keys = this.game.input.keyboard.createCursorKeys();
		this.game.keys.w = this.game.input.keyboard.addKey(Phaser.KeyCode["W"]);
		this.game.keys.a = this.game.input.keyboard.addKey(Phaser.KeyCode["A"]);
		this.game.keys.s = this.game.input.keyboard.addKey(Phaser.KeyCode["S"]);
		this.game.keys.d = this.game.input.keyboard.addKey(Phaser.KeyCode["D"]);
		this.game.state.start("Level1");
	}
};