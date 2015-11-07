var preload = function (game) {};

preload.prototype = {
	preload: function () {
		this.load.spritesheet("player1", "img/player-1.png", 32, 32);
		this.load.image("floor", "img/floor.png");
	},
	create: function () {
		this.game.state.start("Level1");
	}
};