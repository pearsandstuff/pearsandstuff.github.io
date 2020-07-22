(function() {
	let pwSubmit = document.getElementById("pw_submit");
	let newScoreSpan = document.getElementById("new_score_2").firstElementChild;

	if (window.firebase) {
		let db = firebase.firestore();
		db.collection("tetris").doc("scores").onSnapshot(dataUpdate);

		// Called whenever we detect that some score has changed.
		function dataUpdate(doc) {
			if (doc.metadata.fromCache && !doc.exists) {
				// Show that we don't have an Internet connection.
				document.body.classList.add("no_scores");
				document.body.classList.add("scores_err");
				document.getElementById("scores_msg").firstElementChild.innerText = "Connect to the Internet to see scores.";
				return;
			} else {
				document.body.classList.remove("no_scores");
				document.body.classList.remove("scores_err");
			}

			// Store the new scores in `game.scores`.
			let data = doc.data();
			let scores = data.p.map(score => (
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
			window.game = window.game || {
				updateScores: function() {}
			};
			game.scores = scores;

			// Update the scores display.
			game.updateScores();
		}
	}

	// When the user enters their password to send a new high score, try sending the score.
	document.getElementById("add_score").addEventListener("submit", function(e) {
		e.preventDefault();

		// They shouldn't be able to submit if the button is disabled.
		if (pwSubmit.disabled) {
			return;
		}

		pwSubmit.disabled = true;
		pwSubmit.textContent = "Sending Score...";

		// Reauthorize the user first by checking they entered the right password.
		auth.reauth(document.getElementById("pw").value).then(function() {
			// If they did, format the data and upload it.
			let obj = {
				p: [],
				s: []
			};

			for (let i = 0, l = game.scores.length; i < l; i++) {
				obj[game.scores[i].owner].push(game.scores[i].value);
			}

			// Makes sure the scores are always sorted.
			obj[auth.userID] = obj[auth.userID].sort((a, b) => b - a);
			// Remove the old lowest score.
			obj[auth.userID].pop();
			// Add the new one.
			obj[auth.userID].push(+document.body.getAttribute("data-score"));
			// Re-sort them to include the new one.
			obj[auth.userID] = obj[auth.userID].sort(function(a, b) {
				return b - a;
			});

			// Try uploading now.
			firebase.firestore().collection("tetris").doc("scores").update({
				[auth.userID]: obj[auth.userID]
			}).then(function() {
				// The scores have been uploaded.
				// Get rid of the "new high scores" screen now.
				document.body.classList.remove("new_score");
				document.body.removeAttribute("data-score");
				pwSubmit.disabled = false;
				pwSubmit.textContent = "Add Score";

				// Update the scores display to match the new uploaded scores.
				game.updateScores();
			}).catch(function() {
				// If there was an error, it must've been from a bad connection. Show an error.
				newScoreSpan.innerText = "There was a problem connecting to the Internet. Check your connection and try again.";
				pwSubmit.disabled = false;
				pwSubmit.textContent = "Add Score";
			});
		}).catch(function(e) {
			// If the password reauthorization failed, show an error.
			if (e.code == "auth/wrong-password") {
				newScoreSpan.innerText = "The password you entered is incorrect. Enter the correct password and try again.";
			} else if (e.code == "auth/network-request-failed") {
				newScoreSpan.innerText = "There was a problem connecting to the Internet. Check your connection and try again.";
			}

			pwSubmit.disabled = false;
			pwSubmit.textContent = "Add Score";
		});
	});

	// If the user has a new high score but no Internet connection, make the Try Again button re-fetch the scores.
	document.getElementById("retry_scores").addEventListener("click", function() {
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
				scoresMsg.firstElementChild.innerText = "These scores may not be up-to-date. Connect to the Internet to get updated scores.";
			}
		});
	});
})();