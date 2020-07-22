!function() {
	let pw = document.getElementById("pw");
	let wrongPW = document.getElementById("wrong_pw");
	let tooManyPW = document.getElementById("too_many");
	let emptyPW = document.getElementById("empty_pw");

	// Try logging in when the <form> is submitted.
	document.getElementById("form").addEventListener("submit", function(e) {
		e.preventDefault();

		// Get rid of warnings.
		wrongPW.style.display = "";
		tooManyPW.style.display = "";
		emptyPW.style.display = "";

		// If the password matches, call goToReturnPage(). Otherwise show an error.
		if (pw.value) {
			auth.signIn(pw.value).then(goToReturnPage).catch(function(rejections) {
				// If any of the accounts are locked out for trying too many times, show that error.
				if (rejections.some(function(rejection) {
					return rejection.error.code == "auth/too-many-requests";
				})) {
					tooManyPW.style.display = "block";
				} else {
					wrongPW.style.display = "block";
				}

				pw.classList.add("flash");
				setTimeout(function() {
					pw.classList.remove("flash");
				}, 700);
			});
		} else {
			emptyPW.style.display = "block";
		}
	});

	if (window.firebase) {
		// If the user is already logged in, call goToReturnPage immediately.
		auth.listenFor.init(function(user) {
			if (user) {
				goToReturnPage();
			}
		});
	} else {
		// If firebase was never loaded, show an error message about being disconnected.
		let reload = document.getElementById("reload");
		reload.addEventListener("click", () => location.reload());
		reload.focus();
		document.getElementById("icon").children[0].src = "/svg/p&s.disconnected.svg";
		document.getElementById("disconnected").style.display = "block";
		document.getElementById("login_btn").disabled = true;
		pw.disabled = true;
		pw.placeholder = "";
	}

	// Parse the search query in the URL and go to wherever the "return" key points.
	// If there is no return key, go to the root home page.
	function goToReturnPage() {
		let obj = {};
		(location.search.substring(1) || "return=%2F").split("&").forEach(function(kv) {
			kv = kv.split("=");
			obj[decodeURIComponent(kv[0])] = decodeURIComponent(kv[1]);
		});
		location.replace(obj.return || "/");
	}
}();