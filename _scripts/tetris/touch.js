(function() {
	let touches = [];
	let underContainer = document.getElementById("under_container");
	let layout = document.getElementById("layout");

	function touchStart(e) {
		if (game.paused || !game.started) {
			return;
		}

		// Prevent touches if the touch didn't originate in the actual game area.
		if (underContainer.clientHeight < underContainer.scrollHeight) {
			for (let node = e.target; node.parentNode; node = node.parentNode) {
				if (node.parentNode == underContainer) {
					return;
				}
			}
		}

		if (e.target.tagName != "BUTTON") {
			e.preventDefault();
		}

		e.stopPropagation();

		for (let i = 0, l = e.changedTouches.length; i < l; i++) {
			// Add a new touch object to the list of touches to keep track of later.
			let touch = {
				// Keep track of where the touch started to determine how much to move the tetromino.
				start: {
					x: e.changedTouches[i].clientX,
					y: e.changedTouches[i].clientY,
					tetrominoX: game.piece.x,
					time: e.timeStamp
				},
				// A list of moves this touch will make.
				moves: [],
				// A reference to the touch when it is released.
				release: null,
				// Indicates if the touch is ended yet.
				ended: false,
				// ID to make this touch distinguishable.
				id: e.changedTouches[i].identifier,
				// Start as a "tap" but switch to "swipe" later if the user moves enough.
				type: "tap", 
				// Which half of the screen the tap started at.
				// Used to determine which way the tetromino should rotate.
				tapHalf: Math.floor(2 * e.changedTouches[i].clientX / window.innerWidth) ? "CLOCKWISE" : "COUNTERCLOCKWISE",
				// Timeouts used later.
				timeoutEndSwipe: null,
				timeoutHoldSwipe: null,
				// Interval used later.
				downInterval: null
			};

			touches.push(touch);
			touch.moves.last = touch.start;
		}
	}

	function touchMove(e) {
		if (game.paused || !game.started) {
			return;
		}

		if (underContainer.clientHeight < underContainer.scrollHeight) {
			for (var node = e.target; node.parentNode; node = node.parentNode) {
				if (node.parentNode == underContainer) {
					return;
				}
			}
		}

		e.preventDefault();
		e.stopPropagation();

		for (let i = 0, l = e.changedTouches.length; i < l; i++) {
			// Get the touch object for this specific touch
			let touch = touches.filter(touch => touch.id == e.changedTouches[i].identifier)[0];

			touch.moves.last = touch.moves.last || touch.start;

			let move = {
				// Location of this touch.
				x: e.changedTouches[i].clientX,
				y: e.changedTouches[i].clientY,
				// Where the tetromino is now.
				tetrominoX: game.piece.x,
				// The distance that was moved in the x direction.
				dx: e.changedTouches[i].clientX - touch.moves.last.x,
				// Same thing for vertical direction.
				dy: e.changedTouches[i].clientY - touch.moves.last.y,
				// Total distance that was moved.
				dd: Math.hypot(e.changedTouches[i].clientX - touch.moves.last.x, e.changedTouches[i].clientY - touch.moves.last.y),
				// The angle from the last touch.
				angle: (Math.atan2(e.changedTouches[i].clientY - touch.moves.last.y, e.changedTouches[i].clientX - touch.moves.last.x) / Math.PI * 180 + 360) % 360,
				// The time since the last touch.
				dtime: e.timeStamp - touch.moves.last.timeStamp,
				// The absolute time.
				time: e.timeStamp
			};

			// If the touch didn't even move, just return.
			if (move.dx == 0 && move.dy == 0) {
				return;
			}

			// If 50 ms has passed since the last touch, treat this as a new touch.
			if (move.dtime > 50) {
				touch.start = touch.moves.last;
				touch.moves = [];
			}

			// The number of spaces the tetromino should be moved over from where it started.
			let xOffset = Math.round((move.x - touch.start.x) / (game.minoWidth * 1.1));
			// Check if the tetromino needs to be moved, and it is not currently being dragged down.
			if (game.piece.x != touch.start.tetrominoX + xOffset && !touch.downInterval) {
				touch.type = "swipe";
				// Find how many spaces to move by.
				let moveBy = Math.max(0, Math.min(10 - game.dimensions(game.piece).width, touch.start.tetrominoX + xOffset)) - game.piece.x;
				// Send a move event that many number of times.
				for (let i = Math.abs(moveBy); i > 0; i--) {
					game.piece.move(moveBy < 0 ? "LEFT" : "RIGHT");
				}
			}

			// Check if the last few moves have been pointing down.
			if (move.y - touch.start.y > 5 && Math.abs(move.x - (touch.moves[Math.max(0, touch.moves.length - 4)] || touch.start).x) * 1.5 < move.y - (touch.moves[Math.max(0, touch.moves.length - 4)] || touch.start).y) {
				function down() {
					if (touch.ended || !touch.downInterval) {
						return touch.downInterval = null;
					}
					game.piece.move("DOWN")
				}

				touch.type = "swipe";
				game.piece.move("DOWN");
				// Start a new timeout. In 500 ms, if the touch is still going downwards, repeat the down mvoemenet every 250 ms.
				touch.downInterval = setTimeout(function() {
					if (touch.ended || !touch.downInterval) {
						return;
					}
					game.piece.move("DOWN");
					touch.downInterval = setInterval(down, 250);
				}, 500);
			} else {
				clearTimeout(touch.downInterval);
				touch.downInterval = null;
			}

			touch.moves.last = touch.moves[touch.moves.push(move) - 1];
		}
	}

	function touchRelease(e) {
		if (e.target.tagName != "BUTTON" && game.started) {
			e.preventDefault();
		}

		if (underContainer.clientHeight < underContainer.scrollHeight) {
			for (var node = e.target; node.parentNode; node = node.parentNode) {
				if (node.parentNode == underContainer) return;
			}
		}

		if (game.started) {
			e.stopPropagation();
		}

		for (let i = 0, l = e.changedTouches.length; i < l; i++) {
			let index = touches.map(function(touch) {
				return touch.id;
			}).indexOf(e.changedTouches[i].identifier);

			if (index == -1) return;
			
			let touch = touches[index];
			touch.release = {
				x: e.changedTouches[i].clientX,
				y: e.changedTouches[i].clientY,
				time: e.timeStamp
			};
			touch.ended = true;

			let previousTouch = touch.moves[Math.max(0, touch.moves.length - 4)];
			if (touch.type == "swipe" && touch.moves.length >= 2 && e.timeStamp - touch.moves.last.time < 50 && Math.abs(touch.release.x - previousTouch.x) * 2 < touch.release.y - previousTouch.y && touch.release.y - previousTouch.y > 15) {
				game.piece.drop();
			} else if (touch.type == "tap") {
				tap(touch.tapHalf, e.timeStamp);
			}

			touches.splice(index, 1);
		}
	}

	function swipe(x, y, time) {
		swipe.lastWasDown = y > Math.abs(x);
		if (y <= Math.abs(x)) return;
		swipe.history.push({
			time: time
		});
		game.piece.move("DOWN");
	}

	swipe.history = [];
	swipe.lastWasDown = false;
	swipe.repeat = function(time) {
		if (swipe.lastWasDown) {
			swipe(0, 10, time)
		};
	}

	function tap(direction, time) {
		tap.history.push({
			time: time
		});
		game.piece.rotate(direction);
	}
	tap.history = [];

	document.addEventListener("touchstart", touchStart);
	document.addEventListener("touchmove", touchMove, {passive: false});
	document.addEventListener("touchend", touchRelease);
	document.addEventListener("touchcancel", touchRelease);
})();