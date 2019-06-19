!function() {
	var right = false;
	var left = false;
	var down = false;
	var rightTimeout = null;
	var leftTimeout = null;
	var downTimeout = null;
	var rightInterval = null;
	var leftInterval = null;
	var downInterval = null;
	document.addEventListener("keydown", function(e) {
		if (e.code == "F1" || e.keyCode == 112 || e.which == 112 || e.code == "Escape" || e.keyCode == 27 || e.which == 27) {
			e.preventDefault();
			if (game.paused) game.play();
			else game.pause();
			return;
		}

		if (game.paused) return;

		if (e.code == "ArrowUp" || e.keyCode == 38 || e.which == 38 || e.code == "KeyX" || e.keyCode == 88 || e.which == 88 || e.code == "Numpad3" || e.keyCode == 99 || e.which == 99 || e.code == "Numpad7" || e.keyCode == 103 || e.which == 103) {
			game.piece.rotate("CLOCKWISE");
		} else if ((e.code == "Space" || e.keyCode == 32 || e.which == 32) && e.target.tagName != "BUTTON" || e.code == "Numpad8" || e.keyCode == 104 || e.which == 104) {
			game.piece.drop();
		} else if (e.code == "ControlRight" || e.keyCode == 17 || e.which == 17 || e.code == "ControlLeft" || e.code == "KeyZ" || e.keyCode == 90 || e.which == 90 || e.code == "Numpad1" || e.keyCode == 97 || e.which == 97 || e.code == "Numpad5" || e.keyCode == 101 || e.which == 101 || e.code == "Numpad9" || e.keyCode == 105 || e.which == 105) {
			game.piece.rotate("COUNTERCLOCKWISE");
		} else if (e.code == "ArrowRight" || e.keyCode == 39 || e.which == 39 || e.code == "Numpad6" || e.keyCode == 102 || e.which == 102) {
			if (right) return;
			right = true;
			moveRight();
			rightTimeout = setTimeout(function() {
				rightInterval = setInterval(moveRight, 40);
				moveRight();
			}, 250);
		} else if (e.code == "ArrowLeft" || e.keyCode == 37 || e.which == 37 || e.code == "Numpad4" || e.keyCode == 100 || e.which == 100) {
			if (left) return;
			left = true;
			moveLeft();
			leftTimeout = setTimeout(function() {
				leftInterval = setInterval(moveLeft, 40);
				moveLeft();
			}, 250);
		} else if (e.code == "ArrowDown" || e.keyCode == 40 || e.which == 40 ||  e.code == "Numpad2" || e.keyCode == 98 || e.which == 98) {
			if (down) return;
			down = true;
			moveDown();
			downTimeout = setTimeout(function() {
				downInterval = setInterval(moveDown, 40);
				moveDown();
			}, 250);
		}
	});
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