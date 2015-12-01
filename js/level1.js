var level1 = function (game) {
	var player;
	var keys;
	var map, layer;
	var blocks, locks, holes, players, aura;
};

level1.prototype = {
	create: function () {
		this.world.childIndexes = {};
		this.add.tileSprite(0, 0, this.world.width, this.world.height, "floor");
		map = this.add.tilemap("level1-map");
	    map.addTilesetImage("blocks");
	    map.addTilesetImage("holes");
	    map.addTilesetImage("locks");
	    map.addTilesetImage("walls");
	    map.setCollisionBetween(1, 4);
	    layer = map.createLayer("Tile Layer 1");
	    this.world.layer = layer;
	    layer.resizeWorld();

	    blocks = this.add.group();
	    this.world.blocks = blocks;
	    holes = this.add.group();
	    this.world.holes = holes;
	    locks = this.add.group();
	    this.world.locks = locks;
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
			player[i].animations.play("idle-down");
		}
		var allKeys = this.game.keys;
		player[0].keys = { "left": allKeys.left, "right": allKeys.right, "up": allKeys.up, "down": allKeys.down };
		player[1].keys = { "left": allKeys.a, "right": allKeys.d, "up": allKeys.w, "down": allKeys.s };

		map.createFromObjects("Object Layer 1", 1, "blocks", 0, true, false, blocks);
		map.createFromObjects("Object Layer 1", 2, "holes", 0, true, false, holes);
		map.createFromObjects("Object Layer 1", 3, "locks", 0, true, false, locks);
		this.world.bringToTop(blocks);

		player[0].aura = generateAura(this, player[0], 1);
		player[1].aura = generateAura(this, player[1], -1);
		player[0].bounds = player[1].aura;
		player[1].bounds = player[0].aura;
		this.world.bringToTop(players);
	},
	update: function () {
		if (this.lockId) locks.forEachAlive(breakLock, this);
		for (var i = 0 in player) {
			if (!player[i].moving) {
				var oldPos = player[i].position;
				if (player[i].keys["left"].isDown) {
					movePlayer(this, player[i], -1, 0);
					player[i].curDir = "left";
				} else if (player[i].keys["right"].isDown) {
					movePlayer(this, player[i], 1, 0);
					player[i].curDir = "right";
				} else if (player[i].keys["up"].isDown) {
					movePlayer(this, player[i], 0, -1);
					player[i].curDir = "up";
				} else if (player[i].keys["down"].isDown) {
					movePlayer(this, player[i], 0, 1);
					player[i].curDir = "down";
				} else {
					player[i].animations.play("idle-" + player[i].curDir);
				}
			} else {
				player[i].animations.play("walk-" + player[i].curDir);
			}
		}
	}
};

var fillHole = function (ctx, block, hole) {
	ctx.lockId = hole.lockId;
	block.kill();
	hole.kill();
};

var breakLock = function (lock) {
	if (lock.lockId === this.lockId) {
		lock.kill();
		this.lockId = null;
	}
};

var generateAura = function (ctx, player, orientation) {
	var group = ctx.add.group();
	var pPos = player.position;
	for (var i = -2; i <= 2; i++) {
		for (var j = -2; j <= 2; j++) {
			if (Math.abs(i) + Math.abs(j) <= 2) {
				var newX = (pPos.x + (i * 32)) + (orientation * (ctx.world.width / 2));
				var sprite = ctx.add.sprite(newX, pPos.y + (j * 32), "aura");
				group.add(sprite);
			}
		}
	}
	return group;
};

var movePlayer = function (ctx, player, x, y) {
	var dest = new Phaser.Point(player.position.x + (x * 32), player.position.y + (y * 32));
	var blocked = true;
	if (objectAtPoint(player.bounds, dest)) {
		var objAtDest = getNextSpace(ctx.world, dest);
		if (objAtDest === "free") blocked = false;
		else if (objAtDest === "blocks") {
			var block = objectAtPoint(ctx.world["blocks"], dest);
			var bDest = new Phaser.Point(block.position.x + (x * 32), block.position.y + (y * 32));
			var bObjAtDest = getNextSpace(ctx.world, bDest);
			if (bObjAtDest === "free" || bObjAtDest === "holes") {
				blocked = false;
				ctx.add.tween(block).to({ x: bDest.x, y: bDest.y }, 750, Phaser.Easing.Linear.None, true).onComplete.add(function () {
					block.position = bDest;
					if (bObjAtDest === "holes") {
						var holes = ctx.world["holes"];
						holes.forEach(function (child) {
							if (bDest.x === child.position.x && bDest.y === child.position.y) fillHole(ctx, block, child);
						}, this);
					}
				}, this);
			}
		}
	}
	if (!blocked) {
		player.moving = true;
		ctx.add.tween(player).to({ x: dest.x, y: dest.y }, 750, Phaser.Easing.Linear.None, true).onComplete.add(function () {
			player.moving = false;
			player.position = dest;
		}, this);
		player.aura.forEach(function (child) {
			var aDest = new Phaser.Point(child.position.x + (x * 32), child.position.y + (y * 32));
			ctx.add.tween(child).to({ x: aDest.x, y: aDest.y }, 750, Phaser.Easing.Linear.None, true)
				.onComplete.add(function () { child.position = aDest; }, this);
		}, this);
	}
};

var getNextSpace = function (world, point) {
	var groups = world.children;
	for (var i = 0 in groups) {
		if (!groups[i].key) {
			if (groups[i].name === "group") {
				var obj = objectAtPoint(groups[i], point);
				if (obj && obj.key !== "aura") return obj.key;
			} else {
				if (tileAtPoint(groups[i], point)) return "tiles";
			}
		}
	}
	return "free";
};

var objectAtPoint = function (group, point) {
	var children = group.children;
	for (var i = 0 in children) {
		if (children[i].alive && Phaser.Point.equals(children[i].position, point)) return children[i];
	}
};
var tileAtPoint = function (group, point) {
	var tiles = group.getTiles(point.x, point.y, 32, 32, true);
	if (tiles.length > 0) return true;
	else return false;
};