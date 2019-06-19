!function() {
	if (window.firebase) {
		var firebaseConfig = {
			apiKey: "AIzaSyCXHw_oa7u8vOi39iJu8cHCBEdZhKnn-Nc",
			authDomain: "pears-and-stuff-64a54.firebaseapp.com",
			databaseURL: "https://pears-and-stuff-64a54.firebaseio.com",
			projectId: "pears-and-stuff-64a54",
			storageBucket: "pears-and-stuff-64a54.appspot.com",
			messagingSenderId: "447970505533",
			appId: "1:447970505533:web:774f5db0ab78bc41"
		};
		firebase.initializeApp(firebaseConfig);
		var instance = firebase.auth();

		instance.onIdTokenChanged(function(user) {
			if (!auth.initted) {
				auth.initted = true;
				auth.initHandler(user);
			}

			auth.instance = firebase.auth();
			if (auth.user && !user) {
				auth.signedIn = false;
				auth.user = null;
				auth.userID = null;
				auth.onSignOut();
			} else if (!auth.user && user) {
				auth.signedIn = true;
				auth.user = user;
				auth.userID = user.uid == "IAKv57QVOBTxMoLlwun5CK9gO1A2" ? "s" : "p";
				auth.onSignIn(user);
			} else if (auth.user && user) {
				auth.user = user;
				auth.userID = user.uid == "IAKv57QVOBTxMoLlwun5CK9gO1A2" ? "s" : "p";
				auth.onUserChange(user);
			}
		});

		window.auth = {
			instance: instance,
			user: instance.currentUser,
			userID: instance.currentUser ? instance.currentUser.uid == "IAKv57QVOBTxMoLlwun5CK9gO1A2" ? "s" : "p" : null,
			signedIn: !!instance.currentUser,
			reauth: function(pw) {
				return this.instance.currentUser.reauthenticateWithCredential(firebase.auth.EmailAuthProvider.credential(this.instance.currentUser.email, pw));
			},
			signIn: function(pw) {
				auth.signIn.attempted = false;
				auth.signIn._then = auth.signIn._catch = function() {};
				auth.instance.signInWithEmailAndPassword("cheto1807@gmail.com", pw).then(function(e) {
					auth.signIn.attempted = true;
					auth.signIn._then(e);
				}).catch(function(e) {
					if (auth.signIn.attempted) {
						auth.signedIn.attempted = false;
						auth.signIn._catch(e);
					} else {	
						auth.signIn.attempted = true;
					}
				});
				auth.instance.signInWithEmailAndPassword("glco1314@gmail.com", pw).then(function(e) {
					auth.signIn.attempted = true;
					auth.signIn._then(e);
				}).catch(function(e) {
					if (auth.signIn.attempted) {
						auth.signedIn.attempted = false;
						auth.signIn._catch(e);
					} else {	
						auth.signIn.attempted = true;
					}
				});

				return {
					then: function(f) {
						auth.signIn._then = f;
						return this;
					},
					catch: function(f) {
						auth.signIn._catch = f;
						return this;
					}
				}
			},
			signOut: function() {
				if (!auth.signedIn) return;
				auth.instance.signOut();
			},
			onSignIn: function() {},
			onSignOut: function() {},
			onUserChange: function() {},
			handleInit: function(f) {
				this.initHandler = f;
				if (auth.initted) {
					f(auth.user);
				}
			},
			initHandler: function() {},
			initted: false,
			connected: true
		}
	} else {
		window.auth = {
			connected: false
		};
	}
}();
