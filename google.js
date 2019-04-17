!function() {
	window.google = window.google || {
		onload: function() {
			gapi.load('client:auth2', function() {
				gapi.client.init({
					apiKey: "AIzaSyA4N_wK3p7My650gxypInNT7din48RrC-Y",
					discoveryDocs: ["https://people.googleapis.com/$discovery/rest?version=v1"],
					clientId: "493182103112-3tknfp0qv2kt53ne09r7bs8hu00efsav.apps.googleusercontent.com",
					scope: "profile"
				}).then(function() {
					function onUserChange() {
						gapi.client.people.people.get({
							resourceName: "people/me",
							"requestMask.includeField": "person.emailAddresses"
						}).then(function(response) {
							google.user.email = response.result.emailAddresses[0].value;

							if (["cheto1807@gmail.com","figgchristian@gmail.com","chfi1299@wascohsd.org"].includes(google.user.email)) {
								document.body.className = "loggedin";
								document.getElementById("prof_pic").src = "/svg/s.svg";
								google.isSignedIn = true;
								google.user.id = "stuff";
								google.user.pear = false;
								google.user.stuff = true;
							} else if (["glco1314@gmail.com","gladys.23.cortes@gmail.com","glco1314@wascohsd.org"].includes(google.user.email)) {
								document.body.className = "loggedin";
								document.getElementById("prof_pic").src = "/svg/p.svg";
								google.isSignedIn = true;
								google.user.id = "pear";
								google.user.pear = true;
								google.user.stuff = false;
							} else {
								document.getElementById("wrong_acct").innerText = "Who's " + google.user.email + "? Sorry dude, I don't know who you are."
								modal("Who are you?", "wrong_acct", ["Close"], [function(close){close()}]);
								google.signOut();
							}
						});
					}

					gapi.auth2.getAuthInstance().currentUser.listen(onUserChange);
					google.signedIn = gapi.auth2.getAuthInstance().isSignedIn.get();

					if (google.signedIn) {
						onUserChange();
					}

					google.signIn = function(args) {
						try {
							gapi.auth2.getAuthInstance().signIn(args).then(function() {
								onUserChange();
							});
						} catch (e) {console.log(e)}
					}
					google.signOut = function() {
						try {
							gapi.auth2.getAuthInstance().signOut().then(function() {
								document.body.className = "loggedout";
								google.signedIn = false;
								google.user.email = google.user.id = google.user.pear = google.user.stuff = null;
							});
						} catch (e) {}
					}

					document.getElementById("login_btn").addEventListener("click", google.signIn);
				});
			});
		},
		signedIn: null,
		signIn: null,
		signOut: null,
		refreshToken: null,
		user: {
			email: null,
			id: null,
			pear: null,
			stuff: null
		}
	};
}();