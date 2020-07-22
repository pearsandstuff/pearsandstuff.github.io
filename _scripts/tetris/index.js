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

	// If the user has a new high score but no Internet connection, make the Try Again button re-fetch the scores.
	document.getElementById("retry_scores").addEventListener("click", function() {
		game.uploadHighScore(game.stats.score);
		game.updateScores();
	});
})();