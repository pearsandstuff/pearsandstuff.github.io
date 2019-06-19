!function() {
	var rPreview = document.getElementById("r_preview");
	var uPreview = document.getElementById("u_preview");
	var board = document.getElementById("board");
	var ghost = document.getElementById("ghost");
	var locked = document.getElementById("locked");
	var rScoreNum = document.getElementById("r_score_num");
	var uScore = document.getElementById("u_score");
	var rLevelNum = document.getElementById("r_level_num");
	var uLevel = document.getElementById("u_level");
	var rLinesNum = document.getElementById("r_lines_num");
	var uLines = document.getElementById("u_lines");
	var highScores = document.getElementById("high_scores");
	var gridContainer = document.getElementById("grid_container");
	var startScreen = document.getElementById("start");
	var pauseScreen = document.getElementById("pause_screen");
	var statRowLineNumber = document.getElementById("stat_row_line_number");
	var statRowLinePiece = document.getElementById("stat_row_line_piece");
	var tempScore = document.getElementById("temp_score");
	var scoresMsg = document.getElementById("scores_msg");

	window.game = window.game || {
		piece: {
			type: null,
			x: null,
			y: null,
			next: null,
			rotation: null,
			element: null,
			ghost: null,
			shadow: null,
			landed: null,
			lockDelayed: null,
			lastRotated: null,
			rotate: function(direction) {
				if (game.piece.landed) return;
				if (direction == "CLOCKWISE") {
					game.piece.rotation = (game.piece.rotation + 90) % 360
					if (game.piece.type == "I") {
						var translate = {
							0: [-1, 1],
							90: [2, -1],
							180: [-2, 2],
							270: [1, -2]
						}[game.piece.rotation];
						var kicks = {
							0: [0,0,1,0,-2,0,1,-2,-2,1],
							90: [0,0,-2,0,1,0,-2,-1,1,2],
							180: [0,0,-1,0,2,0,-1,2,2,-1],
							270: [0,0,2,0,-1,0,2,1,-1,-2]
						}[game.piece.rotation];
						game.piece.x += translate[0];
						game.piece.y += translate[1];
						for (var i = 0; i < 10; i += 2) {
							if (!collides(game.piece, kicks[i], -kicks[i + 1])) {
								game.piece.x += kicks[i];
								game.piece.y -= kicks[i + 1];
								game.piece.render();
								game.piece.lastRotated = true;

								if (collides(game.piece, 0, 1)) {
									clearInterval(game.gravityInterval);
									game.gravityInterval = setInterval(game.gravitate, Math.max(game.speed, 500));
									game.piece.lockDelayed = true;
								} else {
									if (game.piece.lockDelayed) {
										clearInterval(game.gravityInterval);
										game.gravityInterval = setInterval(game.gravitate, game.speed);
									}
									game.piece.lockDelayed = false;
								}
								return;
							}
						}
					} else if (game.piece.type != "O") {
						var translate = {
							0: [0, 0],
							90: [1, 0],
							180: [-1, 1],
							270: [0, -1]
						}[game.piece.rotation];
						var kicks = {
							0: [0,0,-1,0,-1,1,0,2,1,-2],
							90: [0,0,-1,0,-1,1,0,-2,-1,-2],
							180: [0,0,1,0,1,-1,0,2,1,2],
							270: [0,0,1,0,1,1,0,-2,1,-2]
						}[game.piece.rotation];
						game.piece.x += translate[0];
						game.piece.y += translate[1];
						for (var i = 0; i < 10; i += 2) {
							if (!collides(game.piece, kicks[i], -kicks[i + 1])) {
								game.piece.x += kicks[i];
								game.piece.y -= kicks[i + 1];
								game.piece.render();
								game.piece.lastRotated = i == 8 ? "triple" : true;

								if (collides(game.piece, 0, 1)) {
									clearInterval(game.gravityInterval);
									game.gravityInterval = setInterval(game.gravitate, Math.max(game.speed, 500));
									game.piece.lockDelayed = true;
								} else {
									if (game.piece.lockDelayed) {
										clearInterval(game.gravityInterval);
										game.gravityInterval = setInterval(game.gravitate, game.speed);
									}
									game.piece.lockDelayed = false;
								}
								return;
							}
						}
					} else {
						var translate = [0,0];
					}
					game.piece.rotation = (game.piece.rotation + 270) % 360;
					game.piece.x -= translate[0];
					game.piece.y -= translate[1];
				} else {
					game.piece.rotation = (game.piece.rotation + 270) % 360
					if (game.piece.type == "I") {
						var translate = {
							0: [-2, 1],
							90: [2, -2],
							180: [-1, 2],
							270: [1, -1]
						}[game.piece.rotation];
						var kicks = {
							0: [0,0,2,0,-1,0,2,1,-1,-2],
							90: [0,0,1,0,-2,0,1,-2,-2,1],
							180: [0,0,-2,0,1,0,-2,-1,1,2],
							270: [0,0,-1,0,2,0,-1,2,2,-1]
						}[game.piece.rotation];
						game.piece.x += translate[0];
						game.piece.y += translate[1];
						for (var i = 0; i < 10; i += 2) {
							if (!collides(game.piece, kicks[i], -kicks[i + 1])) {
								game.piece.x += kicks[i];
								game.piece.y -= kicks[i + 1];
								game.piece.render();
								game.piece.lastRotated = true;

								if (collides(game.piece, 0, 1)) {
									clearInterval(game.gravityInterval);
									game.gravityInterval = setInterval(game.gravitate, Math.max(game.speed, 500));
									game.piece.lockDelayed = true;
								} else {
									if (game.piece.lockDelayed) {
										clearInterval(game.gravityInterval);
										game.gravityInterval = setInterval(game.gravitate, game.speed);
									}
									game.piece.lockDelayed = false;
								}
								return;
							}
						}
					} else if (game.piece.type != "O") {
						var translate = {
							0: [-1, 0],
							90: [1, -1],
							180: [0, 1],
							270: [0, 0]
						}[game.piece.rotation];
						var kicks = {
							0: [0,0,1,0,1,-1,0,2,1,2],
							90: [0,0,-1,0,-1,1,0,-2,-1,-2],
							180: [0,0,-1,0,-1,-1,0,2,-1,2],
							270: [0,0,1,0,1,1,0,-2,1,-2]
						}[game.piece.rotation];
						game.piece.x += translate[0];
						game.piece.y += translate[1];
						for (var i = 0; i < 10; i += 2) {
							if (!collides(game.piece, kicks[i], -kicks[i + 1])) {
								game.piece.x += kicks[i];
								game.piece.y -= kicks[i + 1];
								game.piece.render();
								game.piece.lastRotated = i == 8 ? "triple" : true;

								if (collides(game.piece, 0, 1)) {
									clearInterval(game.gravityInterval);
									game.gravityInterval = setInterval(game.gravitate, Math.max(game.speed, 500));
									game.piece.lockDelayed = true;
								} else {
									if (game.piece.lockDelayed) {
										clearInterval(game.gravityInterval);
										game.gravityInterval = setInterval(game.gravitate, game.speed);
									}
									game.piece.lockDelayed = false;
								}
								return;
							}
						}
					} else {
						var translate = [0,0];
					}
					game.piece.rotation = (game.piece.rotation + 90) % 360;
					game.piece.x -= translate[0];
					game.piece.y -= translate[1];
				}
			},
			move: function(direction) {
				if (game.piece.landed) return false;
				if (direction == "DOWN") {
					if (!collides(game.piece, 0, 1)) {
						clearInterval(game.gravityInterval);
						game.gravityInterval = setInterval(game.gravitate, game.speed);
						game.piece.lastRotated = false;
						game.gravitate();
						game.stats.score++;
						uScore.innerText = "Score: " + game.stats.score.toString().replace(/(\d)(?=(...)+$)/g, "$1 ");
						rScoreNum.innerText = game.stats.score.toString().replace(/(\d)(?=(...)+$)/g, "$1 ");
						return true;
					} else return false;
				} else if (direction == "LEFT") {
					if (!collides(game.piece, -1, 0)) {
						game.piece.x--;
						game.piece.render();
						game.piece.lastRotated = false;

						if (collides(game.piece, 0, 1)) {
							clearInterval(game.gravityInterval);
							game.gravityInterval = setInterval(game.gravitate, Math.max(game.speed, 500));
							game.piece.lockDelayed = true;
						} else {
							if (game.piece.lockDelayed) {
								clearInterval(game.gravityInterval);
								game.gravityInterval = setInterval(game.gravitate, game.speed);
							}
							game.piece.lockDelayed = false;
						}
						return true;
					} else return false;
				} else if (direction == "RIGHT") {
					if (!collides(game.piece, 1, 0)) {
						game.piece.x++;
						game.piece.render();
						game.piece.lastRotated = false;

						if (collides(game.piece, 0, 1)) {
							clearInterval(game.gravityInterval);
							game.gravityInterval = setInterval(game.gravitate, Math.max(game.speed, 500));
							game.piece.lockDelayed = true;
						} else {
							if (game.piece.lockDelayed) {
								clearInterval(game.gravityInterval);
								game.gravityInterval = setInterval(game.gravitate, game.speed);
							}
							game.piece.lockDelayed = false;
						}
						return true;
					} else return false;
				}
			},
			render: function(unchangedGhost) {
				var dims = dimensions(game.piece);
				this.element.className = this.ghost.className = "game_piece gp_type_" + this.type + " gp_rot_" + this.rotation;
				this.ghost.className += " flashing";
				board.appendChild(this.element);
				this.element.style.gridTemplateColumns = this.ghost.style.gridTemplateColumns = "repeat(" + dims.width + ", 1fr)";
				this.element.style.gridTemplateRows = this.ghost.style.gridTemplateRows = "repeat(" + dims.height + ", 1fr)";
				this.element.style.gridArea = dims.area;
				if (!unchangedGhost) {
					ghost.appendChild(this.ghost);
					for (var i = 0; i < 18; i++) {
						if (collides(game.piece, 0, i + 1)) {
							this.ghost.style.gridArea = [dims.y1 + i + 1, dims.x1 + 1, dims.y2 + i + 1, dims.x2 + 1].join(" / ");
							break;
						}
					}
				}
			},
			drop: function() {
				if (game.piece.landed) return;
				for (i = 0; i < 18; i++) {
					if (collides(game.piece, 0, 1)) {
						if (i == 0) return;
						game.piece.render();
						game.piece.lastRotated = false;
						game.gravitate();
						game.stats.score += i * 2;
						uScore.innerText = "Score: " + game.stats.score.toString().replace(/(\d)(?=(...)+$)/g, "$1 ");
						rScoreNum.innerText = game.stats.score.toString().replace(/(\d)(?=(...)+$)/g, "$1 ");
						game.refTime = performance.now();
						return;
					} else {
						game.piece.y++;
					}
				}
			}
		},
		gravitate: function() {
			game.elapsedGravityTime = null;
			game.midGravityTimeout = null;
			if (collides(game.piece, 0, 1)) {
				var coords = gridCoords(game.piece);
				for (var i = coords.length - 1; i >= 0; i--) {
					game.grid[coords[i][1]][coords[i][0]] = true;
				}

				var clearedLines = [];
				for (var row = 0, l = 18; row < l; row++) {
					if (game.grid[row].every(function(block) {
						return block;
					})) {
						clearedLines.push(row);
					}
				}

				if (game.piece.type == "T" && game.piece.lastRotated) {
					var surrounded = false;
					var center = coords[game.piece.rotation == 0 || game.piece.rotation == 270 ? 1 : 2];
					var front, back;
					if (game.piece.rotation == 0) {
						back = center[1] == 17 ? 2 : game.grid[center[1] + 1][center[0] - 1] + game.grid[center[1] + 1][center[0] + 1]
						front = game.grid[center[1] - 1][center[0] - 1] + game.grid[center[1] - 1][center[0] + 1];
					} else if (game.piece.rotation == 90) {
						back = center[0] == 0 ? 2 : game.grid[center[1] - 1][center[0] - 1] + game.grid[center[1] + 1][center[0] - 1]
						front = game.grid[center[1] - 1][center[0] + 1] + game.grid[center[1] + 1][center[0] + 1];
					} else if (game.piece.rotation == 180) {
						back = center[1] == 0 ? 2 : game.grid[center[1] - 1][center[0] - 1] + game.grid[center[1] - 1][center[0] + 1]
						front = game.grid[center[1] + 1][center[0] - 1] + game.grid[center[1] + 1][center[0] + 1];
					} else {
						back = center[0] == 9 ? 2 : game.grid[center[1] - 1][center[0] + 1] + game.grid[center[1] + 1][center[0] + 1]
						front = game.grid[center[1] - 1][center[0] - 1] + game.grid[center[1] + 1][center[0] - 1];
					}

					if (front + back >= 3) {
						if (front == 2 || game.piece.lastRotated == "triple") {
							if ((game.lastType + "").substring(0, 7) == "T-Spin,") {
								var last = parseInt(game.lastType.substring(7));
								game.stats.score += (clearedLines.length == 0 ? 600 : clearedLines.length == 1 ? last >= 1 ? 1100 : 700 : clearedLines.length == 2 ? last >= 2 ? 1500 : 900 : clearedLines.length == 3 ? last >= 3 ? 1900 : 1100 : 0) * game.stats.level;
								message.clearType = "BACK-TO-BACK T-SPIN";
							} else {
								game.stats.score += (clearedLines.length == 0 ? 400 : clearedLines.length == 1 ? 700 : clearedLines.length == 2 ? 900 : clearedLines.length == 3 ? 1100 : 0) * game.stats.level;
								message.clearType = "T-SPIN";
							}
							game.lastType = "T-Spin," + clearedLines.length;
							game.stats.tSpins.regular++;
						} else {
							game.stats.score += (game.lastType == "T-Spin Mini" ? 150 : 100) * game.stats.level;
							message.clearType = (game.lastType == "T-Spin Mini" ? "BACK-TO-BACK " : "") + "T-SPIN MINI";
							game.lastType = "T-Spin Mini";
							game.stats.tSpins.mini++;
						}
						game.lvlLines += clearedLines.length == 0 ? 1 : clearedLines.length == 1 ? 2 : clearedLines.length == 2 ? 4 : clearedLines.length == 3 ? 1 : 0;
					}
				} else if (game.lastType != "Tetris") {
					game.lastType = null;
				}

				game.piece.landed = true;
				clearInterval(game.gravityInterval);
				ghost.innerHTML = "";

				if (clearedLines.length) {
					game.stats.lineTypes[clearedLines.length == 1 ? "single" : clearedLines.length == 2 ? "double" : clearedLines.length == 3 ? "triple" : "tetris"]++;
					game.stats.lineTypes[game.piece.type]++;
					game.stats.score += (clearedLines.length == 1 ? 100 : clearedLines.length == 2 ? 300 : clearedLines.length == 3 ? 500 : clearedLines.length == 4 ? 800 : 0) * game.stats.level;
					if (clearedLines.length == 4) {
						if (game.lastType == "Tetris") {
							game.stats.score += 400 * game.stats.level;
							message.clearType = "BACK-TO-BACK TETRIS";
							game.lvlLines += 12;
						} else {
							message.clearType = "TETRIS";
							game.lvlLines += 8;
						}
						game.lastType = "Tetris";
					} else if (game.lastType == "Tetris") game.lastType = null;
					message.combo = ++game.combo;
					game.stats.score += 50 * game.combo * game.stats.level;
					game.stats.lines += clearedLines.length;
					game.lvlLines += clearedLines.length == 1 ? 1 : clearedLines.length == 2 ? 3 : clearedLines.length == 3 ? 5 : 0;
					var level = Math.ceil((Math.sqrt(8 * game.lvlLines + 9) - Math.sqrt(5)) / Math.sqrt(20));
					if (game.stats.level != level) {
						game.stats.level = level;
						game.speed = Math.pow(.8 - (game.stats.level - 1) * .007, game.stats.level - 1) * 1000;
						message.leveled = true;
					}
					uScore.innerText = "Score: " + game.stats.score.toString().replace(/(\d)(?=(...)+$)/g, "$1 ");
					uLevel.innerText = "Level: " + game.stats.level.toString().replace(/(\d)(?=(...)+$)/g, "$1 ");
					uLines.innerText = "Lines: " + game.stats.lines.toString().replace(/(\d)(?=(...)+$)/g, "$1 ");
					rScoreNum.innerText = game.stats.score.toString().replace(/(\d)(?=(...)+$)/g, "$1 ");
					rLevelNum.innerText = game.stats.level.toString().replace(/(\d)(?=(...)+$)/g, "$1 ");
					rLinesNum.innerText = game.stats.lines.toString().replace(/(\d)(?=(...)+$)/g, "$1 ");

					game.piece.element.classList.add("flashing");

					setTimeout(function() {
						for (var i = coords.length - 1; i >= 0; i--) {
							var block = document.createElement("div");
							block.style.gridArea = "1 / " + (coords[i][0] + 1) + " / 2 / " + (coords[i][0] + 2);
							block.className = "gp_type_" + game.piece.type;
							locked.children[coords[i][1]].appendChild(block);
						}
						if (game.piece.element.parentNode) board.removeChild(game.piece.element);

						for (var i = this.length - 1; i >= 0; i--) {
							locked.children[this[i]].className = "flashing";
						}
						setTimeout(function() {
							for (var i = this.length - 1; i >= 0; i--) {
								locked.children[this[i]].className = "";
							}
							setTimeout(function() {
								for (var i = this.length - 1; i >= 0; i--) {
									locked.children[this[i]].className = "flashing";
								}

								setTimeout(function() {
									for (var i = 0, l = this.length; i < l; i++) {
										locked.removeChild(locked.children[this[i]]);
										locked.insertBefore(document.createElement("div"), locked.firstElementChild);
										game.grid.splice(this[i], 1);
										game.grid.unshift(new Array(10).fill(false));
									}

									setTimeout(progressPiece, (10 + Math.floor((18 - dimensions(game.piece).y2) / 2)) / 60 * 1000);
								}.bind(this), 10 / 60  * 1000);
							}.bind(this), 10 / 60 * 1000);
						}.bind(this), 10 / 60  * 1000);
					}.bind(clearedLines), 10 / 60 * 1000);
				} else {
					game.combo = -1;
					game.piece.element.classList.add("flashing");
					setTimeout(function() {
						for (var i = coords.length - 1; i >= 0; i--) {
							var block = document.createElement("div");
							block.style.gridArea = "1 / " + (coords[i][0] + 1) + " / 2 / " + (coords[i][0] + 2);
							block.className = "gp_type_" + game.piece.type;
							locked.children[coords[i][1]].appendChild(block);
						}
						board.removeChild(game.piece.element);
						progressPiece();
					}, 10 / 60 * 1000);
				}
				message.show();
			} else {
				game.piece.y++;
				game.piece.render(true);
				game.piece.lastRotated = false;
				if (collides(game.piece, 0, 1)) {
					clearInterval(game.gravityInterval);
					game.gravityInterval = setInterval(game.gravitate, Math.max(game.speed, 500));
					game.piece.lockDelayed = true;
				}
			}
			game.refTime = performance.now();
		},
		pause: function() {
			document.body.classList.add("game_paused");
			if (game.midGravityTimeout) game.midGravityTimeout = clearInterval(game.midGravityTimeout) || null;
			game.elapsedGravityTime = (game.elapsedGravityTime || 0) + performance.now() - game.refTime;
			clearInterval(game.gravityInterval);
			game.paused = true;
		},
		play: function() {
			document.body.classList.remove("game_paused");
			game.midGravityTimeout = setTimeout(function() {
				game.gravitate();
				clearInterval(game.gravityInterval);
				game.gravityInterval = setInterval(game.gravitate, collides(game.piece, 0, 1) ? Math.max(game.speed, 500) : game.speed);
			}, game.speed - game.elapsedGravityTime)
			game.paused = false;
			game.refTime = performance.now();
		},
		start: function() {
			game.started = true;
			game.speed = 800;
			clearInterval(game.gravityInterval);
			game.gravityInterval = setInterval(game.gravitate, game.speed);
			game.grid = new Array(18).fill().map(function() {
				return new Array(10).fill(false);
			});
			game.lastType = null;
			game.combo = -1;
			game.piece.next = randomBag();
			game.piece.type = game.piece.next.shift();
			board.innerHTML = "";
			ghost.innerHTML = "";
			locked.innerHTML = "<div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>";
			var dims = dimensions(game.piece);
			game.piece.x = Math.floor(5 - dims.width / 2);
			game.piece.y = 1;
			game.piece.rotation = 0;
			game.piece.element = pieceElement(game.piece.type, game.piece.rotation);
			game.piece.ghost = pieceElement(game.piece.type, game.piece.rotation);
			game.piece.ghost.classList.add("flashing");
			game.piece.landed = false;
			game.piece.lockDelayed = false;
			game.piece.lastRotated = false;
			var preview = pieceElement(game.piece.next[0], 0);
			dims = dimensions({
				type: game.piece.next[0],
				rotation: 0
			});
			preview.style.gridArea = "1 / 1 / " + (dims.height + 1) + " / " + (dims.width + 1);
			uPreview.innerHTML = rPreview.innerHTML = "";
			uPreview.style.gridTemplateColumns = rPreview.style.gridTemplateColumns = preview.style.gridTemplateColumns;
			uPreview.style.gridTemplateRows = rPreview.style.gridTemplateRows = preview.style.gridTemplateRows;
			rPreview.parentNode.style.padding = dims.height == 1 ? "10% 0" : "";
			uPreview.parentNode.style.padding = dims.height == 1 ? "12.5% 0" : "";
			rPreview.style.width = dims.width * 20 + "%";
			uPreview.style.width = dims.width * 25 + "%";
			uPreview.appendChild(preview);
			rPreview.appendChild(preview.cloneNode(true));
			game.piece.render();
			game.stats.score = 0;
			game.stats.level = 1;
			game.stats.lines = 0;
			game.lvlLines = 0;
			game.stats.lineTypes.single = game.stats.lineTypes.double = game.stats.lineTypes.triple = game.stats.lineTypes.tetris = 0;
			game.stats.lineTypes.S = game.stats.lineTypes.Z = game.stats.lineTypes.L = game.stats.lineTypes.J = game.stats.lineTypes.O = game.stats.lineTypes.T = game.stats.lineTypes.I = 0;
			game.stats.tSpins.regular = game.stats.tSpins.mini = 0;
			game.paused = false;
			uScore.innerText = "Score: 0";
			uLevel.innerText = "Level: 1";
			uLines.innerText = "Lines: 0";
			rScoreNum.innerText = "0";
			rLevelNum.innerText = "1";
			rLinesNum.innerText = "0";
			document.body.classList.add("playing");
			document.body.classList.remove("game_paused");
			document.body.classList.remove("new_score");
			document.body.removeAttribute("data-score");
			game.minoWidth = gridContainer.getBoundingClientRect().width / 10;
		},
		end: function() {
			game.started = false;
			document.body.classList.remove("playing");
			document.body.setAttribute("data-score", game.stats.score);
			startScreen.insertBefore(document.getElementById("restart"), startScreen.lastElementChild.previousElementSibling);
			startScreen.firstElementChild.appendChild(document.getElementById("start_btn"));
			startScreen.style.justifyContent = "initial";
			document.getElementById("fin_score").innerText = game.stats.score.toString().replace(/(\d)(?=(...)+$)/g, "$1 ");
			document.getElementById("fin_level").innerText = game.stats.level.toString().replace(/(\d)(?=(...)+$)/g, "$1 ");
			document.getElementById("fin_lines").innerText = game.stats.lines.toString().replace(/(\d)(?=(...)+$)/g, "$1 ");
			document.getElementById("fin_tSpin_mini").innerText = game.stats.tSpins.mini.toString().replace(/(\d)(?=(...)+$)/g, "$1 ");
			document.getElementById("fin_tSpin_reg").innerText = game.stats.tSpins.regular.toString().replace(/(\d)(?=(...)+$)/g, "$1 ");
			for (var i = 0; i < 4; i++) {
				statRowLineNumber.children[i].children[0].innerText = game.stats.lineTypes[["single","double","triple","tetris"][i]].toString().replace(/(\d)(?=(...)+$)/g, "$1 ");
			}
			for (var i = 0; i < 7; i++) {
				statRowLinePiece.children[i].children[1].innerText = game.stats.lineTypes[["S","Z","L","J","T","O","I"][i]].toString().replace(/(\d)(?=(...)+$)/g, "$1 ");
			}

			firebase.firestore().collection("tetris").doc("scores").get({
				source: "server"
			}).then(function(doc) {
				if (doc.metadata.fromCache) {
					if (!document.body.classList.contains("no_scores")) {
						document.body.classList.add("scores_err");
						scoresMsg.firstElementChild.innerText = "These scores may not be up-to-date. Connect to the Internet to get updated scores.";
					}
					return;
				}
				var data = doc.data();
				game.scores = data.p.map(function(score) {
					return {
						owner: "p",
						value: score
					};
				}).concat(data.s.map(function(score) {
					return {
						owner: "s",
						value: score
					};
				})).sort(function(a, b) {
					return b.value - a.value;
				});
				document.body.classList.remove("no_scores");
				document.body.classList.remove("scores_err");
			}).catch(function() {
				if (!document.body.classList.contains("no_scores")) {
					document.body.classList.add("scores_err");
					scoresMsg.firstElementChild.innerText = "These scores may not be up-to-date. Connect to the Internet to get updated scores.";
				}
			});

			game.updateScores();
		},
		stats: {
			lines: null,
			level: null,
			score: null,
			lineTypes: {
				single: null,
				double: null,
				triple: null,
				tetris: null,
				S: null,
				Z: null,
				L: null,
				J: null,
				O: null,
				T: null,
				I: null
			},
			tSpins: {
				regular: null,
				mini: null
			}
		},
		lvlLines: null,
		grid: null,
		gravityInterval: null,
		midGravityTimeout: null,
		speed: null,
		lastType: null,
		combo: null,
		refTime: null,
		elapsedGravityTime: null,
		paused: null,
		minoWidth: (window.game || {minoWidth: null}).minoWidth,
		scores: (window.game || {scores: null}).scores,
		dimensions: dimensions,
		started: false,
		updateScores: function() {
			if (!game.scores) return;
			var score = document.body.getAttribute("data-score") || "0";
			var tempScore = document.getElementById("temp_score");
			if (+score > game.scores.filter(function(score) {
				return score.owner == auth.userID;
			})[4].value) {
				document.body.classList.add("new_score");
				var newScore = {
					owner: auth.userID,
					value: +score
				};

				var scores = game.scores.slice().concat([newScore]).sort(function(a, b) {
					return b.value - a.value;
				});

				if (highScores.children.length == 11) {
					highScores.appendChild(document.createElement("div"));
				} else if (tempScore) {
					tempScore.id = "";
				}

				var index = 0;

				for (var i = 1, l = scores.length + 1; i < l; i++) {
					if (scores[i - 1].owner == auth.userID) index++;
					highScores.children[i].id = scores[i - 1] == newScore ? "temp_score" : index == 6 ? "old_score" : "";
					highScores.children[i].innerHTML = "<div></div><span>" + scores[i - 1].value.toString().replace(/(\d)(?=(...)+$)/g, "$1 ") + "</span>";
					highScores.children[i].className = "score_" + scores[i - 1].owner;
				}

				document.getElementById("pw").value = "";
				document.getElementById("pw_submit").disabled = false;
				document.getElementById("new_score_2").firstElementChild.innerText = "Re-enter your password to add it to the high scores list.";
			} else {
				if (highScores.children.length == 12) {
					highScores.removeChild(tempScore ? tempScore : highScores.lastElementChild);
				}

				for (var i = 1, l = game.scores.length + 1; i < l; i++) {
					highScores.children[i].id = "";
					highScores.children[i].innerHTML = "<div></div><span>" + game.scores[i - 1].value.toString().replace(/(\d)(?=(...)+$)/g, "$1 ") + "</span>";
					highScores.children[i].className = "score_" + game.scores[i - 1].owner;
				}
			}
		}
	}

	if (game.scores) {
		game.updateScores();
	}

	function randomBag() {
		var bag = ["I","O","S","Z","L","J","T"];
		for (var i = 0; i < 7; i++) {
			var rand = Math.floor(Math.random() * 7);
			var temp = bag[rand];
			bag[rand] = bag[i];
			bag[i] = temp;
		}
		return bag;
	} window.r = randomBag

	function dimensions(piece) {
		var dims = {};
		dims.width = piece.type == "S" || piece.type == "Z" || piece.type == "L" || piece.type == "J" || piece.type == "T" ? piece.rotation % 180 ? 2 : 3 : piece.type == "O" ? 2 : piece.rotation % 180 ? 1 : 4;
		dims.height = piece.type == "S" || piece.type == "Z" || piece.type == "L" || piece.type == "J" || piece.type == "T" ? piece.rotation % 180 ? 3 : 2 : piece.type == "O" ? 2 : piece.rotation % 180 ? 4 : 1;
		if (piece.x !== null && piece.y !== null) {
			dims.x1 = piece.x;
			dims.y1 = piece.y;
			dims.x2 = piece.x + dims.width;
			dims.y2 = piece.y + dims.height;
			dims.area = [dims.y1 + 1, dims.x1 + 1, dims.y2 + 1, dims.x2 + 1].join(" / ");
		}
		return dims;
	}

	function pieceElement(type, rotation) {
		var elem = document.createElement("div");
		var dims = dimensions({
			type: type,
			rotation: rotation
		});
		elem.className = "game_piece gp_type_" + type + " gp_rot_" + rotation;
		elem.style.gridTemplateColumns = "repeat(" + dims.width + ", 1fr)";
		elem.style.gridTemplateRows = "repeat(" + dims.height + ", 1fr)";
		for (var i = dims.height * dims.width; i > 0; i--) {
			elem.appendChild(document.createElement("div"));
		}
		return elem;
	}

	function gridCoords(piece) {
		var dims = dimensions(piece);
		var coords = [];
		for (var y = dims.height - 1; y >= 0; y--) {
			for (var x = dims.width - 1; x >= 0; x--) {
				if (!(
					piece.type == "I" ? false :
					piece.type == "O" ? false :
					piece.type == "S" ?
						piece.rotation % 180 ?
							(x == 1 && y == 0 || x == 0 && y == 2) :
							(x == 0 && y == 0 || x == 2 && y == 1) :
					piece.type == "Z" ?
						piece.rotation % 180 ?
							(x == 0 && y == 0 || x == 1 && y == 2) :
							(x == 2 && y == 0 || x == 0 && y == 1) :
					piece.type == "L" ?
						piece.rotation == 0 ?
							(x != 2 && y == 0) :
						piece.rotation == 90 ?
							(x == 1 && y != 2) :
						piece.rotation == 180 ?
							(x != 0 && y == 1) :
							(x == 0 && y != 0) :
					piece.type == "J" ?
						piece.rotation == 0 ?
							(x != 0 && y == 0) :
						piece.rotation == 90 ?
							(x == 1 && y != 0) :
						piece.rotation == 180 ?
							(x != 2 && y == 1) :
							(x == 0 && y != 2) :
						piece.rotation == 0 ?
							(x == 0 && y == 0 || x == 2 && y == 0) :
						piece.rotation == 90 ?
							(x == 1 && y == 0 || x == 1 && y == 2) :
						piece.rotation == 180 ?
							(x == 0 && y == 1 || x == 2 && y == 1) :
							(x == 0 && y == 0 || x == 0 && y == 2)
				)) {
					coords.push([x + dims.x1, y + dims.y1]);
				}
			}
		}
		return coords;
	}

	function collides(piece, translateX, translateY) {
		translateX = translateX || 0;
		translateY = translateY || 0;
		var dims = dimensions(piece);
		if (dims.x1 + translateX < 0 || dims.x2 + translateX > 10 || dims.y2 + translateY > 18) return true;
		var coords = gridCoords(piece);
		for (var i = coords.length - 1; i >= 0; i--) {
			if (game.grid[coords[i][1] + translateY][coords[i][0] + translateX]) {
				return true;
			}
		}
		return false;
	}

	function progressPiece() {
		game.piece.type = game.piece.next.shift();
		game.piece.next = game.piece.next.length ? game.piece.next : randomBag();
		game.piece.landed = false;
		game.piece.lockDelayed = false;
		game.piece.lastRotated = false;
		var dims = dimensions(game.piece);
		game.piece.x = Math.floor(5 - dims.width / 2);
		game.piece.y = 1;
		game.piece.rotation = 0;
		game.piece.element = pieceElement(game.piece.type, game.piece.rotation);
		game.piece.ghost = pieceElement(game.piece.type, game.piece.rotation);
		game.piece.ghost.classList.add("flashing");
		var preview = pieceElement(game.piece.next[0], 0);
		dims = dimensions({
			type: game.piece.next[0],
			rotation: 0
		});
		preview.style.gridArea = "1 / 1 / " + (dims.height + 1) + " / " + (dims.width + 1);
		uPreview.innerHTML = rPreview.innerHTML = "";
		uPreview.style.gridTemplateColumns = rPreview.style.gridTemplateColumns = preview.style.gridTemplateColumns;
		uPreview.style.gridTemplateRows = rPreview.style.gridTemplateRows = preview.style.gridTemplateRows;
		rPreview.parentNode.style.padding = dims.height == 1 ? "10% 0" : "";
		uPreview.parentNode.style.padding = dims.height == 1 ? "12.5% 0" : "";
		rPreview.style.width = dims.width * 20 + "%";
		uPreview.style.width = dims.width * 25 + "%";
		uPreview.appendChild(preview);
		rPreview.appendChild(preview.cloneNode(true));
		game.piece.render();
		clearInterval(game.gravityInterval);
		if (!game.paused) game.gravityInterval = setInterval(game.gravitate, collides(game.piece, 0, 1) ? Math.max(game.speed, 500) : game.speed);
		if (collides(game.piece)) game.end();
	}

	window.message = {
		clearType: null,
		combo: 0,
		leveled: false,
		show: function() {
			var msg = [this.clearType || "", this.combo ? "COMBO \u00D7" + (this.combo + 1) : "", this.leveled ? "LEVEL UP" : ""].filter(function(str) {
				return str;
			}).join("\n");
			this.clearType = null;
			this.combo = 0;
			this.leveled = false;
			if (msg) {
				var div = document.createElement("div");
				div.innerText = msg;
				div.className = "game_msg";
				pauseScreen.parentNode.insertBefore(div, pauseScreen);
				setTimeout(function() {
					div.parentNode.removeChild(div);
				}, 3000);
			}
		}
	}

	window.addEventListener("blur", game.pause);
	document.getElementById("play_btn").addEventListener("click", game.play);
	document.getElementById("play_btn").addEventListener("touchstart", function(e) {
		e.stopPropagation();
		game.play();
	});

	document.getElementById("r_pause").addEventListener("click", function() {
		if (game.paused) game.play();
		else game.pause();
	});
	document.getElementById("u_pause").addEventListener("click", function() {
		if (game.paused) game.play();
		else game.pause();
	});
	document.getElementById("r_end").addEventListener("click", game.end);
	document.getElementById("u_end").addEventListener("click", game.end);
	document.getElementById("start_btn").addEventListener("click", game.start);
}();
