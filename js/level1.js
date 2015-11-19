var level1 = function (game) {
	var player;
	var keys;
	var map, layer, objects;
	var blocks, locks, holes, players;
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
	    players = this.add.group();

	    player = [];
		player.push(this.add.sprite(128, 128, "player1"));
		player.push(this.add.sprite(128 + (this.world.width / 2), 128, "player2"));
		for (var i = 0; i < 2; i++) {
			players.add(player[i]);
			player[i].animations.add("idle-down", [ 1 ], 0, true);
			player[i].animations.add("walk-down", [ 0, 1, 2, 3 ], 4, true);
			player[i].animations.add("idle-up", [ 5 ], 0, true);
			player[i].animations.add("walk-up", [ 4, 5, 6, 7 ], 4, true);
			player[i].animations.add("idle-right", [ 9 ], 0, true);
			player[i].animations.add("walk-right", [ 8, 9, 10, 11 ], 4, true);
			player[i].animations.add("idle-left", [ 13 ], 0, true);
			player[i].animations.add("walk-left", [ 12, 13, 14, 15 ], 4, true);
		}

		map.createFromObjects("Object Layer 1", 1, "blocks", 0, true, false, blocks);
		map.createFromObjects("Object Layer 1", 2, "holes", 0, true, false, holes);
		map.createFromObjects("Object Layer 1", 3, "locks", 0, true, false, locks);
		this.world.bringToTop(blocks);

		this.physics.enable([ players, blocks, holes, locks ], Phaser.Physics.ARCADE);
		holes.setAll("body.immovable", true);
		locks.setAll("body.immovable", true);

		players.setAll("body.collideWorldBounds", true);
		player[0].animations.play("idle-down");
		player[1].animations.play("idle-down");
	},
	update: function () {
		var curDir1 = player[0].animations.currentAnim.name.split("-")[1];
		var curDir2 = player[1].animations.currentAnim.name.split("-")[1];
		var physics = this.physics.arcade;
		physics.collide(players, layer);
		physics.collide(players, blocks, moveBlock, null, this);
		physics.collide(blocks, layer);
		physics.collide(blocks, locks);
		physics.overlap(blocks, holes, fillHole, null, this);
		if (this.lockId) locks.forEachAlive(breakLock, this);
		physics.collide(players, locks);
		physics.collide(players, holes);
		if (this.game.keys.left.isDown) {
			player[0].body.velocity.setTo(-100, 0);
			player[1].body.velocity.setTo(0, 0);
			player[0].animations.play("walk-left");
			player[1].animations.play("idle-" + curDir2);
		} else if (this.game.keys.right.isDown) {
			player[0].body.velocity.setTo(100, 0);
			player[1].body.velocity.setTo(0, 0);
			player[0].animations.play("walk-right");
			player[1].animations.play("idle-" + curDir2);
		} else if (this.game.keys.up.isDown) {
			player[0].body.velocity.setTo(0, -100);
			player[1].body.velocity.setTo(0, 0);
			player[0].animations.play("walk-up");
			player[1].animations.play("idle-" + curDir2);
		} else if (this.game.keys.down.isDown) {
			player[0].body.velocity.setTo(0, 100);
			player[1].body.velocity.setTo(0, 0);
			player[0].animations.play("walk-down");
			player[1].animations.play("idle-" + curDir2);
		} else if (this.game.keys.a.isDown) {
			player[1].body.velocity.setTo(-100, 0);
			player[0].body.velocity.setTo(0, 0);
			player[1].animations.play("walk-left");
			player[0].animations.play("idle-" + curDir1);
		} else if (this.game.keys.d.isDown) {
			player[1].body.velocity.setTo(100, 0);
			player[0].body.velocity.setTo(0, 0);
			player[1].animations.play("walk-right");
			player[0].animations.play("idle-" + curDir1);
		} else if (this.game.keys.w.isDown) {
			player[1].body.velocity.setTo(0, -100);
			player[0].body.velocity.setTo(0, 0);
			player[1].animations.play("walk-up");
			player[0].animations.play("idle-" + curDir1);
		} else if (this.game.keys.s.isDown) {
			player[1].body.velocity.setTo(0, 100);
			player[0].body.velocity.setTo(0, 0);
			player[1].animations.play("walk-down");
			player[0].animations.play("idle-" + curDir1);
		} else {
			player[0].body.velocity.setTo(0, 0);
			player[1].body.velocity.setTo(0, 0);
			player[0].animations.play("idle-" + curDir1);
			player[1].animations.play("idle-" + curDir2);
		}
	}
};

var moveBlock = function (obj1, obj2) {
	obj1.body.velocity.setTo(0, 0);
	obj2.body.velocity.setTo(0, 0);
};

var fillHole = function (block, hole) {
	if (this.physics.arcade.distanceBetween(block, hole) < 8) {
		this.lockId = hole.lockId;
		block.kill();
		hole.kill();
	}
};

var breakLock = function (lock) {
	if (lock.lockId === this.lockId) {
		lock.kill();
	}
};