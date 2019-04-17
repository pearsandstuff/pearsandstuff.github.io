!function() {
	window.modal = window.modal || function(title, bodyID, buttons, callbacks) {
		var body = document.getElementById(bodyID);

		if (body.hasAttribute("data-gen")) {
			body.parentNode.parentNode.parentNode.style.display = "flex";
		} else {
			var overlay = document.createElement("div");
			overlay.style.background = "rgba(255,255,255,.3)";
			overlay.style.position = "absolute";
			overlay.style.height = overlay.style.width = "100%";
			overlay.style.left = overlay.style.top = 0;
			overlay.style.display = "flex";
			overlay.style.zIndex = 1;
			overlay.style.alignItems = "center";
			overlay.style.justifyContent = "space-around";
			overlay.className = "modal";
			overlay.innerHTML = "<div style='background:#263238;box-shadow:0.2rem 0.4rem 0 0 #151B1E;width:60em;max-width:calc(100em - 4em);padding:1em;border-radius:.5em'><div style='width:calc(100% - 2.5rem);padding-right:.5rem;display:inline-block;font-size:1.5em;font-weight:900;color:#FFF;vertical-align:middle'></div><button style='background-image:url(/svg/X.svg);background-size:70%;height:2em;width:2em;font-size:1em;border-radius:.5em;display:inline-block;vertical-align:top'></button><div style='background:#37474F;margin:.75em auto;color:#FFF;padding:.5em .75em;border-radius:.5em;box-shadow:0.1rem 0.2rem 0 0 #151B1E'></div><div style='display:flex;justify-content:flex-end'></div></div>";
			overlay.firstChild.children[2].appendChild(body);
			overlay.addEventListener("click", function() {
				this.style.display = "none";
			});
			overlay.firstChild.addEventListener("click", function(e) {
				e.stopPropagation();
			});
			overlay.firstChild.children[1].addEventListener("click", function() {
				overlay.style.display = "none";
			});
			overlay.firstChild.children[0].innerText = title;
			body.setAttribute("data-gen", "");
			for (var i = 0, l = buttons.length; i < l; i++) {
				var btn = document.createElement("button");
				btn.setAttribute("data-i", i);
				btn.addEventListener("click", function() {
					callbacks[this.getAttribute("data-i")].call(this, function() {
						this.parentNode.parentNode.parentNode.style.display = "none";
					}.bind(this));
				});
				btn.innerText = buttons[i];
				overlay.firstChild.children[3].appendChild(btn);
			}
			document.body.appendChild(overlay);
		}
	}
}();