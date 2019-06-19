!function() {
	function resize() {
		var height = window.innerHeight;
		var width = window.innerWidth;

		if (height < width / 20 * 18) {
			grid.style.flexBasis = height * 10 / 18 / width * 100 + "%";
			leftFill.style.flexBasis = rightFill.style.flexBasis = (1 - (height * 10 / 18 / width)) / .02 + "%";
			rightContainer.style.width = (height * 10 / 18 / width * 100) / (1 - (height * 10 / 18 / width)) + "%";
		} else if (height < width / 15 * 18) {
			grid.style.flexBasis = height * 10 / 18 / width * 100 + "%";
			leftFill.style.flexBasis = (100 - (height * 10 / 18 / width * 150)) / 2 + "%";
			rightFill.style.flexBasis = "";
			rightContainer.style.width = ((height * 10 / 18 / width) / 2) / ((1 - (height * 10 / 18 / width) / 2) / 2) * 100 + "%";
		} else if (height < width / 15 * 23) {
			grid.style.flexBasis = "";
			leftFill.style.flexBasis = rightFill.style.flexBasis = "";
			rightContainer.style.width = "100%";
		} else {
			grid.style.flexBasis = height * 10 / 23 / width * 100 + "%";
			leftFill.style.flexBasis = rightFill.style.flexBasis = (1 - (height * 10 / 23 / width)) / .02 + "%";
			uPreview.style.width = height / 23 * 4 + "px";
		}

		if (window.game && game.started) game.minoWidth = grid.getBoundingClientRect().width / 10;
	}

	var grid = document.getElementById("grid_container");
	var leftFill = document.getElementById("left_fill");
	var rightFill = document.getElementById("right_fill");
	var rightContainer = document.getElementById("right_container");
	var uPreview = document.getElementById("u_preview_container");
 
	window.addEventListener("load", resize);
	window.addEventListener("resize", resize);
}();