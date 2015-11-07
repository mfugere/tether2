var level1 = function (game) {
	var player1;
	var keys;
};

level1.prototype = {
	create: function () {
		this.physics.startSystem(Phaser.Physics.ARCADE);
		this.add.tileSprite(0, 0, this.world.width, this.world.height, "floor");

		player1 = this.add.sprite(32, 32, "player1");
		player1.animations.add("idle-down", [ 1 ], 0, true);
		player1.animations.add("walk-down", [ 0, 1, 2, 3 ], 4, true);
		player1.animations.add("idle-up", [ 5 ], 0, true);
		player1.animations.add("walk-up", [ 4, 5, 6, 7 ], 4, true);
		player1.animations.add("idle-right", [ 9 ], 0, true);
		player1.animations.add("walk-right", [ 8, 9, 10, 11 ], 4, true);
		player1.animations.add("idle-left", [ 13 ], 0, true);
		player1.animations.add("walk-left", [ 12, 13, 14, 15 ], 4, true);
		this.physics.enable(player1, Phaser.Physics.ARCADE);
		player1.body.collideWorldBounds = true;
		player1.animations.play("idle-down");

		keys = this.input.keyboard.createCursorKeys();
	},
	update: function () {
		var curDir = player1.animations.currentAnim.name.split("-")[1];
		if (keys.left.isDown) {
			player1.body.velocity.x = -100;
			player1.animations.play("walk-left");
		} else if (keys.right.isDown) {
			player1.body.velocity.x = 100;
			player1.animations.play("walk-right");
		} else if (keys.up.isDown) {
			player1.body.velocity.y = -100;
			player1.animations.play("walk-up");
		} else if (keys.down.isDown) {
			player1.body.velocity.y = 100;
			player1.animations.play("walk-down");
		} else {
			player1.body.velocity.setTo(0, 0);
			player1.animations.play("idle-" + curDir);
		}
	}
};