!function() {
	let right = false;
	let left = false;
	let down = false;
	let rightTimeout = null;
	let leftTimeout = null;
	let downTimeout = null;
	let rightInterval = null;
	let leftInterval = null;
	let downInterval = null;

	document.addEventListener("keydown", function(e) {
		// Escape and F1 toggle pausing
		if (e.code == "F1" || e.keyCode == 112 || e.which == 112 || e.code == "Escape" || e.keyCode == 27 || e.which == 27) {
			e.preventDefault();
			if (game.paused) game.play();
			else game.pause();
			return;
		}

		// If the game is paused, don't listen for key presses since the tetromino can't be controlled right now.
		if (game.paused) return;

		// Up arrow, X, Numpad 3, and Numpad 7 all trigger a clockwise rotation.
		if (e.code == "ArrowUp" || e.keyCode == 38 || e.which == 38 || e.code == "KeyX" || e.keyCode == 88 || e.which == 88 || e.code == "Numpad3" || e.keyCode == 99 || e.which == 99 || e.code == "Numpad7" || e.keyCode == 103 || e.which == 103) {
			game.piece.rotate("CLOCKWISE");
		}
		// Space bar and Numpad 8 trigger a hard drop.
		else if ((e.code == "Space" || e.keyCode == 32 || e.which == 32) && e.target.tagName != "BUTTON" || e.code == "Numpad8" || e.keyCode == 104 || e.which == 104) {
			game.piece.drop();
		}
		// Control, Z, Numpad 1, and Numpad 9 all trigger a counterclockwise rotation.
		else if (e.code == "ControlRight" || e.keyCode == 17 || e.which == 17 || e.code == "ControlLeft" || e.code == "KeyZ" || e.keyCode == 90 || e.which == 90 || e.code == "Numpad1" || e.keyCode == 97 || e.which == 97 || e.code == "Numpad9" || e.keyCode == 105 || e.which == 105) {
			game.piece.rotate("COUNTERCLOCKWISE");
		}
		// Right arrow and Numpad 6 trigger a movemenet rightward.
		else if (e.code == "ArrowRight" || e.keyCode == 39 || e.which == 39 || e.code == "Numpad6" || e.keyCode == 102 || e.which == 102) {
			// Right movement (and left movement, and soft drop) can be repeated by holding the key down.
			// The `right` variable keeps track of whether the key is being pushed down (i.e. whether to repeat).
			// If it's already down, don't do anything; let the interval take care of repeating.
			if (right) return;
			right = true;
			moveRight();
			// After 250 ms of continuous holding down, start repeatingt the movement.
			rightTimeout = setTimeout(function() {
				// Repeat it every 40 ms.
				rightInterval = setInterval(moveRight, 40);
				moveRight();
			}, 250);
		}
		// Left arrow and Numpad 4 trigger a movement leftward.
		else if (e.code == "ArrowLeft" || e.keyCode == 37 || e.which == 37 || e.code == "Numpad4" || e.keyCode == 100 || e.which == 100) {
			if (left) return;
			left = true;
			moveLeft();
			leftTimeout = setTimeout(function() {
				leftInterval = setInterval(moveLeft, 40);
				moveLeft();
			}, 250);
		}
		// Down arrow and Numpad 5 trigger a soft drop.
		else if (e.code == "ArrowDown" || e.keyCode == 40 || e.which == 40 ||  e.code == "Numpad2" || e.keyCode == 98 || e.which == 98) {
			if (down) return;
			down = true;
			moveDown();
			downTimeout = setTimeout(function() {
				downInterval = setInterval(moveDown, 40);
				moveDown();
			}, 250);
		}
	});

	// Handle keyup events to know when to stop auto-repeating movements.
	document.addEventListener("keyup", function(e) {
		if (e.code == "ArrowRight" || e.keyCode == 39 || e.which == 39 || e.code == "Numpad6" || e.keyCode == 102 || e.which == 102) {
			right = false;
			rightTimeout = clearTimeout(rightTimeout) || null;
			rightInterval = clearInterval(rightInterval) || null;
		} else if (e.code == "ArrowLeft" || e.keyCode == 37 || e.which == 37 || e.code == "Numpad4" || e.keyCode == 100 || e.which == 100) {
			left = false;
			leftTimeout = clearTimeout(leftTimeout) || null;
			leftInterval = clearInterval(leftInterval) || null;
		} else if (e.code == "ArrowDown" || e.keyCode == 40 || e.which == 40 ||  e.code == "Numpad2" || e.keyCode == 98 || e.which == 98) {
			down = false;
			downTimeout = clearTimeout(downTimeout) || null;
			downInterval = clearInterval(downInterval) || null;
		}
	});

	function moveRight() {
		game.piece.move("RIGHT");
	}

	function moveLeft() {
		game.piece.move("LEFT");
	}

	function moveDown() {
		game.piece.move("DOWN");
	}
}();