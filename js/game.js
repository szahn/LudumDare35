/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	/// <reference path="../typings/tsd.d.ts" />
	var State = __webpack_require__(1);
	var Level = __webpack_require__(4);
	var Player = __webpack_require__(17);
	var CanvasRenderer = __webpack_require__(20);
	var Assets = __webpack_require__(3);
	var Input = __webpack_require__(22);
	var Point = __webpack_require__(5);
	var GameState = __webpack_require__(2);
	var Game = (function () {
	    function Game() {
	    }
	    Game.prototype.loadLevels = function () {
	        return $.get("data/levels.json");
	    };
	    Game.prototype.start = function (canvas) {
	        var _this = this;
	        Assets.preload();
	        this.renderer = new CanvasRenderer(canvas.getContext('2d'), canvas.clientWidth, canvas.clientHeight);
	        this.loadLevels().then(function (levels) {
	            State.levels = levels.slice(0);
	            _this.loadLevel(0);
	            _this.startRenderer();
	            _this.listenToInput();
	            State.gameState = GameState.Running;
	        });
	    };
	    Game.prototype.loadLevel = function (number) {
	        State.levelIndex = number;
	        State.camera = new Point(0, 0);
	        var level = new Level(State.levels[State.levelIndex]);
	        State.level = level;
	        State.player = new Player(level.playerStart.x, level.playerStart.y);
	    };
	    Game.prototype.listenToInput = function () {
	        var input = new Input();
	        window.onkeydown = input.onKeyDown.bind(input);
	        window.onkeyup = input.onKeyUp.bind(input);
	    };
	    Game.prototype.startRenderer = function () {
	        requestAnimationFrame(this.renderer.render.bind(this.renderer));
	    };
	    return Game;
	}());
	var ns = window;
	module.exports = ns.Game = Game;


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var GameState = __webpack_require__(2);
	var Assets = __webpack_require__(3);
	var State = (function () {
	    function State() {
	    }
	    State.isRunning = function () {
	        return this.gameState === GameState.Running;
	    };
	    State.isGameOver = function () {
	        return this.gameState === GameState.GameOver;
	    };
	    State.isSuccess = function () {
	        return this.gameState === GameState.Success;
	    };
	    State.endGame = function (reason) {
	        if (this.gameState !== GameState.Running) {
	            return;
	        }
	        this.gameOverReason = reason;
	        Assets.getSound(Assets.FAIL).play();
	        this.gameState = GameState.GameOver;
	    };
	    State.projectiles = new Array();
	    return State;
	}());
	module.exports = State;


/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	var GameState;
	(function (GameState) {
	    GameState[GameState["Running"] = 0] = "Running";
	    GameState[GameState["GameOver"] = 1] = "GameOver";
	    GameState[GameState["Success"] = 2] = "Success";
	})(GameState || (GameState = {}));
	module.exports = GameState;


/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";
	var Assets = (function () {
	    function Assets() {
	    }
	    Assets.loadImage = function (id, filename) {
	        var image = new Image();
	        image.onerror = function () {
	            console.log(id + " errored");
	        };
	        image.onload = function () {
	            console.log(id + " loaded");
	        };
	        image.src = filename;
	        Assets.images[id] = image;
	    };
	    Assets.loadSound = function (id, filename) {
	        var audio = new Audio();
	        audio.onerror = function () {
	            console.log(id + " errored");
	        };
	        audio.onload = function () {
	            console.log(id + " loaded");
	        };
	        audio.src = filename;
	        Assets.sounds[id] = audio;
	    };
	    Assets.preload = function () {
	        Assets.loadImage(Assets.PLAYER, "img/player.png");
	        Assets.loadImage(Assets.ENEMY, "img/enemy.png");
	        Assets.loadImage(Assets.PICKUP, "img/pickup.png");
	        Assets.loadImage(Assets.ALERT, "img/alert.png");
	        Assets.loadImage(Assets.GAME_OVER, "img/gameover.png");
	        Assets.loadImage(Assets.MESSAGES, "img/messages.png");
	        Assets.loadImage(Assets.SUCCESS, "img/success.png");
	        Assets.loadSound(Assets.PUNCH, "sfx/punch.mp3");
	        Assets.loadSound(Assets.STUNNED, "sfx/stunned.mp3");
	        Assets.loadSound(Assets.PICKUP, "sfx/pickup.mp3");
	        Assets.loadSound(Assets.THROW, "sfx/throw.mp3");
	        Assets.loadSound(Assets.ALERT, "sfx/alert.mp3");
	        Assets.loadSound(Assets.FAIL, "sfx/fail.mp3");
	        Assets.loadSound(Assets.SUCCESS, "sfx/success.mp3");
	    };
	    Assets.getImage = function (id) {
	        return Assets.images[id];
	    };
	    Assets.getSound = function (id) {
	        return Assets.sounds[id];
	    };
	    Assets.images = {};
	    Assets.sounds = {};
	    Assets.STUNNED = "stunned";
	    Assets.PUNCH = "punch";
	    Assets.ENEMY = "enemy";
	    Assets.PLAYER = "player";
	    Assets.LEVEL = "level";
	    Assets.PICKUP = "pickup";
	    Assets.THROW = "throw";
	    Assets.ALERT = "alert";
	    Assets.FAIL = "fail";
	    Assets.GAME_OVER = "gameover";
	    Assets.MESSAGES = "messages";
	    Assets.SUCCESS = "success";
	    return Assets;
	}());
	module.exports = Assets;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Point = __webpack_require__(5);
	var Enemy = __webpack_require__(6);
	var Rectangle = __webpack_require__(8);
	var Globals = __webpack_require__(15);
	var State = __webpack_require__(1);
	var Level = (function () {
	    function Level(leveMetadata) {
	        this.loadLevelFromMetadata(leveMetadata);
	    }
	    Level.prototype.loadLevelFromMetadata = function (leveMetadata) {
	        var tileSize = Globals.TILE_SIZE;
	        this.playerStart = new Point(leveMetadata.playerStart[0] * tileSize, leveMetadata.playerStart[1] * tileSize);
	        this.playableArea = new Rectangle(leveMetadata.area[0], leveMetadata.area[1], leveMetadata.area[2], leveMetadata.area[3]);
	        this.spawnBoundaries(leveMetadata.boundaries);
	        this.spawnEnemies(leveMetadata.enemies);
	        State.pickupsRemaining = leveMetadata.enemies.length;
	        this.pickups = new Array();
	    };
	    Level.prototype.spawnBoundaries = function (boundaries) {
	        var tileSize = Globals.TILE_SIZE;
	        this.boundaries = new Array();
	        for (var _i = 0, boundaries_1 = boundaries; _i < boundaries_1.length; _i++) {
	            var boundary = boundaries_1[_i];
	            this.boundaries.push(new Rectangle(boundary[0] * tileSize, boundary[1] * tileSize, boundary[2] * tileSize, boundary[3] * tileSize));
	        }
	    };
	    Level.prototype.spawnEnemies = function (enemies) {
	        var tileSize = Globals.TILE_SIZE;
	        this.enemies = new Array();
	        for (var _i = 0, enemies_1 = enemies; _i < enemies_1.length; _i++) {
	            var enemyMeta = enemies_1[_i];
	            var enemyInstance = new Enemy(enemyMeta.type, enemyMeta.facing, enemyMeta.x * tileSize, enemyMeta.y * tileSize, enemyMeta.speed, enemyMeta.script);
	            enemyInstance.stunDuration = enemyMeta.stunDuration || 3000;
	            enemyInstance.scriptInterval = enemyMeta.scriptInterval || 3000;
	            enemyInstance.viewDistance = enemyMeta.viewDistance || 10;
	            this.enemies.push(enemyInstance);
	        }
	    };
	    return Level;
	}());
	module.exports = Level;


/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";
	var Point = (function () {
	    function Point(x, y) {
	        this.x = x;
	        this.y = y;
	    }
	    return Point;
	}());
	module.exports = Point;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Character = __webpack_require__(7);
	var EnemyType = __webpack_require__(9);
	var Direction = __webpack_require__(10);
	var EnemyState = __webpack_require__(11);
	var EnemyScript = __webpack_require__(12);
	var Assets = __webpack_require__(3);
	var State = __webpack_require__(1);
	var PickupItem = __webpack_require__(13);
	var ItemType = __webpack_require__(14);
	var Globals = __webpack_require__(15);
	var Rectangle = __webpack_require__(8);
	var GameOverReason = __webpack_require__(16);
	var Enemy = (function (_super) {
	    __extends(Enemy, _super);
	    function Enemy(type, facing, x, y, speed, script) {
	        _super.call(this, facing, x, y, 18, 19);
	        this.type = type;
	        this.script = script;
	        this.scriptTicker = 0;
	        this.playerDetectionMeter = 0;
	        this.hasPickup = true;
	        this.state = EnemyState.idle;
	        switch (type) {
	            case EnemyType.pizzaDeliveryMan: {
	                this.width = 18;
	                this.height = 19;
	            }
	        }
	        this.speed = speed;
	    }
	    Enemy.prototype.isStunned = function () {
	        return this.state === EnemyState.stunned;
	    };
	    Enemy.prototype.stun = function () {
	        this.playerDetectionMeter = 0;
	        this.state = EnemyState.stunned;
	        Assets.getSound(Assets.STUNNED).play();
	        var x = this.x - (Math.random() * 10) + (Math.random() * 10);
	        var y = this.y - (Math.random() * 10) + (Math.random() * 10);
	        if (this.hasPickup) {
	            this.hasPickup = false;
	            State.level.pickups.push(new PickupItem(ItemType.pickup, x, y));
	        }
	        setTimeout(this.awake.bind(this), this.stunDuration);
	    };
	    Enemy.prototype.awake = function () {
	        this.state = EnemyState.idle;
	        var diffX = State.player.x - this.x;
	        var diffY = State.player.y - this.y;
	        this.playerDetectionMeter = 25;
	        if (Math.abs(diffX) > Math.abs(diffY)) {
	            if (diffX >= 1) {
	                this.facing = Direction.east;
	            }
	            else if (diffX <= -1) {
	                this.facing = Direction.west;
	            }
	        }
	        else {
	            if (diffY >= 1) {
	                this.facing = Direction.south;
	            }
	            else if (diffY <= -1) {
	                this.facing = Direction.north;
	            }
	        }
	    };
	    Enemy.prototype.doScript = function () {
	        switch (this.script) {
	            case EnemyScript.guard: {
	                this.facing += 1;
	                if (this.facing > 3) {
	                    this.facing = 0;
	                }
	                break;
	            }
	            case EnemyScript.wander: {
	                break;
	            }
	            case EnemyScript.followWaypoints: {
	                break;
	            }
	            case EnemyScript.findAndAttackPlayer: {
	                break;
	            }
	        }
	    };
	    Enemy.prototype.setFrames = function () {
	        switch (this.facing) {
	            case Direction.north: {
	                this.frameX = 18;
	                break;
	            }
	            case Direction.east: {
	                this.frameX = 35;
	                break;
	            }
	            case Direction.south: {
	                this.frameX = 0;
	                break;
	            }
	            case Direction.west: {
	                this.frameX = 53;
	                break;
	            }
	        }
	        switch (this.state) {
	            case EnemyState.idle: {
	                this.frameY = 18;
	                break;
	            }
	            case EnemyState.stunned: {
	                this.frameX = 72;
	                this.frameY = 0;
	                break;
	            }
	        }
	    };
	    Enemy.prototype.detectPlayer = function () {
	        var eX = this.x / Globals.TILE_SIZE;
	        var eY = this.y / Globals.TILE_SIZE;
	        var boundaries = State.level.boundaries;
	        var minX = 0;
	        var maxX = 0;
	        var maxY = 0;
	        var minY = 0;
	        var dY = 0;
	        var dx = 0;
	        var pad = 0;
	        switch (this.facing) {
	            case Direction.north: {
	                minX = eX - this.viewDistance;
	                maxX = eX + this.viewDistance;
	                maxY = eY;
	                minY = State.level.playableArea.top / Globals.TILE_SIZE;
	                dY = -1;
	                dx = 1;
	                for (var gY = maxY; gY > minY; gY += dY) {
	                    var top_1 = gY * Globals.TILE_SIZE;
	                    var r = new Rectangle(this.x - pad, top_1, this.x + this.width + (pad * 2), top_1 + Globals.TILE_SIZE);
	                    var intersects = false;
	                    for (var _i = 0, boundaries_1 = boundaries; _i < boundaries_1.length; _i++) {
	                        var b = boundaries_1[_i];
	                        if (b.intersects(r)) {
	                            intersects = true;
	                            break;
	                        }
	                    }
	                    if (intersects) {
	                        break;
	                    }
	                    if (State.player.rect().intersects(r)) {
	                        return true;
	                    }
	                }
	                break;
	            }
	            case Direction.east: {
	                minX = eX;
	                maxX = State.level.playableArea.right / Globals.TILE_SIZE;
	                dY = 1;
	                dx = 1;
	                for (var gX = minX; gX < maxX; gX += dx) {
	                    var intersects = false;
	                    var left = gX * Globals.TILE_SIZE;
	                    var r = new Rectangle(left, this.y - pad, left + Globals.TILE_SIZE, this.y + this.height + (pad * 2));
	                    for (var _a = 0, boundaries_2 = boundaries; _a < boundaries_2.length; _a++) {
	                        var b = boundaries_2[_a];
	                        if (b.intersects(r)) {
	                            intersects = true;
	                            break;
	                        }
	                    }
	                    if (intersects) {
	                        break;
	                    }
	                    if (State.player.rect().intersects(r)) {
	                        return true;
	                    }
	                }
	                break;
	            }
	            case Direction.south: {
	                minX = eX - this.viewDistance;
	                maxX = eX + this.viewDistance;
	                minY = eY;
	                maxY = State.level.playableArea.bottom / Globals.TILE_SIZE;
	                dY = 1;
	                dx = 1;
	                for (var gY = minY; gY < maxY; gY += dY) {
	                    var top_2 = gY * Globals.TILE_SIZE;
	                    var r = new Rectangle(this.x - pad, top_2, this.x + this.width + (pad * 2), top_2 + Globals.TILE_SIZE);
	                    var intersects = false;
	                    for (var _b = 0, boundaries_3 = boundaries; _b < boundaries_3.length; _b++) {
	                        var b = boundaries_3[_b];
	                        if (b.intersects(r)) {
	                            intersects = true;
	                            break;
	                        }
	                    }
	                    if (intersects) {
	                        break;
	                    }
	                    if (State.player.rect().intersects(r)) {
	                        return true;
	                    }
	                }
	                break;
	            }
	            case Direction.west: {
	                minX = State.level.playableArea.left / Globals.TILE_SIZE;
	                maxX = eX;
	                minY = eY - this.viewDistance;
	                maxY = eY + this.viewDistance;
	                dY = 1;
	                dx = -1;
	                for (var gX = maxX; gX > minX; gX += dx) {
	                    var left = gX * Globals.TILE_SIZE;
	                    var r = new Rectangle(left, this.y - pad, left + Globals.TILE_SIZE, this.y + this.height + (pad * 2));
	                    var intersects = false;
	                    for (var _c = 0, boundaries_4 = boundaries; _c < boundaries_4.length; _c++) {
	                        var b = boundaries_4[_c];
	                        if (b.intersects(r)) {
	                            intersects = true;
	                            break;
	                        }
	                    }
	                    if (intersects) {
	                        break;
	                    }
	                    if (State.player.rect().intersects(r)) {
	                        return true;
	                    }
	                }
	                break;
	            }
	            default: {
	                return false;
	            }
	        }
	        return false;
	    };
	    Enemy.prototype.tick = function (dt) {
	        this.scriptTicker += 1 * dt;
	        if (this.scriptTicker > this.scriptInterval) {
	            this.scriptTicker = 0;
	            this.doScript();
	        }
	        if (this.state !== EnemyState.stunned && this.detectPlayer()) {
	            if (this.playerDetectionMeter === 0) {
	                Assets.getSound(Assets.ALERT).play();
	            }
	            this.playerDetectionMeter = Math.min(100, this.playerDetectionMeter + 3 * dt);
	            if (this.playerDetectionMeter >= 100) {
	                State.endGame(GameOverReason.SeenByEnemy);
	            }
	        }
	        else {
	            if (this.playerDetectionMeter > 0) {
	                this.playerDetectionMeter = Math.max(0, this.playerDetectionMeter - .5 * dt);
	            }
	        }
	        this.setFrames();
	    };
	    return Enemy;
	}(Character));
	module.exports = Enemy;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Rectangle = __webpack_require__(8);
	var Character = (function () {
	    function Character(facing, x, y, width, height) {
	        this.facing = facing;
	        this.x = x;
	        this.y = y;
	        this.width = width;
	        this.height = height;
	        this.speed = 0;
	        this.spriteWidth = width;
	        this.spriteHeight = height;
	        this.frame = 0;
	        this.frameX = 0;
	        this.frameY = 0;
	    }
	    Character.prototype.rect = function () {
	        return new Rectangle(this.x, this.y, this.x + this.width, this.y + this.height);
	    };
	    return Character;
	}());
	module.exports = Character;


/***/ },
/* 8 */
/***/ function(module, exports) {

	"use strict";
	var Rectangle = (function () {
	    function Rectangle(left, top, right, bottom) {
	        this.left = left;
	        this.top = top;
	        this.right = right;
	        this.bottom = bottom;
	    }
	    Rectangle.prototype.width = function () {
	        return (this.right || 0) - (this.left || 0);
	    };
	    Rectangle.prototype.height = function () {
	        return (this.bottom || 0) - (this.top || 0);
	    };
	    Rectangle.prototype.intersects = function (r) {
	        return !(r.left > this.right ||
	            r.right < this.left ||
	            r.top > this.bottom ||
	            r.bottom < this.top);
	    };
	    Rectangle.empty = function () {
	        return new Rectangle(0, 0, 0, 0);
	    };
	    return Rectangle;
	}());
	module.exports = Rectangle;


/***/ },
/* 9 */
/***/ function(module, exports) {

	"use strict";
	var EnemyType;
	(function (EnemyType) {
	    EnemyType[EnemyType["pizzaDeliveryMan"] = 0] = "pizzaDeliveryMan";
	})(EnemyType || (EnemyType = {}));
	module.exports = EnemyType;


/***/ },
/* 10 */
/***/ function(module, exports) {

	"use strict";
	var Direction;
	(function (Direction) {
	    Direction[Direction["north"] = 0] = "north";
	    Direction[Direction["east"] = 1] = "east";
	    Direction[Direction["south"] = 2] = "south";
	    Direction[Direction["west"] = 3] = "west";
	})(Direction || (Direction = {}));
	module.exports = Direction;


/***/ },
/* 11 */
/***/ function(module, exports) {

	"use strict";
	var EnemyState;
	(function (EnemyState) {
	    EnemyState[EnemyState["dead"] = 0] = "dead";
	    EnemyState[EnemyState["idle"] = 1] = "idle";
	    EnemyState[EnemyState["walkingNorth"] = 2] = "walkingNorth";
	    EnemyState[EnemyState["walkingSouth"] = 3] = "walkingSouth";
	    EnemyState[EnemyState["walkingEast"] = 4] = "walkingEast";
	    EnemyState[EnemyState["walkingWest"] = 5] = "walkingWest";
	    EnemyState[EnemyState["stunned"] = 6] = "stunned";
	})(EnemyState || (EnemyState = {}));
	module.exports = EnemyState;


/***/ },
/* 12 */
/***/ function(module, exports) {

	"use strict";
	var enemyScript;
	(function (enemyScript) {
	    enemyScript[enemyScript["guard"] = 0] = "guard";
	    enemyScript[enemyScript["wander"] = 1] = "wander";
	    enemyScript[enemyScript["followWaypoints"] = 2] = "followWaypoints";
	    enemyScript[enemyScript["findAndAttackPlayer"] = 3] = "findAndAttackPlayer";
	})(enemyScript || (enemyScript = {}));
	module.exports = enemyScript;


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var ItemType = __webpack_require__(14);
	var Rectangle = __webpack_require__(8);
	var PickupItem = (function () {
	    function PickupItem(type, x, y) {
	        this.type = type;
	        this.x = x;
	        this.y = y;
	        switch (type) {
	            case ItemType.pickup: {
	                this.width = 20;
	                this.height = 20;
	                break;
	            }
	        }
	        this.rect = new Rectangle(this.x, this.y, this.x + this.width, this.y + this.height);
	    }
	    return PickupItem;
	}());
	module.exports = PickupItem;


/***/ },
/* 14 */
/***/ function(module, exports) {

	"use strict";
	var itemType;
	(function (itemType) {
	    itemType[itemType["pickup"] = 0] = "pickup";
	})(itemType || (itemType = {}));
	module.exports = itemType;


/***/ },
/* 15 */
/***/ function(module, exports) {

	"use strict";
	var Globals = (function () {
	    function Globals() {
	    }
	    Globals.TILE_SIZE = 20;
	    Globals.CANVAS_WIDTH = 640;
	    Globals.CANVAS_HEIGHT = 480;
	    Globals.CANVAS_WIDTH_HALF = Globals.CANVAS_WIDTH / 2;
	    Globals.CANVAS_HEIGHT_HALF = Globals.CANVAS_HEIGHT / 2;
	    return Globals;
	}());
	module.exports = Globals;


/***/ },
/* 16 */
/***/ function(module, exports) {

	"use strict";
	var GameOverReason;
	(function (GameOverReason) {
	    GameOverReason[GameOverReason["SeenByEnemy"] = 0] = "SeenByEnemy";
	    GameOverReason[GameOverReason["LowHealth"] = 1] = "LowHealth";
	})(GameOverReason || (GameOverReason = {}));
	module.exports = GameOverReason;


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Character = __webpack_require__(7);
	var PlayerState = __webpack_require__(18);
	var State = __webpack_require__(1);
	var Rectangle = __webpack_require__(8);
	var Direction = __webpack_require__(10);
	var Assets = __webpack_require__(3);
	var Projectile = __webpack_require__(19);
	var GameOverReason = __webpack_require__(16);
	var Level = __webpack_require__(4);
	var GameState = __webpack_require__(2);
	var Player = (function (_super) {
	    __extends(Player, _super);
	    function Player(x, y) {
	        _super.call(this, Direction.south, x, y, 18, 19);
	        this.reset();
	    }
	    Player.prototype.reset = function () {
	        this.hunger = 40;
	        this.health = 100;
	        this.speed = 4;
	        this.ammo = 0;
	        this.width = 18;
	        this.height = 19;
	    };
	    Player.prototype.intersects = function (nextX, nextY) {
	        var playerRect = new Rectangle(nextX, nextY, nextX + this.width, nextY + this.height);
	        for (var _i = 0, _a = State.level.boundaries; _i < _a.length; _i++) {
	            var boundary = _a[_i];
	            if (boundary.intersects(playerRect)) {
	                return true;
	            }
	        }
	        return false;
	    };
	    Player.prototype.shrink = function () {
	        this.x += 2;
	        this.y += 2;
	        this.width -= 4;
	        this.height -= 4;
	        this.speed += .25;
	    };
	    Player.prototype.expand = function () {
	        this.x -= 2;
	        this.y -= 2;
	        this.width += 4;
	        this.height += 4;
	        this.speed -= .25;
	    };
	    Player.prototype.consumePickup = function () {
	        this.expand();
	        this.ammo += 1;
	        this.hunger = Math.max(0, this.hunger - 15);
	        Assets.getSound(Assets.PICKUP).play();
	        State.pickupsRemaining -= 1;
	        if (State.pickupsRemaining === 0) {
	            this.nextLevel();
	        }
	    };
	    Player.prototype.nextLevel = function () {
	        var s = State;
	        setTimeout(function () {
	            if (!s.isRunning()) {
	                return;
	            }
	            Assets.getSound(Assets.SUCCESS).play();
	            s.gameState = GameState.Success;
	            setTimeout(function () {
	                if (s.levelIndex < State.levels.length - 1) {
	                    s.levelIndex += 1;
	                    var level = new Level(State.levels[State.levelIndex]);
	                    s.level = level;
	                    s.player = new Player(level.playerStart.x, level.playerStart.y);
	                    s.gameState = GameState.Running;
	                }
	            }, 1500);
	        }, 1000);
	    };
	    Player.prototype.testPickups = function () {
	        var pickups = State.level.pickups;
	        var playerRect = this.rect();
	        for (var i = 0; i < pickups.length; i++) {
	            if (pickups[i].rect.intersects(playerRect)) {
	                pickups.splice(i, 1);
	                this.consumePickup();
	                return;
	            }
	        }
	    };
	    Player.prototype.animateFrames = function (dt) {
	        this.frame += 1 * dt;
	        if (this.frame > 5) {
	            this.frame = 0;
	            if (this.frameY === 0) {
	                this.frameY = 36;
	            }
	            else {
	                this.frameY = 0;
	            }
	        }
	    };
	    Player.prototype.walkEast = function (walkSpeed, boundary) {
	        this.facing = Direction.east;
	        var nextX = this.x + walkSpeed;
	        if (nextX + this.width > boundary) {
	            return;
	        }
	        if (this.intersects(nextX, this.y)) {
	            return;
	        }
	        this.x = nextX;
	        this.testPickups();
	    };
	    Player.prototype.walkWest = function (walkSpeed, boundary) {
	        this.facing = Direction.west;
	        var nextX = this.x - walkSpeed;
	        if (nextX < boundary) {
	            return;
	        }
	        if (this.intersects(nextX, this.y)) {
	            return;
	        }
	        this.x = nextX;
	        this.testPickups();
	    };
	    Player.prototype.walkNorth = function (walkSpeed, boundary) {
	        this.facing = Direction.north;
	        var nextY = this.y - walkSpeed;
	        if (nextY < boundary) {
	            return;
	        }
	        if (this.intersects(this.x, nextY)) {
	            return;
	        }
	        this.y = nextY;
	        this.testPickups();
	    };
	    Player.prototype.walkSouth = function (walkSpeed, boundary) {
	        this.facing = Direction.south;
	        var nextY = this.y + walkSpeed;
	        if (nextY + this.height > boundary) {
	            return;
	        }
	        if (this.intersects(this.x, nextY)) {
	            return;
	        }
	        this.y = nextY;
	        this.testPickups();
	    };
	    Player.prototype.punch = function () {
	        this.state = PlayerState.idle;
	        Assets.getSound(Assets.PUNCH).play();
	        var punchDist = 8;
	        var punchArea = (this.facing == Direction.north) ? new Rectangle(this.x, this.y - punchDist, this.x + this.width, this.y) :
	            (this.facing == Direction.east) ? new Rectangle(this.x + this.width, this.y, this.x + this.width + punchDist, this.y + this.height) :
	                (this.facing == Direction.south) ? new Rectangle(this.x, this.y + this.height, this.x + this.width, this.y + this.height + punchDist) :
	                    (this.facing == Direction.west) ? new Rectangle(this.x - punchDist, this.y, this.x, this.y + this.height) : Rectangle.empty();
	        var enemies = State.level.enemies;
	        for (var _i = 0, enemies_1 = enemies; _i < enemies_1.length; _i++) {
	            var enemy = enemies_1[_i];
	            if (enemy.isStunned()) {
	                continue;
	            }
	            if (enemy.rect().intersects(punchArea)) {
	                enemy.stun();
	                return;
	            }
	        }
	    };
	    Player.prototype.throw = function () {
	        this.state = PlayerState.idle;
	        if (this.ammo === 0) {
	            return;
	        }
	        this.shrink();
	        this.ammo -= 1;
	        var speedX = 0, speedY = 0;
	        switch (this.facing) {
	            case Direction.north: {
	                speedY = -4;
	                break;
	            }
	            case Direction.east: {
	                speedX = 4;
	                break;
	            }
	            case Direction.south: {
	                speedY = 4;
	                break;
	            }
	            case Direction.west: {
	                speedX = -4;
	                break;
	            }
	        }
	        State.projectiles.push(new Projectile(true, this.x + (this.width / 2) + speedX, this.y + (this.height / 2) + speedY, 6, 6, speedX, speedY, 25));
	        Assets.getSound(Assets.THROW).play();
	    };
	    Player.prototype.tick = function (dt) {
	        this.hunger = Math.min(100, this.hunger + .16 * dt);
	        if (this.hunger >= 100) {
	            this.health = Math.max(0, this.health - .33 * dt);
	        }
	        if (this.health <= 0) {
	            State.endGame(GameOverReason.LowHealth);
	            return;
	        }
	        var playableArea = State.level.playableArea;
	        switch (this.state) {
	            case PlayerState.walkingEast: {
	                this.frameX = 35;
	                this.animateFrames(dt);
	                this.walkEast(this.speed * dt, playableArea.right);
	                break;
	            }
	            case PlayerState.walkingWest: {
	                this.frameX = 53;
	                this.animateFrames(dt);
	                this.walkWest(this.speed * dt, playableArea.left);
	                break;
	            }
	            case PlayerState.walkingNorth: {
	                this.frameX = 18;
	                this.animateFrames(dt);
	                this.walkNorth(this.speed * dt, playableArea.top);
	                break;
	            }
	            case PlayerState.walkingSouth: {
	                this.frameX = 0;
	                this.animateFrames(dt);
	                this.walkSouth(this.speed * dt, playableArea.bottom);
	                break;
	            }
	            case PlayerState.Throwing: {
	                this.throw();
	                break;
	            }
	            case PlayerState.Punching: {
	                this.punch();
	                break;
	            }
	            case PlayerState.idle:
	            default:
	                {
	                    this.frame = 0;
	                    this.frameY = 18;
	                }
	        }
	    };
	    return Player;
	}(Character));
	module.exports = Player;


/***/ },
/* 18 */
/***/ function(module, exports) {

	"use strict";
	var PlayerState;
	(function (PlayerState) {
	    PlayerState[PlayerState["dead"] = 0] = "dead";
	    PlayerState[PlayerState["idle"] = 1] = "idle";
	    PlayerState[PlayerState["walkingNorth"] = 2] = "walkingNorth";
	    PlayerState[PlayerState["walkingSouth"] = 3] = "walkingSouth";
	    PlayerState[PlayerState["walkingEast"] = 4] = "walkingEast";
	    PlayerState[PlayerState["walkingWest"] = 5] = "walkingWest";
	    PlayerState[PlayerState["Punching"] = 6] = "Punching";
	    PlayerState[PlayerState["Throwing"] = 7] = "Throwing";
	})(PlayerState || (PlayerState = {}));
	module.exports = PlayerState;


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Rectangle = __webpack_require__(8);
	var State = __webpack_require__(1);
	var Projectile = (function () {
	    function Projectile(isFromPlayer, x, y, width, height, speedX, speedY, timeToLive) {
	        this.isFromPlayer = isFromPlayer;
	        this.x = x;
	        this.y = y;
	        this.width = width;
	        this.height = height;
	        this.speedX = speedX;
	        this.speedY = speedY;
	        this.timeToLive = timeToLive;
	        this.shouldGc = false;
	    }
	    Projectile.prototype.tick = function (dt) {
	        if (this.shouldGc) {
	            return;
	        }
	        this.timeToLive -= .1 * dt;
	        if (this.timeToLive < 0) {
	            this.shouldGc = true;
	            return;
	        }
	        this.x += this.speedX;
	        this.y += this.speedY;
	        var rect = new Rectangle(this.x, this.y, this.x + this.width, this.y + this.height);
	        var boundaries = State.level.boundaries;
	        for (var _i = 0, boundaries_1 = boundaries; _i < boundaries_1.length; _i++) {
	            var boundary = boundaries_1[_i];
	            if (boundary.intersects(rect)) {
	                this.shouldGc = true;
	                return;
	            }
	        }
	        if (this.isFromPlayer) {
	            var enemies = State.level.enemies;
	            for (var _a = 0, enemies_1 = enemies; _a < enemies_1.length; _a++) {
	                var enemy = enemies_1[_a];
	                if (enemy.rect().intersects(rect)) {
	                    enemy.stun();
	                    this.shouldGc = true;
	                    return;
	                }
	            }
	        }
	        if (!this.isFromPlayer) {
	            var player = State.player;
	            if (player.rect().intersects(rect)) {
	                this.shouldGc = true;
	                return;
	            }
	        }
	    };
	    return Projectile;
	}());
	module.exports = Projectile;


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Assets = __webpack_require__(3);
	var State = __webpack_require__(1);
	var GameLoop = __webpack_require__(21);
	var ItemType = __webpack_require__(14);
	var GameOverReason = __webpack_require__(16);
	var CanvasRenderer = (function () {
	    function CanvasRenderer(context2D, width, height) {
	        this.context2D = context2D;
	        this.width = width;
	        this.height = height;
	        this.fontSize = 16;
	        this.setup();
	    }
	    CanvasRenderer.prototype.beforeRender = function () {
	        var now = new Date().getTime();
	        var dt = now - (this.time || now);
	        this.time = now;
	        GameLoop.tick(dt / 60);
	    };
	    CanvasRenderer.prototype.setup = function () {
	        var ctx = this.context2D;
	        ctx.font = "bold " + this.fontSize + "px Arial";
	        if ('imageSmoothingEnabled' in ctx) {
	            ctx.imageSmoothingEnabled = false;
	        }
	    };
	    CanvasRenderer.prototype.render = function () {
	        requestAnimationFrame(this.render.bind(this));
	        this.beforeRender();
	        var ctx = this.context2D;
	        ctx.fillStyle = "#ddd";
	        ctx.fillRect(0, 0, this.width, this.height);
	        this.renderBoundaries();
	        this.renderItems();
	        this.renderProjectiles();
	        this.renderEnemies();
	        this.renderPlayer();
	        this.renderUI();
	    };
	    CanvasRenderer.prototype.renderPlayer = function () {
	        var ctx = this.context2D;
	        var cam = State.camera;
	        var player = State.player;
	        ctx.drawImage(Assets.getImage(Assets.PLAYER), player.frameX, player.frameY, player.spriteWidth, player.spriteHeight, player.x - cam.x, player.y - cam.y, player.width, player.height);
	    };
	    CanvasRenderer.prototype.renderEnemies = function () {
	        var ctx = this.context2D;
	        var cam = State.camera;
	        var enemies = State.level.enemies;
	        var enemyImg = Assets.getImage(Assets.ENEMY);
	        var alertImg = Assets.getImage(Assets.ALERT);
	        for (var _i = 0, enemies_1 = enemies; _i < enemies_1.length; _i++) {
	            var enemy = enemies_1[_i];
	            var eX = enemy.x - cam.x;
	            var eY = enemy.y - cam.y;
	            ctx.drawImage(enemyImg, enemy.frameX, enemy.frameY, enemy.spriteWidth, enemy.spriteHeight, eX, eY, enemy.width, enemy.height);
	            if (enemy.playerDetectionMeter > 0) {
	                var perc = enemy.playerDetectionMeter / 100;
	                var frame = 1;
	                if (perc < .25) {
	                    frame = 1;
	                }
	                else if (perc < .5) {
	                    frame = 9;
	                }
	                else {
	                    frame = 17;
	                }
	                ctx.drawImage(alertImg, frame, 0, 7, 15, eX + 6, eY - 18, 7, 15);
	            }
	        }
	    };
	    CanvasRenderer.prototype.renderItems = function () {
	        function imageForType(type) {
	            switch (type) {
	                case ItemType.pickup: {
	                    return Assets.getImage(Assets.PICKUP);
	                }
	            }
	        }
	        var ctx = this.context2D;
	        var cam = State.camera;
	        var items = State.level.pickups;
	        for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
	            var item = items_1[_i];
	            ctx.drawImage(imageForType(item.type), item.x - cam.x, item.y - cam.y);
	        }
	    };
	    CanvasRenderer.prototype.renderBoundaries = function () {
	        var ctx = this.context2D;
	        var cam = State.camera;
	        var boundaries = State.level.boundaries;
	        ctx.lineWidth = 2;
	        ctx.strokeStyle = "#333";
	        ctx.fillStyle = "#666";
	        for (var _i = 0, boundaries_1 = boundaries; _i < boundaries_1.length; _i++) {
	            var boundary = boundaries_1[_i];
	            ctx.fillRect(boundary.left - cam.x, boundary.top - cam.y, boundary.width(), boundary.height());
	            ctx.strokeRect(boundary.left - cam.x, boundary.top - cam.y, boundary.width(), boundary.height());
	        }
	    };
	    CanvasRenderer.prototype.renderProjectiles = function () {
	        var ctx = this.context2D;
	        var cam = State.camera;
	        var projectiles = State.projectiles;
	        ctx.lineWidth = 2;
	        ctx.strokeStyle = "#aa0";
	        ctx.fillStyle = "#aa0";
	        var rad = 2 * Math.PI;
	        for (var i = 0; i < projectiles.length; i++) {
	            var proj = projectiles[i];
	            if (proj.shouldGc) {
	                continue;
	            }
	            ctx.beginPath();
	            ctx.arc(proj.x - cam.x, proj.y - cam.y, proj.width, 0, rad);
	            ctx.closePath();
	            ctx.fill();
	            ctx.stroke();
	        }
	    };
	    CanvasRenderer.prototype.renderUI = function () {
	        var ctx = this.context2D;
	        var player = State.player;
	        if (State.isRunning()) {
	            ctx.strokeStyle = "#000";
	            ctx.fillStyle = "#000";
	            ctx.fillText("Hunger " + Math.round(player.hunger), 10, this.fontSize);
	            ctx.fillText("HP " + Math.round(player.health), this.width - 60, this.fontSize);
	            ctx.fillText("" + State.pickupsRemaining, this.width - 40, 10 + (this.fontSize * 2));
	        }
	        else if (State.isGameOver()) {
	            this.drawBlackOverlay();
	            ctx.drawImage(Assets.getImage(Assets.GAME_OVER), 320 - 160, 240 - 72);
	            var mY = 0;
	            if (State.gameOverReason == GameOverReason.LowHealth) {
	                mY = 0;
	            }
	            else if (State.gameOverReason == GameOverReason.SeenByEnemy) {
	                mY = 22;
	            }
	            ctx.drawImage(Assets.getImage(Assets.MESSAGES), 0, mY, 320, 22, 320 - 160, 240 - 72 + 100, 320, 22);
	        }
	        else if (State.isSuccess()) {
	            this.drawBlackOverlay();
	            ctx.drawImage(Assets.getImage(Assets.SUCCESS), 320 - 160, 240 - 50);
	        }
	    };
	    CanvasRenderer.prototype.drawBlackOverlay = function () {
	        var ctx = this.context2D;
	        ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
	        ctx.fillRect(0, 0, 640, 480);
	    };
	    return CanvasRenderer;
	}());
	module.exports = CanvasRenderer;


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var State = __webpack_require__(1);
	var GameState = __webpack_require__(2);
	var Globals = __webpack_require__(15);
	var GameLoop = (function () {
	    function GameLoop() {
	    }
	    GameLoop.tick = function (dt) {
	        if (State.gameState !== GameState.Running) {
	            return;
	        }
	        State.player.tick(dt);
	        this.centerCameraOnPlayer();
	        var enemies = State.level.enemies;
	        for (var _i = 0, enemies_1 = enemies; _i < enemies_1.length; _i++) {
	            var enemy = enemies_1[_i];
	            enemy.tick(dt);
	        }
	        var projectiles = State.projectiles;
	        for (var _a = 0, projectiles_1 = projectiles; _a < projectiles_1.length; _a++) {
	            var projectile = projectiles_1[_a];
	            projectile.tick(dt);
	        }
	    };
	    GameLoop.centerCameraOnPlayer = function () {
	        var player = State.player;
	        var cam = State.camera;
	        cam.x = Math.min(State.level.playableArea.right - Globals.CANVAS_WIDTH, Math.max(0, player.x - Globals.CANVAS_WIDTH_HALF));
	        cam.y = Math.min(State.level.playableArea.bottom - Globals.CANVAS_HEIGHT, Math.max(0, player.y - Globals.CANVAS_HEIGHT_HALF));
	    };
	    return GameLoop;
	}());
	module.exports = GameLoop;


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var State = __webpack_require__(1);
	var PlayerState = __webpack_require__(18);
	var Input = (function () {
	    function Input() {
	    }
	    Input.prototype.onKeyDown = function (ev) {
	        if (!State.isRunning()) {
	            return;
	        }
	        switch (ev.keyCode) {
	            case Input.LEFT: {
	                this.onLeft();
	                break;
	            }
	            case Input.UP: {
	                this.onUp();
	                break;
	            }
	            case Input.RIGHT: {
	                this.onRight();
	                break;
	            }
	            case Input.DOWN: {
	                this.onDown();
	                break;
	            }
	            case Input.X: {
	                this.onAttack();
	                break;
	            }
	            default: {
	            }
	        }
	    };
	    Input.prototype.onKeyUp = function (ev) {
	        State.player.state = PlayerState.idle;
	    };
	    Input.prototype.onAttack = function () {
	        State.player.state = PlayerState.Punching;
	    };
	    Input.prototype.onDown = function () {
	        State.player.state = PlayerState.walkingSouth;
	    };
	    Input.prototype.onUp = function () {
	        State.player.state = PlayerState.walkingNorth;
	    };
	    Input.prototype.onLeft = function () {
	        State.player.state = PlayerState.walkingWest;
	    };
	    Input.prototype.onRight = function () {
	        State.player.state = PlayerState.walkingEast;
	    };
	    Input.LEFT = 37;
	    Input.UP = 38;
	    Input.RIGHT = 39;
	    Input.DOWN = 40;
	    Input.X = 88;
	    return Input;
	}());
	module.exports = Input;


/***/ }
/******/ ]);