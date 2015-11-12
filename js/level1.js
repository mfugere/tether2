var level1 = function (game) {
	var player1;
	var keys;
	var map;
	var layer, objects;
	var blocks, locks, holes;
};

level1.prototype = {
	create: function () {
		this.physics.startSystem(Phaser.Physics.ARCADE);
		this.add.tileSprite(0, 0, this.world.width, this.world.height, "floor");
		map = this.add.tilemap("level1-map");
	    map.addTilesetImage("blocks");
	    map.addTilesetImage("holes");
	    map.addTilesetImage("locks");
	    map.addTilesetImage("walls");
	    map.setCollisionBetween(1, 4);
	    layer = map.createLayer("Tile Layer 1");
	    layer.resizeWorld();

	    blocks = this.add.group();
	    holes = this.add.group();
	    locks = this.add.group();

		player1 = this.add.sprite(32, 32, "player1");
		player1.animations.add("idle-down", [ 1 ], 0, true);
		player1.animations.add("walk-down", [ 0, 1, 2, 3 ], 4, true);
		player1.animations.add("idle-up", [ 5 ], 0, true);
		player1.animations.add("walk-up", [ 4, 5, 6, 7 ], 4, true);
		player1.animations.add("idle-right", [ 9 ], 0, true);
		player1.animations.add("walk-right", [ 8, 9, 10, 11 ], 4, true);
		player1.animations.add("idle-left", [ 13 ], 0, true);
		player1.animations.add("walk-left", [ 12, 13, 14, 15 ], 4, true);

		map.createFromObjects("Object Layer 1", 1, "blocks", 0, true, false, blocks);
		map.createFromObjects("Object Layer 1", 2, "holes", 0, true, false, holes);
		map.createFromObjects("Object Layer 1", 3, "locks", 0, true, false, locks);
		this.world.bringToTop(blocks);

		this.physics.enable([ player1, blocks, holes, locks ], Phaser.Physics.ARCADE);
		holes.setAll("body.immovable", true);
		locks.setAll("body.immovable", true);
		player1.body.collideWorldBounds = true;
		player1.animations.play("idle-down");

		keys = this.input.keyboard.createCursorKeys();
	},
	update: function () {
		var curDir = player1.animations.currentAnim.name.split("-")[1];
		var physics = this.physics.arcade;
		physics.collide(player1, layer);
		physics.collide(player1, blocks, moveBlock, null, this);
		physics.collide(blocks, layer);
		physics.collide(blocks, locks);
		physics.overlap(blocks, holes, fillHole, null, this);
		physics.collide(player1, locks);
		physics.collide(player1, holes);
		if (keys.left.isDown) {
			player1.body.velocity.setTo(-100, 0);
			player1.animations.play("walk-left");
		} else if (keys.right.isDown) {
			player1.body.velocity.setTo(100, 0);
			player1.animations.play("walk-right");
		} else if (keys.up.isDown) {
			player1.body.velocity.setTo(0, -100);
			player1.animations.play("walk-up");
		} else if (keys.down.isDown) {
			player1.body.velocity.setTo(0, 100);
			player1.animations.play("walk-down");
		} else {
			player1.body.velocity.setTo(0, 0);
			player1.animations.play("idle-" + curDir);
		}
	}
};

var moveBlock = function (obj1, obj2) {
	obj1.body.velocity.setTo(0, 0);
	obj2.body.velocity.setTo(0, 0);
};

var fillHole = function (block, hole) {
	if (this.physics.arcade.distanceBetween(block, hole) < 8) {
		block.kill();
	}
};