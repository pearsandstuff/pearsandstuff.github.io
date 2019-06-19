!function(touches) {
	var underContainer = document.getElementById("under_container");
	function touchStart(e) {
		if (game.paused || !game.started) return;
		if (underContainer.clientHeight < underContainer.scrollHeight) {
			for (var node = e.target; node.parentNode; node = node.parentNode) {
				if (node.parentNode == underContainer) return;
			}
		}
		if (e.target.tagName != "BUTTON") e.preventDefault();
		e.stopPropagation();
		for (var i = 0, l = e.changedTouches.length; i < l; i++) {
			var touch = {
				start: {
					x: e.changedTouches[i].clientX,
					y: e.changedTouches[i].clientY,
					tetriminoX: game.piece.x,
					time: e.timeStamp
				},
				moves: [],
				release: null,
				ended: false,
				id: e.changedTouches[i].identifier,
				holdLength: null,
				type: "tap",
				tapHalf: Math.floor(2 * e.changedTouches[i].clientX / window.innerWidth) ? "CLOCKWISE" : "COUNTERCLOCKWISE",
				timeoutEndSwipe: null,
				timeoutHoldSwipe: null,
				downInterval: null
			};
			touches.push(touch);
			touch.moves.last = touch.start;
		}
	}

	function touchMove(e) {
		if (game.paused || !game.started) return;
		if (underContainer.clientHeight < underContainer.scrollHeight) {
			for (var node = e.target; node.parentNode; node = node.parentNode) {
				if (node.parentNode == underContainer) return;
			}
		}
		e.preventDefault();
		e.stopPropagation();
		for (var i = 0, l = e.changedTouches.length; i < l; i++) {
			var touch = touches.filter(function(touch) {
				return touch.id == e.changedTouches[i].identifier;
			})[0];

			touch.moves.last = touch.moves.last || touch.start;
			var move = {
				x: e.changedTouches[i].clientX,
				y: e.changedTouches[i].clientY,
				tetriminoX: game.piece.x,
				dx: e.changedTouches[i].clientX - touch.moves.last.x,
				dy: e.changedTouches[i].clientY - touch.moves.last.y,
				dd: Math.hypot(e.changedTouches[i].clientX - touch.moves.last.x, e.changedTouches[i].clientY - touch.moves.last.y),
				angle: (Math.atan2(e.changedTouches[i].clientY - touch.moves.last.y, e.changedTouches[i].clientX - touch.moves.last.x) / Math.PI * 180 + 360) % 360,
				dtime: e.timeStamp - touch.moves.last.timeStamp,
				time: e.timeStamp
			};

			if (move.dx == 0 && move.dy == 0) return;

			if (move.dtime > 50) {
				touch.start = touch.moves.last;
				touch.moves = [];
			}

			var xOffset = Math.round((move.x - touch.start.x) / (game.minoWidth * 1.1));
			if (game.piece.x != touch.start.tetriminoX + xOffset && !touch.downInterval) {
				touch.type = "swipe";
				if (game.piece.x != Math.max(0, Math.min(10 - game.dimensions(game.piece).width, touch.start.tetriminoX + xOffset))) {
					var moveBy = Math.max(0, Math.min(10 - game.dimensions(game.piece).width, touch.start.tetriminoX + xOffset)) - game.piece.x;
					for (var i = Math.abs(moveBy); i > 0; i--) {
						game.piece.move(moveBy < 0 ? "LEFT" : "RIGHT");
					}
				}
			}

			if (move.y - touch.start.y > 5 && Math.abs(move.x - (touch.moves[Math.max(0, touch.moves.length - 4)] || touch.start).x) < move.y - (touch.moves[Math.max(0, touch.moves.length - 4)] || touch.start).y) {
				function down() {
					if (touch.ended || !touch.downInterval) return touch.downInterval = null;
					game.piece.move("DOWN")
				}
				touch.downInterval = true;
				touch.type = "swipe";
				game.piece.move("DOWN")
				touch.downInterval = setTimeout(function() {
					if (touch.ended || !touch.downInterval) return;
					game.piece.move("DOWN")
					touch.downInterval = setInterval(down, 250);
				}, 500);
			} else {
				clearTimeout(touch.downInterval)
				touch.downInterval = clearInterval(touch.downInterval) || null;
			}

			touch.moves.last = touch.moves[touch.moves.push(move) - 1];
		}
	}

	function touchRelease(e) {
		if (e.target.tagName != "BUTTON" && game.started) e.preventDefault();
		if (underContainer.clientHeight < underContainer.scrollHeight) {
			for (var node = e.target; node.parentNode; node = node.parentNode) {
				if (node.parentNode == underContainer) return;
			}
		}
		if (game.started) e.stopPropagation();
		for (var i = 0, l = e.changedTouches.length; i < l; i++) {
			var index = touches.map(function(touch) {
				return touch.id;
			}).indexOf(e.changedTouches[i].identifier);

			if (index == -1) return;
			
			var touch = touches[index];
			touch.release = {
				x: e.changedTouches[i].clientX,
				y: e.changedTouches[i].clientY,
				time: e.timeStamp
			};
			touch.ended = true;

			if (touch.type == "swipe" && touch.moves.length >= 2 && e.timeStamp - touch.moves.last.time < 50 && Math.abs(touch.release.x - touch.moves[Math.max(0, touch.moves.length - 4)].x) < touch.release.y - touch.moves[Math.max(0, touch.moves.length - 4)].y) {
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
		if (swipe.lastWasDown) swipe(0, 10, time);
	}

	function tap(direction, time) {
		tap.history.push({
			time: time
		});
		game.piece.rotate(direction);
	}
	tap.history = [];

	var layout = document.getElementById("layout");

	document.addEventListener("touchstart", touchStart);
	document.addEventListener("touchmove", touchMove, {passive: false});
	document.addEventListener("touchend", touchRelease);
	document.addEventListener("touchcancel", touchRelease);

	Math.hypot = Math.hypot || function hypot(a, b) {
		return Math.sqrt(a * a + b * b);
	}
}([]);