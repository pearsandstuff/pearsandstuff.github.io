!function() {
	// Just a nunch of references to elements that get uses here.
	let rPreview = document.getElementById("r_preview");
	let uPreview = document.getElementById("u_preview");
	let board = document.getElementById("board");
	let ghost = document.getElementById("ghost");
	let locked = document.getElementById("locked");
	let rScoreNum = document.getElementById("r_score_num");
	let uScore = document.getElementById("u_score");
	let rLevelNum = document.getElementById("r_level_num");
	let uLevel = document.getElementById("u_level");
	let rLinesNum = document.getElementById("r_lines_num");
	let uLines = document.getElementById("u_lines");
	let highScores = document.getElementById("high_scores");
	let gridContainer = document.getElementById("grid_container");
	let startScreen = document.getElementById("start");
	let pauseScreen = document.getElementById("pause_screen");
	let statRowLineNumber = document.getElementById("stat_row_line_number");
	let statRowLinePiece = document.getElementById("stat_row_line_piece");
	let tempScore = document.getElementById("temp_score");
	let scoresMsg = document.getElementById("scores_msg");

	// This controls all the game logic and data.
	window.game = window.game || {
		// `game.piece` has data pertaining to the current tetromino piece being controlled by the user as well as some functions that control it.
		piece: {
			// One of either "I", "O", "T", "S", "Z", "L", or "J" that represents the type of tetromino (its shape).
			type: null,
			// The x coordinate of the piece.
			x: null,
			// Y coordinate.
			y: null,
			// An array of the next pieces that will be used once this one gets placed down.
			next: null,
			// Either 0, 90, 180, or 270, representing the rotation the piece is currently in.
			rotation: null,
			// A reference to the element on the page that represents the piece.
			element: null,
			// A reference to the element on the page that represents its ghost (the white shadow showing where the piece will land).
			ghost: null,
			// A boolean indicating of the piece has landed yet.
			landed: null,
			// A boolean indicating if the piece was recently rotated/moved and should have its locking delayed.
			lockDelayed: null,
			// A boolean indicating if the piece was just rotated (used for checking for T-spins).
			lastRotated: null,
			// Used to rotate the piece either "CLOCKWISE" or "COUNTERCLOCKWISE".
			rotate: function(direction) {
				if (game.piece.landed) {
					return;
				}

				if (direction == "CLOCKWISE") {
					game.piece.rotation = (game.piece.rotation + 90) % 360;

					if (game.piece.type == "I") {
						// Determine how much the piece should be translated so that it rotates around the middle.
						let translate = {
							0: [-1, 1],
							90: [2, -1],
							180: [-2, 2],
							270: [1, -2]
						}[game.piece.rotation];

						// If the initial rotation does not fit because of a collision, it can also be translated a couple spots to try to fit.
						// This keep track of possible translations to try before failing the rotation.
						let kicks = {
							0: [
								0, 0,  // No translation
								1, 0,  // Translate one right
								-2, 0, // Translate two left
								1, -2, // Translate one right and two down
								-2, 1  // Translate two left and one up
							],
							90: [
								0, 0,
								-2, 0,
								1, 0,
								-2, -1,
								1, 2
							],
							180: [
								0, 0,
								-1, 0,
								2, 0,
								-1, 2,
								2, -1
							],
							270: [
								0, 0,
								2, 0,
								-1, 0,
								2, 1,
								-1, -2
							]
						}[game.piece.rotation];

						game.piece.x += translate[0];
						game.piece.y += translate[1];

						for (let i = 0; i < 10; i += 2) {
							// If this rotation does not collide, it is a successful rotation.
							if (!collides(game.piece, kicks[i], -kicks[i + 1])) {
								game.piece.x += kicks[i];
								game.piece.y -= kicks[i + 1];
								game.piece.render();
								game.piece.lastRotated = true;

								// If the game is about to collide with the ground and get locked, reset its interval since it was just rotated and shouldn't lock yet.
								if (collides(game.piece, 0, 1)) {
									clearInterval(game.gravityInterval);
									game.gravityInterval = setInterval(game.gravitate, Math.max(game.speed, 500));
									game.piece.lockDelayed = true;
								} else if (game.piece.lockDelayed) {
									clearInterval(game.gravityInterval);
									game.gravityInterval = setInterval(game.gravitate, game.speed);
									game.piece.lockDelayed = false;
								}
								return;
							}
						}
					} else if (game.piece.type != "O") {
						// Do everything that happened above, but now for every other piece (except O since it does not rotate).
						let translate = {
							0: [0, 0],
							90: [1, 0],
							180: [-1, 1],
							270: [0, -1]
						}[game.piece.rotation];
						let kicks = {
							0: [0,0,-1,0,-1,1,0,2,1,-2],
							90: [0,0,-1,0,-1,1,0,-2,-1,-2],
							180: [0,0,1,0,1,-1,0,2,1,2],
							270: [0,0,1,0,1,1,0,-2,1,-2]
						}[game.piece.rotation];
						game.piece.x += translate[0];
						game.piece.y += translate[1];
						for (let i = 0; i < 10; i += 2) {
							if (!collides(game.piece, kicks[i], -kicks[i + 1])) {
								game.piece.x += kicks[i];
								game.piece.y -= kicks[i + 1];
								game.piece.render();
								game.piece.lastRotated = i == 8 ? "triple" : true;

								if (collides(game.piece, 0, 1)) {
									clearInterval(game.gravityInterval);
									game.gravityInterval = setInterval(game.gravitate, Math.max(game.speed, 500));
									game.piece.lockDelayed = true;
								} else if (game.piece.lockDelayed) {
									clearInterval(game.gravityInterval);
									game.gravityInterval = setInterval(game.gravitate, game.speed);
									game.piece.lockDelayed = false;
								}
								return;
							}
						}
					} else {
						let translate = [0,0];
					}
					// If the function hasn't returned by now, it means the piece was not rotated.
					// Undo the rotation and translations and keep the piece exactly as is.
					game.piece.rotation = (game.piece.rotation + 270) % 360;
					game.piece.x -= translate[0];
					game.piece.y -= translate[1];
				} else {
					// Do everything that happened above, in the counterclockwise direction.
					game.piece.rotation = (game.piece.rotation + 270) % 360
					if (game.piece.type == "I") {
						let translate = {
							0: [-2, 1],
							90: [2, -2],
							180: [-1, 2],
							270: [1, -1]
						}[game.piece.rotation];
						let kicks = {
							0: [0,0,2,0,-1,0,2,1,-1,-2],
							90: [0,0,1,0,-2,0,1,-2,-2,1],
							180: [0,0,-2,0,1,0,-2,-1,1,2],
							270: [0,0,-1,0,2,0,-1,2,2,-1]
						}[game.piece.rotation];
						game.piece.x += translate[0];
						game.piece.y += translate[1];
						for (let i = 0; i < 10; i += 2) {
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
						let translate = {
							0: [-1, 0],
							90: [1, -1],
							180: [0, 1],
							270: [0, 0]
						}[game.piece.rotation];
						let kicks = {
							0: [0,0,1,0,1,-1,0,2,1,2],
							90: [0,0,-1,0,-1,1,0,-2,-1,-2],
							180: [0,0,-1,0,-1,-1,0,2,-1,2],
							270: [0,0,1,0,1,1,0,-2,1,-2]
						}[game.piece.rotation];
						game.piece.x += translate[0];
						game.piece.y += translate[1];
						for (let i = 0; i < 10; i += 2) {
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
						let translate = [0,0];
					}
					game.piece.rotation = (game.piece.rotation + 90) % 360;
					game.piece.x -= translate[0];
					game.piece.y -= translate[1];
				}
			},
			// Used to move the piece either "LEFT", "RIGHT", or "DOWN".
			move: function(direction) {
				if (game.piece.landed) {
					return false;
				}

				if (direction == "DOWN") {
					if (!collides(game.piece, 0, 1)) {
						clearInterval(game.gravityInterval);
						game.gravityInterval = setInterval(game.gravitate, game.speed);
						game.piece.lastRotated = false;
						game.gravitate();
						// Each movement down adds 1 to the score.
						game.stats.score++;
						uScore.textContent = `Score: ${formatNumber(game.stats.score)}`;
						rScoreNum.textContent = formatNumber(game.stats.score);
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
			// Used to render the tetromino element along with its ghost.
			render: function(unchangedGhost) {
				let dims = dimensions(game.piece);
				this.element.className = this.ghost.className = `game_piece gp_type_${this.type} gp_rot_${this.rotation}`;
				this.ghost.className += " flashing";
				board.appendChild(this.element);
				this.element.style.gridTemplateColumns = this.ghost.style.gridTemplateColumns = "repeat(" + dims.width + ", 1fr)";
				this.element.style.gridTemplateRows = this.ghost.style.gridTemplateRows = "repeat(" + dims.height + ", 1fr)";
				this.element.style.gridArea = dims.area;

				// Only make the ghost if it actually needs to be re-calculated.
				if (!unchangedGhost) {
					ghost.appendChild(this.ghost);

					// Find where the piece will land by checking each mino downwards until it collides with something.
					for (let i = 0; i < 18; i++) {
						if (collides(game.piece, 0, i + 1)) {
							this.ghost.style.gridArea = `${dims.y1 + i + 1} / ${dims.x1 + 1} / ${dims.y2 + i + 1} / ${dims.x2 + 1}`;
							break;
						}
					}
				}
			},
			// Used to instantly drop the piece all the way to the bottom of the board and lock immediately.
			drop: function() {
				if (game.piece.landed) {
					return;
				}

				for (let i = 0; i < 18; i++) {
					if (collides(game.piece, 0, 1)) {
						// If `i` is 0, the piece didn't drop at all.
						if (i == 0) {
							return;
						}

						game.piece.render(true);
						game.piece.lastRotated = false;
						game.gravitate();
						game.stats.score += i * 2;
						uScore.textContent = `Score: ${formatNumber(game.stats.score)}`;
						rScoreNum.textContent = formatNumber(game.stats.score);
						game.refTime = performance.now();
						return;
					} else {
						game.piece.y++;
					}
				}
			}
		},
		// `game.gravitate` is the function that gets called every time the piece needs to move down.
		// It gets called automatically every few milliseconds due to gravity but can also be called by itself.
		gravitate: function() {
			game.elapsedGravityTime = null;
			game.midGravityTimeout = null;

			// Check if the piece is about be locked or just move down.
			if (collides(game.piece, 0, 1)) {
				let coords = gridCoords(game.piece);

				// Update the game board to show that this new spot is taken.
				for (let i = coords.length - 1; i >= 0; i--) {
					game.grid[coords[i][1]][coords[i][0]] = true;
				}

				// Check if any new lines were cleared.
				let clearedLines = [];
				for (let row = 0; row < 18; row++) {
					if (game.grid[row].every(mino => mino)) {
						clearedLines.push(row);
					}
				}

				// Check for T-spins.
				if (game.piece.type == "T" && game.piece.lastRotated) {
					let surrounded = false;
					let center = coords[game.piece.rotation == 0 || game.piece.rotation == 270 ? 1 : 2];
					let front;
					let back;

					// Get the number of front and back minos that are full to determine if it is a T-spin.
					if (game.piece.rotation == 0) {
						back = center[1] == 17 ? 2 : game.grid[center[1] + 1][center[0] - 1] + game.grid[center[1] + 1][center[0] + 1];
						front = game.grid[center[1] - 1][center[0] - 1] + game.grid[center[1] - 1][center[0] + 1];
					} else if (game.piece.rotation == 90) {
						back = center[0] == 0 ? 2 : game.grid[center[1] - 1][center[0] - 1] + game.grid[center[1] + 1][center[0] - 1];
						front = game.grid[center[1] - 1][center[0] + 1] + game.grid[center[1] + 1][center[0] + 1];
					} else if (game.piece.rotation == 180) {
						back = center[1] == 0 ? 2 : game.grid[center[1] - 1][center[0] - 1] + game.grid[center[1] - 1][center[0] + 1];
						front = game.grid[center[1] + 1][center[0] - 1] + game.grid[center[1] + 1][center[0] + 1];
					} else {
						back = center[0] == 9 ? 2 : game.grid[center[1] - 1][center[0] + 1] + game.grid[center[1] + 1][center[0] + 1];
						front = game.grid[center[1] - 1][center[0] - 1] + game.grid[center[1] + 1][center[0] - 1];
					}

					// T-spins only happen if at least three of the front/back corners are full.
					if (front + back >= 3) {
						// If two of the front ones are full, it is a full T-spin.
						if (front == 2 || game.piece.lastRotated == "triple") {
							// Check if this is a back-to-back T-spin.
							if (game.lastType.toString().substring(0, 7) == "T-Spin,") {
								let last = parseInt(game.lastType.substring(7));
								// Multiple T-spins in a row make for more points.
								game.stats.score += (clearedLines.length == 0 ? 600 : clearedLines.length == 1 ? last >= 1 ? 1100 : 700 : clearedLines.length == 2 ? last >= 2 ? 1500 : 900 : clearedLines.length == 3 ? last >= 3 ? 1900 : 1100 : 0) * game.stats.level;
								message.clearType = "BACK-TO-BACK T-SPIN";
							} else {
								game.stats.score += (clearedLines.length == 0 ? 400 : clearedLines.length == 1 ? 700 : clearedLines.length == 2 ? 900 : clearedLines.length == 3 ? 1100 : 0) * game.stats.level;
								message.clearType = "T-SPIN";
							}

							game.lastType = "T-Spin," + clearedLines.length;
							game.stats.tSpins.regular++;
						} else {
							// Show a message for a T-spin mini (worth less points).
							game.stats.score += (game.lastType == "T-Spin Mini" ? 150 : 100) * game.stats.level;
							message.clearType = (game.lastType == "T-Spin Mini" ? "BACK-TO-BACK " : "") + "T-SPIN MINI";
							game.lastType = "T-Spin Mini";
							game.stats.tSpins.mini++;
						}

						// Doing a T-spin counts as clearing lines to make leveling up faster.
						game.lvlLines += clearedLines.length == 0 ? 1 : clearedLines.length == 1 ? 2 : clearedLines.length == 2 ? 4 : clearedLines.length == 3 ? 1 : 0;
					}
				} else if (game.lastType != "Tetris") {
					game.lastType = null;
				}

				game.piece.landed = true;
				clearInterval(game.gravityInterval);
				ghost.textContent = "";

				// Check if any lines were cleared.
				if (clearedLines.length) {
					game.stats.lineTypes[clearedLines.length == 1 ? "single" : clearedLines.length == 2 ? "double" : clearedLines.length == 3 ? "triple" : "tetris"]++;
					game.stats.lineTypes[game.piece.type]++;
					game.stats.score += (clearedLines.length == 1 ? 100 : clearedLines.length == 2 ? 300 : clearedLines.length == 3 ? 500 : clearedLines.length == 4 ? 800 : 0) * game.stats.level;

					// Clearing four lines shows a TETRIS message.
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
					} else if (game.lastType == "Tetris") {
						game.lastType = null;
					}
					message.combo = ++game.combo;
					game.stats.score += 50 * game.combo * game.stats.level;
					game.stats.lines += clearedLines.length;
					game.lvlLines += clearedLines.length == 1 ? 1 : clearedLines.length == 2 ? 3 : clearedLines.length == 3 ? 5 : 0;

					// If enough lines have been cleared, level up.
					// Tetris has a really weird formula for determining level, but here it is.
					let level = Math.ceil((Math.sqrt(8 * game.lvlLines + 9) - Math.sqrt(5)) / Math.sqrt(20));

					// Check if the level needs to be changed.
					if (game.stats.level != level) {
						game.stats.level = level;
						// Make the speed go faster.
						game.speed = Math.pow(.8 - (game.stats.level - 1) * .007, game.stats.level - 1) * 1000;
						message.leveled = true;
					}

					// Update the score display.
					uScore.textContent = `Score: ${formatNumber(game.stats.score)}`;
					uLevel.textContent = `Level: ${formatNumber(game.stats.level)}`;
					uLines.textContent = `Lines: ${formatNumber(game.stats.lines)}`;
					rScoreNum.textContent = formatNumber(game.stats.score);
					rLevelNum.textContent = formatNumber(game.stats.level);
					rLinesNum.textContent = formatNumber(game.stats.lines);

					// Flash the piece to indicate that it is locked.
					game.piece.element.classList.add("flashing");

					setTimeout(function() {
						// Add the blocks to the #locked display so they stay there permanently.
						for (let i = coords.length - 1; i >= 0; i--) {
							let block = document.createElement("div");
							block.style.gridArea = `1 / ${coords[i][0] + 1} / 2 / ${coords[i][0] + 2}`;
							block.className = `gp_type_${game.piece.type}`;
							locked.children[coords[i][1]].appendChild(block);
						}

						// Remove the element from the #board.
						if (game.piece.element.parentNode) {
							board.removeChild(game.piece.element);
						}

						// Make an entire row flash if it is about to be cleared.
						for (let i = this.length - 1; i >= 0; i--) {
							locked.children[this[i]].className = "flashing";
						}

						setTimeout(function() {
							// Make the entire row stop flashing
							for (let i = this.length - 1; i >= 0; i--) {
								locked.children[this[i]].className = "";
							}

							setTimeout(function() {
								// ... and flash again
								for (let i = this.length - 1; i >= 0; i--) {
									locked.children[this[i]].className = "flashing";
								}

								setTimeout(function() {
									// ... and stop flashing again.
									// Remove the entire row from the board to show it disappeared.
									// Replace it with an empty row at the top.
									for (let i = 0, l = this.length; i < l; i++) {
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
					// Start flashing
					game.piece.element.classList.add("flashing");
					setTimeout(function() {
						// Set the piece in place to be locked (and stop flashing)
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
		// `game.pause` obviously just pauses the game.
		pause: function() {
			document.body.classList.add("game_paused");
			if (game.midGravityTimeout) {
				clearInterval(game.midGravityTimeout)
				game.midGravityTimeout = null;
			}
			game.elapsedGravityTime = (game.elapsedGravityTime || 0) + performance.now() - game.refTime;
			clearInterval(game.gravityInterval);
			game.paused = true;
		},
		// `game.play` starts the game after it had been paused.
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
		// `game.start` restarts the game by wiping all its data clean and making the elements that need to appear on the page.
		start: function() {
			// Sets up some data and makes the elements required for a new game.
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
			board.textContent = "";
			ghost.textContent = "";
			locked.innerHTML = "<div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>";

			let dims = dimensions(game.piece);
			game.piece.x = Math.floor(5 - dims.width / 2);
			game.piece.y = 1;
			game.piece.rotation = 0;
			game.piece.element = pieceElement(game.piece.type, game.piece.rotation);
			game.piece.ghost = pieceElement(game.piece.type, game.piece.rotation);
			game.piece.ghost.classList.add("flashing");
			game.piece.landed = false;
			game.piece.lockDelayed = false;
			game.piece.lastRotated = false;

			let preview = pieceElement(game.piece.next[0], 0);
			dims = dimensions({
				type: game.piece.next[0],
				rotation: 0
			});
			preview.style.gridArea = "1 / 1 / " + (dims.height + 1) + " / " + (dims.width + 1);
			uPreview.textContent = rPreview.textContent = "";
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
			uScore.textContent = "Score: 0";
			uLevel.textContent = "Level: 1";
			uLines.textContent = "Lines: 0";
			rScoreNum.textContent = "0";
			rLevelNum.textContent = "1";
			rLinesNum.textContent = "0";
			document.body.classList.add("playing");
			document.body.classList.remove("game_paused");
			document.body.classList.remove("new_score");
			document.body.removeAttribute("data-score");
			game.minoWidth = gridContainer.getBoundingClientRect().width / 10;
		},
		// `game.end` is used to end the game, and is called either when the user pushes End or they run out of space on the board (i.e. they lose).
		end: function() {
			game.started = false;
			clearInterval(game.gravityInterval);
			document.body.classList.remove("playing");
			document.body.setAttribute("data-score", game.stats.score);

			// Show the restart screen.
			let startBtn = document.getElementById("start_btn");
			startScreen.insertBefore(document.getElementById("restart"), startScreen.lastElementChild.previousElementSibling);
			startScreen.firstElementChild.appendChild(startBtn);
			startBtn.textContent = "Play Again";
			startScreen.style.justifyContent = "initial";

			// Update the statistics screen.
			document.getElementById("fin_score").textContent = formatNumber(game.stats.score);
			document.getElementById("fin_level").textContent = formatNumber(game.stats.level);
			document.getElementById("fin_lines").textContent = formatNumber(game.stats.lines);
			document.getElementById("fin_tSpin_mini").textContent = formatNumber(game.stats.tSpins.mini);
			document.getElementById("fin_tSpin_reg").textContent = formatNumber(game.stats.tSpins.regular);
			let lineClearTypes = ["single", "double", "triple", "tetris"];
			for (let i = lineClearTypes.length - 1; i >= 0; i--) {
				statRowLineNumber.children[i].children[0].textContent = formatNumber(game.stats.lineTypes[lineClearTypes[i]]);
			}
			let tetrominoTypes = ["S", "Z", "L", "J", "T", "O", "I"];
			for (let i = tetrominoTypes.length - 1; i >= 0; i--) {
				statRowLinePiece.children[i].children[1].textContent = formatNumber(game.stats.lineTypes[tetrominoTypes[i]]);
			}

			// Now get scores from the server to update them.
			firebase.firestore().collection("tetris").doc("scores").get({
				source: "server"
			}).then(function(doc) {
				if (doc.metadata.fromCache) {
					if (!document.body.classList.contains("no_scores")) {
						document.body.classList.add("scores_err");
						scoresMsg.firstElementChild.textContent = "These scores may not be up-to-date. Connect to the Internet to get updated scores.";
					}
					return;
				}
				let data = doc.data();
				game.scores = data.p.map(score => (
					{
						owner: "p",
						value: score
					}
				)).concat(data.s.map(score => (
					{
						owner: "s",
						value: score
					}
				))).sort((a, b) => b.value - a.value);

				document.body.classList.remove("no_scores");
				document.body.classList.remove("scores_err");
			}).catch(function() {
				if (!document.body.classList.contains("no_scores")) {
					document.body.classList.add("scores_err");
					scoresMsg.firstElementChild.textContent = "These scores may not be up-to-date. Connect to the Internet to get updated scores.";
				}
			});

			game.updateScores();
		},
		// Keeps track of statistics as the game progresses like the number of lines cleared, etc.
		// Used at the end to dispaly all the statistics to the player after they lose.
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
		// `game.lvlLines` keeps track of how many line clears have happened on this level to determine when to progress to the next level.
		lvlLines: null,
		// A 2-D array of booleans that represents which minos on the game board are occupied.
		grid: null,
		// The ID for the interval that keeps track of gravity.
		gravityInterval: null,
		// If the user presses pause midway between a gravity interval, they should not get the entire interval back when they go to play.
		// This is an ID to a timeout that keeps track of how much time the user should get back before the piece drops when they start playing again.
		midGravityTimeout: null,
		// The number of milliseconds between each gravity interval.
		// Higher levels make the time get shorter to make the tetrominos drop faster.
		speed: null,
		// Either null or "TETRIS", indicating if the last type of line clear was a Tetris or not (consecutive Tetrises yield more points).
		lastType: null,
		// The number of consecutive line clears (minus 1).
		combo: null,
		// Uses performance.now() to keep track of time.
		refTime: null,
		// How much time has passed since the last gravity drop.
		elapsedGravityTime: null,
		// A boolean indicating if the game is paused.
		paused: null,
		// The width of an individual grid block (a "mino").
		// Used for touch.js to measure how many blocks the tetromino should be moved by when they swipe left and right.
		minoWidth: (window.game || {minoWidth: null}).minoWidth,
		// A list of high scores.
		scores: (window.game || {scores: null}).scores,
		// See the `dimensions` function definition.
		dimensions: dimensions,
		// A boolean indicating if the game has started.
		started: false,
		// Used to update the high scores list.
		updateScores: function() {
			if (!game.scores) {
				return;
			}

			let score = document.body.getAttribute("data-score") || "0";
			let tempScore = document.getElementById("temp_score");

			// Check if there's a new high score.
			if (+score > game.scores.filter(function(score) {
				return score.owner == auth.userID;
			})[4].value) {
				// Show the new high scores screen.
				document.body.classList.add("new_score");
				let newScore = {
					owner: auth.userID,
					value: +score
				};

				// Sort the scores.
				let scores = game.scores.slice().concat([newScore]).sort((a, b) => b.value - a.value);

				if (highScores.children.length == 11) {
					highScores.appendChild(document.createElement("div"));
				} else if (tempScore) {
					tempScore.id = "";
				}

				// Show all the new scores, and add a special ID to the new one and the old that one will be replaced.
				// The ID makes them flash so the user knows where the scores will be in relation to the others.
				let index = 0;
				for (var i = 0, l = scores.length; i < l; i++) {
					if (scores[i].owner == auth.userID) {
						index++;
					}

					highScores.children[i + 1].id = scores[i] == newScore ? "temp_score" : index == 6 && scores[i].owner == auth.userID ? "old_score" : "";
					highScores.children[i + 1].innerHTML = `<div></div><span>${formatNumber(scores[i].value)}</span>`;
					highScores.children[i + 1].className = `score_${scores[i].owner}`;
				}

				// Reconfigure the password entry form.
				document.getElementById("pw").value = "";
				document.getElementById("pw_submit").disabled = false;
				document.getElementById("new_score_2").firstElementChild.textContent = "Re-enter your password to add it to the high scores list.";
			} else {
				if (highScores.children.length == 12) {
					highScores.removeChild(tempScore ? tempScore : highScores.lastElementChild);
				}

				for (let i = 0, l = game.scores.length; i < l; i++) {
					highScores.children[i + 1].id = "";
					highScores.children[i + 1].innerHTML = `<div></div><span>${formatNumber(game.scores[i].value)}</span>`;
					highScores.children[i + 1].className = `score_${game.scores[i].owner}`;
				}
			}
		}
	}

	if (game.scores) {
		game.updateScores();
	}

	// Every seven tetromino pieces, a new "bag" is created that randomly sorts the next seven.
	// This order is what determines the order of the tetrominos.
	// It ensures three of the same pieces will never show up in a row and you ge the full variety.
	// This is how actual Tetris does it.
	function randomBag() {
		let bag = ["I", "O", "S", "Z", "L", "J", "T"];
		for (var i = 0; i < 7; i++) {
			let rand = Math.floor(Math.random() * 7);
			let temp = bag[rand];
			bag[rand] = bag[i];
			bag[i] = temp;
		}
		return bag;
	}

	// Given a piece, returns its dimensions (height, width, and bounding box coordinates), taking its orientation into account.
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

	// Given a piece type and rotation, returns an HTMLElement that will show that piece.
	function pieceElement(type, rotation) {
		let elem = document.createElement("div");
		let dims = dimensions({
			type: type,
			rotation: rotation
		});
		elem.className = `game_piece gp_type_${type} gp_rot_${rotation}`;
		elem.style.gridTemplateColumns = `repeat(${dims.width}, 1fr)`;
		elem.style.gridTemplateRows = `repeat(${dims.height}, 1fr)`;
		for (let i = dims.height * dims.width; i > 0; i--) {
			elem.appendChild(document.createElement("div"));
		}
		return elem;
	}

	// Given a piece on the game board, returns a list of where all its individual minos are.
	function gridCoords(piece) {
		let dims = dimensions(piece);
		let coords = [];
		for (let y = dims.height - 1; y >= 0; y--) {
			for (let x = dims.width - 1; x >= 0; x--) {
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

	// Checks if the given tetromino would collide with a wall or another tetromino if it gets translated by a certain x and y.
	function collides(piece, translateX, translateY) {
		translateX = translateX || 0;
		translateY = translateY || 0;
		let dims = dimensions(piece);

		// Collides with wall.
		if (dims.x1 + translateX < 0 || dims.x2 + translateX > 10 || dims.y2 + translateY > 18) {
			return true;
		}

		// Collides with another tetromino.
		let coords = gridCoords(piece);
		for (let i = coords.length - 1; i >= 0; i--) {
			if (game.grid[coords[i][1] + translateY][coords[i][0] + translateX]) {
				return true;
			}
		}

		// Doesn't collide with anything.
		return false;
	}

	// Makes the game progress to the next tetromino.
	function progressPiece() {
		// Get a new random piece via a random bag and set all its attributes to their initial values.
		game.piece.type = game.piece.next.shift();
		game.piece.next = game.piece.next.length ? game.piece.next : randomBag();
		game.piece.landed = false;
		game.piece.lockDelayed = false;
		game.piece.lastRotated = false;

		let dims = dimensions(game.piece);
		game.piece.x = Math.floor(5 - dims.width / 2);
		game.piece.y = 1;
		game.piece.rotation = 0;
		game.piece.element = pieceElement(game.piece.type, game.piece.rotation);
		game.piece.ghost = pieceElement(game.piece.type, game.piece.rotation);
		game.piece.ghost.classList.add("flashing");

		let preview = pieceElement(game.piece.next[0], 0);
		dims = dimensions({
			type: game.piece.next[0],
			rotation: 0
		});
		preview.style.gridArea = `1 / 1 / ${dims.height + 1} / ${dims.width + 1}`;
		uPreview.textContent = rPreview.textContent = "";
		uPreview.style.gridTemplateColumns = rPreview.style.gridTemplateColumns = preview.style.gridTemplateColumns;
		uPreview.style.gridTemplateRows = rPreview.style.gridTemplateRows = preview.style.gridTemplateRows;
		rPreview.parentNode.style.padding = dims.height == 1 ? "10% 0" : "";
		uPreview.parentNode.style.padding = dims.height == 1 ? "12.5% 0" : "";
		rPreview.style.width = `${dims.width * 20}%`;
		uPreview.style.width = `${dims.width * 25}%`;
		uPreview.appendChild(preview);
		rPreview.appendChild(preview.cloneNode(true));
		game.piece.render();

		// Restart the gravity interval so that it the tetromino doesn't spawn in and immediately get pulled down.
		clearInterval(game.gravityInterval);
		if (!game.paused && game.started) {
			game.gravityInterval = setInterval(game.gravitate, collides(game.piece, 0, 1) ? Math.max(game.speed, 500) : game.speed);
		}

		// If the tetromino collides with any others in the way, the game is over.
		if (collides(game.piece)) {
			game.end();
		}
	}

	// Given a number, returns a string with a space every third digit starting from the end.
	// 12345678 => 12 345 678
	function formatNumber(number) {
		return number.toString().replace(/(\d)(?=(...)+$)/g, "$1 ")
	}

	// This controls all the messages that pop up on the board when the user does something, like "Level Up" or "Combo".
	window.message = {
		// Either null or "TETRIS" to indicate if the user performed a Tetris line clear.
		clearType: null,
		// The number of consecutive lines cleared by the user (minus 1 since clearing one line doesn't do anything).
		combo: 0,
		// True if the user leveled up.
		leveled: false,
		// Shows the message on the screen and resets all the data for the next turn.
		show: function() {
			let msg = [this.clearType || "", this.combo ? `COMBO \u00D7 ${this.combo + 1}` : "", this.leveled ? "LEVEL UP" : ""].filter(str => str).join("\n");
			this.clearType = null;
			this.combo = 0;
			this.leveled = false;

			// If at least one line of text was generated, show the text.
			if (msg) {
				let div = document.createElement("div");
				div.innerText = msg;
				div.className = "game_msg";
				pauseScreen.parentNode.insertBefore(div, pauseScreen);

				// After 3 seconds (once it's already faded up and away), remove the message.
				setTimeout(function() {
					div.parentNode.removeChild(div);
				}, 3000);
			}
		}
	}

	// Makes the game auto-pause when the user leaves the window.
	window.addEventListener("blur", game.pause);

	// Start the game when they click Play (after having clicked Pause).
	document.getElementById("play_btn").addEventListener("click", game.play);
	document.getElementById("play_btn").addEventListener("touchstart", function(e) {
		e.stopPropagation();
		game.play();
	});

	// Make the game puase when they click Pause.
	document.getElementById("r_pause").addEventListener("click", function() {
		game.paused ? game.play() : game.pause();
	});
	document.getElementById("u_pause").addEventListener("click", function() {
		game.paused ? game.play() : game.pause();
	});

	// End the game when they click End.
	document.getElementById("r_end").addEventListener("click", game.end);
	document.getElementById("u_end").addEventListener("click", game.end);

	// Start the game when they click Start.
	document.getElementById("start_btn").addEventListener("click", game.start);
}();
